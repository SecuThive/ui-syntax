import os
import requests
import json
from datetime import datetime, UTC

API_BASE = os.environ.get("API_BASE", "https://ui-syntax.vercel.app")
OLLAMA_BASE = os.environ.get("OLLAMA_BASE", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "mistral")

if not API_BASE:
    raise SystemExit("Missing env: API_BASE")

COMPONENT_POOL = [
    ("button", "primary", "Primary Button"),
    ("button", "outlined", "Outlined Button"),
    ("button", "neumorphic", "Neumorphic Button"),
    ("card", "compact", "Compact Card"),
    ("card", "elevated", "Elevated Card"),
    ("input", "search", "Search Input"),
    ("input", "email", "Email Input"),
    ("input", "password", "Password Input"),
    ("badge", "solid", "Solid Badge"),
    ("badge", "outline", "Outline Badge"),
    ("alert", "success", "Success Alert"),
    ("alert", "warning", "Warning Alert"),
    ("alert", "error", "Error Alert"),
    ("loading", "spinner", "Loading Spinner"),
    ("loading", "pulse", "Pulse Loader"),
    ("loading", "bar", "Progress Bar"),
    ("skeleton", "card", "Skeleton Card"),
    ("skeleton", "text", "Skeleton Text"),
]

PROMPT_TEMPLATE = """Create a beautiful {category} component ({variant} style).

REQUIREMENTS:
- Include 'import React from "react";' at the top
- ONLY use Tailwind CSS (NO external libraries like framer-motion, react-icons, etc)
- NO other imports except React
- NO CSS files, inline styles, or external dependencies
- Pure JSX/TSX with inline Tailwind classes
- Smooth animations using only CSS/Tailwind
- Modern design with gradients, shadows, rounded corners
- Accessibility support (aria labels, semantic HTML)
- A creative and unique visual style

FORMAT REQUIREMENT - Return ONLY this JSON structure, no other text:
{
  "designName": "Creative style name (e.g., Glass Glow, Neon Pulse, Aurora, Frost)",
  "code": "import React from \\"react\\";\\n\\nexport default function Component() {\\n  return (\\n    ...your JSX here...\\n  );\\n}"
}}"""

def generate_code_with_ollama(category: str, variant: str) -> tuple[str, str]:
    """Generate code using Ollama"""
    prompt = PROMPT_TEMPLATE.format(category=category, variant=variant)
    
    try:
        response = requests.post(
            f"{OLLAMA_BASE}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "temperature": 0.5,
                "format": "json",
            },
            timeout=300
        )
        response.raise_for_status()
        result = response.json().get("response", "")
        
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
    """Create design"""
    url = f"{API_BASE}/api/designs"
    r = requests.post(url, json=payload, timeout=30)
    r.raise_for_status()
    return r.json()

def publish_design(design_id: str):
    """Publish design"""
    url = f"{API_BASE}/api/designs/{design_id}/publish"
    r = requests.post(url, timeout=30)
    r.raise_for_status()
    return r.json()

def main():
    """Generate initial design for all components"""
    print("[*] Generating initial designs for all components...\n")
    created = []
    
    for category, variant, base_name in COMPONENT_POOL:
        print(f"[+] Generating: {base_name}...", end=" ")
        try:
            design_name, code = generate_code_with_ollama(category, variant)
            if not code:
                print(f"[!] Skipped: empty code")
                continue
            
            timestamp = datetime.now(UTC)
            if design_name:
                title = f"{base_name} - {design_name}"
            else:
                title = f"{base_name} {timestamp.strftime('%Y%m%d')}"
            
            payload = {
                "title": title,
                "description": f"Initial design for {category}/{variant}",
                "category": category,
                "variant": variant,
                "code": code,
                "status": "draft",
                "source": "ollama-init",
                "metadata": {"model": OLLAMA_MODEL, "design_theme": design_name or "auto"},
            }
            
            res = post_design(payload)
            design_id = res.get("design", {}).get("id")
            if design_id:
                pub_res = publish_design(design_id)
                print(f"[OK] Created & Published")
                created.append(res)
            else:
                print("[!] Created but no ID")
                created.append(res)
                
        except Exception as e:
            print(f"[ERROR] {e}")
    
    print(f"\n[SUCCESS] Created {len(created)} designs.")
    return created

if __name__ == "__main__":
    main()
