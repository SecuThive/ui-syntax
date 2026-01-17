import os
import requests
import random
from datetime import datetime, UTC

try:
    import google.generativeai as genai
except ImportError:
    raise SystemExit("google-generativeai is not installed. Run: pip install -r scripts/requirements.txt")

API_BASE = os.environ.get("API_BASE")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

if not API_BASE:
    raise SystemExit("Missing env: API_BASE (e.g., https://your-app.vercel.app)")
if not GOOGLE_API_KEY:
    raise SystemExit("Missing env: GOOGLE_API_KEY")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel(
    MODEL_NAME,
    generation_config={
        "response_mime_type": "application/json",
    }
)

# All available component combinations
COMPONENT_POOL = [
    ("button", "primary", "Primary Button"),
    ("button", "outlined", "Outlined Button"),
    ("button", "ghost", "Ghost Button"),
    ("button", "gradient", "Gradient Button"),
    ("button", "neumorphic", "Neumorphic Button"),
    ("button", "group", "Button Group"),
    ("card", "default", "Default Card"),
    ("card", "compact", "Compact Card"),
    ("card", "elevated", "Elevated Card"),
    ("card", "gradient", "Gradient Card"),
    ("card", "interactive", "Interactive Card"),
    ("input", "text", "Text Input"),
    ("input", "email", "Email Input"),
    ("input", "password", "Password Input"),
    ("input", "search", "Search Input"),
    ("badge", "primary", "Primary Badge"),
    ("badge", "secondary", "Secondary Badge"),
    ("badge", "success", "Success Badge"),
    ("alert", "info", "Info Alert"),
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

def generate_code(category: str, variant: str) -> tuple[str, str]:
    """Generate code and design name from Gemini"""
    prompt = PROMPT_TEMPLATE.format(category=category, variant=variant)
    resp = model.generate_content(prompt)
    result = resp.text or ""
    
    # Try to parse JSON response
    try:
        import json
        # Clean up response (remove markdown code blocks if present)
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
        print(f"⚠️  JSON parse failed, using fallback: {e}")
        # Fallback: treat entire response as code
        return "", result.strip()

def post_design(payload: dict):
    url = f"{API_BASE}/api/designs"
    r = requests.post(url, json=payload, timeout=30)
    r.raise_for_status()
    return r.json()


def publish_design(design_id: str):
    """Publish a draft design to make it live"""
    url = f"{API_BASE}/api/designs/{design_id}/publish"
    r = requests.post(url, timeout=30)
    r.raise_for_status()
    return r.json()


def run_daily():
    # Select 3 random components
    selected = random.sample(COMPONENT_POOL, min(3, len(COMPONENT_POOL)))
    created = []
    
    for category, variant, base_name in selected:
        print(f"\n🎨 Generating: {base_name}...")
        design_name, code = generate_code(category, variant)
        if not code:
            print(f"⚠️  Skipped {category}/{variant}: empty code output")
            continue
        
        # Use creative design name if available, otherwise use base name with timestamp
        timestamp = datetime.now(UTC)
        if design_name:
            title = f"{base_name} - {design_name}"
        else:
            title = f"{base_name} {timestamp.strftime('%Y%m%d-%H%M')}"
        
        payload = {
            "title": title,
            "description": f"✨ Auto-generated stunning {category}/{variant} design via Gemini on {timestamp.isoformat()}",
            "category": category,
            "variant": variant,
            "code": code,
            "status": "draft",
            "source": "gemini",
            "metadata": {"model": MODEL_NAME, "design_theme": design_name or "auto"},
        }
        try:
            res = post_design(payload)
            print(f"✅ Created: {title}")
            
            # Auto-publish the design
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
                print("⚠️  No design ID returned, skipping publish")
                created.append(res)
        except Exception as e:
            print(f"❌ Error posting design: {e}")
    
    print(f"\n🎉 Daily generation complete! Created {len(created)} designs.")
    return created

if __name__ == "__main__":
    run_daily()
