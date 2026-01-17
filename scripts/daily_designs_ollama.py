import os
import requests
import random
import json
from datetime import datetime, UTC

API_BASE = os.environ.get("API_BASE", "https://ui-syntax.vercel.app")
OLLAMA_BASE = os.environ.get("OLLAMA_BASE", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama2")

if not API_BASE:
    raise SystemExit("Missing env: API_BASE")

# Component pool - 30 variants
COMPONENT_POOL = [
    ("button", "primary", "Primary Button"),
    ("button", "outlined", "Outlined Button"),
    ("button", "ghost", "Ghost Button"),
    ("button", "gradient", "Gradient Button"),
    ("button", "neumorphic", "Neumorphic Button"),
    ("card", "compact", "Compact Card"),
    ("card", "elevated", "Elevated Card"),
    ("card", "outline", "Outline Card"),
    ("card", "interactive", "Interactive Card"),
    ("card", "glass", "Glass Card"),
    ("input", "search", "Search Input"),
    ("input", "email", "Email Input"),
    ("input", "password", "Password Input"),
    ("input", "floating", "Floating Input"),
    ("input", "icon", "Icon Input"),
    ("badge", "solid", "Solid Badge"),
    ("badge", "outline", "Outline Badge"),
    ("badge", "dot", "Dot Badge"),
    ("badge", "gradient", "Gradient Badge"),
    ("alert", "success", "Success Alert"),
    ("alert", "warning", "Warning Alert"),
    ("alert", "error", "Error Alert"),
    ("loading", "spinner", "Loading Spinner"),
    ("loading", "pulse", "Pulse Loader"),
    ("loading", "bar", "Progress Bar"),
    ("modal", "basic", "Basic Modal"),
    ("toggle", "switch", "Toggle Switch"),
    ("skeleton", "card", "Skeleton Card"),
    ("text", "gradient", "Gradient Text"),
    ("divider", "line", "Divider Line"),
]

PROMPT_TEMPLATE = """
Create an exceptionally beautiful and modern {category} component ({variant} style).

Requirements:
- Use Tailwind CSS for styling with a stunning, professional design
- Make it visually striking with thoughtful use of colors, shadows, and animations
- Include smooth transitions and hover effects that delight users
- Ensure accessibility (ARIA labels, keyboard navigation, semantic HTML)
- Write clean, production-ready TypeScript/React code
- Use modern design trends: glass morphism, subtle gradients, smooth shadows
- Make it eye-catching enough that designers would want to use it immediately

Focus on creating something truly beautiful that stands out. Think Dribbble-quality design.

IMPORTANT: Your response MUST be in this exact JSON format:
{{
  "designName": "A creative 2-4 word design style name (e.g., 'Glass Morphism Glow', 'Neon Gradient', 'Minimal Shadow')",
  "code": "```tsx\\n[your component code here]\\n```"
}}

Return ONLY this JSON object, nothing else.
"""

def generate_code_with_ollama(category: str, variant: str) -> tuple[str, str]:
    """Generate code using Ollama (running in Docker)"""
    prompt = PROMPT_TEMPLATE.format(category=category, variant=variant)
    
    try:
        response = requests.post(
            f"{OLLAMA_BASE}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "temperature": 0.7,
            },
            timeout=120
        )
        response.raise_for_status()
        result = response.json().get("response", "")
        
        # Try to parse JSON response
        try:
            cleaned = result.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            
            data = json.loads(cleaned)
            design_name = data.get("designName", "").strip()
            code = data.get("code", "").strip()
            return design_name, code
        except Exception as e:
            print(f"⚠️  JSON parse failed: {e}")
            return "", result.strip()
    except Exception as e:
        print(f"❌ Ollama API error: {e}")
        raise

def post_design(payload: dict):
    """Create design in database"""
    url = f"{API_BASE}/api/designs"
    r = requests.post(url, json=payload, timeout=30)
    r.raise_for_status()
    return r.json()

def publish_design(design_id: str):
    """Publish a design"""
    url = f"{API_BASE}/api/designs/{design_id}/publish"
    r = requests.post(url, timeout=30)
    r.raise_for_status()
    return r.json()

def run_daily():
    """Generate 3 random designs"""
    selected = random.sample(COMPONENT_POOL, min(3, len(COMPONENT_POOL)))
    created = []
    
    for category, variant, base_name in selected:
        print(f"\n🎨 Generating: {base_name}...")
        try:
            design_name, code = generate_code_with_ollama(category, variant)
            if not code:
                print(f"⚠️  Skipped {category}/{variant}: empty code output")
                continue
            
            timestamp = datetime.now(UTC)
            if design_name:
                title = f"{base_name} - {design_name}"
            else:
                title = f"{base_name} {timestamp.strftime('%Y%m%d-%H%M')}"
            
            payload = {
                "title": title,
                "description": f"✨ Auto-generated stunning {category}/{variant} design via Ollama on {timestamp.isoformat()}",
                "category": category,
                "variant": variant,
                "code": code,
                "status": "draft",
                "source": "ollama",
                "metadata": {"model": OLLAMA_MODEL, "design_theme": design_name or "auto"},
            }
            
            res = post_design(payload)
            print(f"✅ Created: {title}")
            
            design_id = res.get("design", {}).get("id")
            if design_id:
                try:
                    pub_res = publish_design(design_id)
                    print(f"🚀 Published: {title}")
                    created.append(pub_res)
                except Exception as e:
                    print(f"⚠️  Created but failed to publish {design_id}: {e}")
                    created.append(res)
            else:
                print("⚠️  No design ID returned")
                created.append(res)
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print(f"\n🎉 Daily generation complete! Created {len(created)} designs.")
    return created

if __name__ == "__main__":
    run_daily()
