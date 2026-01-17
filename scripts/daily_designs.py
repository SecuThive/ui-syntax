import os
import requests
from datetime import datetime

try:
    import google.generativeai as genai
except ImportError:
    raise SystemExit("google-generativeai is not installed. Run: pip install -r scripts/requirements.txt")

API_BASE = os.environ.get("API_BASE")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash-exp")

if not API_BASE:
    raise SystemExit("Missing env: API_BASE (e.g., https://your-app.vercel.app)")
if not GOOGLE_API_KEY:
    raise SystemExit("Missing env: GOOGLE_API_KEY")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel(MODEL_NAME)

TARGETS = [
    ("button", "outlined", "Button Outlined " + datetime.utcnow().strftime("%Y%m%d")),
    ("card", "compact", "Card Compact " + datetime.utcnow().strftime("%Y%m%d")),
    ("input", "search", "Input Search " + datetime.utcnow().strftime("%Y%m%d")),
]

PROMPT_TEMPLATE = """
Generate a modern Tailwind/React snippet for {category}/{variant}.
Constraints:
- JSX/TSX compatible
- Minimal external deps
- Accessible attributes
Return ONLY code (no explanations).
"""

def generate_code(category: str, variant: str) -> str:
    prompt = PROMPT_TEMPLATE.format(category=category, variant=variant)
    resp = model.generate_content(prompt)
    code = resp.text or ""
    return code.strip()

def post_design(payload: dict):
    url = f"{API_BASE}/api/designs"
    r = requests.post(url, json=payload, timeout=30)
    r.raise_for_status()
    return r.json()


def run_daily():
    created = []
    for category, variant, title in TARGETS:
        code = generate_code(category, variant)
        if not code:
            print(f"Skipped {category}/{variant}: empty code output")
            continue
        payload = {
            "title": title,
            "description": f"Auto-generated {category}/{variant} via Gemini on {datetime.utcnow().isoformat()}",
            "category": category,
            "variant": variant,
            "code": code,
            "status": "draft",
            "source": "gemini",
            "metadata": {"model": MODEL_NAME},
        }
        try:
            res = post_design(payload)
            print("Created:", res)
            created.append(res)
        except Exception as e:
            print("Error posting design:", e)
    return created

if __name__ == "__main__":
    run_daily()
