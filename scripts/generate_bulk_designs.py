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

PROMPT_TEMPLATE = """Create a beautiful {category} component ({variant} style) with:
- Tailwind CSS styling
- Smooth animations and hover effects
- Modern design (glass morphism, gradients, shadows)
- Clean React/TypeScript code
- Accessibility support

CRITICAL: Respond with ONLY this JSON, no other text:
{{
  "designName": "Creative name (e.g., Glass Glow, Neon Gradient)",
  "code": "```tsx\\n[component code]\\n```"
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
            print(f"[!] JSON parse failed: {e}")
            return "", result.strip()
    except Exception as e:
        print(f"[ERROR] Ollama API error: {e}")
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
    """Generate 3 designs for each component"""
    print("[*] Generating 3 designs for each component (54 total)...\n")
    created = 0
    failed = 0
    
    for category, variant, base_name in COMPONENT_POOL:
        for i in range(3):
            print(f"[+] {base_name} ({i+1}/3)...", end=" ")
            try:
                design_name, code = generate_code_with_ollama(category, variant)
                if not code:
                    print(f"[!] Skipped: empty code")
                    failed += 1
                    continue
                
                timestamp = datetime.now(UTC)
                if design_name:
                    title = f"{base_name} - {design_name}"
                else:
                    title = f"{base_name} V{i+1}"
                
                payload = {
                    "title": title,
                    "description": f"Design variant {i+1} for {category}/{variant}",
                    "category": category,
                    "variant": variant,
                    "code": code,
                    "status": "draft",
                    "source": "ollama-bulk",
                    "metadata": {"model": OLLAMA_MODEL, "variant": i+1, "design_theme": design_name or f"v{i+1}"},
                }
                
                res = post_design(payload)
                design_id = res.get("design", {}).get("id")
                if design_id:
                    publish_design(design_id)
                    print(f"[OK]")
                    created += 1
                else:
                    print("[!] No ID returned")
                    failed += 1
                    
            except Exception as e:
                print(f"[ERROR] {e}")
                failed += 1
    
    total = len(COMPONENT_POOL) * 3
    print(f"\n[SUCCESS] Created {created}/{total} designs. Failed: {failed}")
    return created

if __name__ == "__main__":
    main()
