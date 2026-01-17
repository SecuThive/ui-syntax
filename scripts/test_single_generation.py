import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash-exp')

PROMPT = """
Create an exceptionally beautiful and modern button component (outlined style).

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

print("🎨 Generating design...")
resp = model.generate_content(PROMPT)
result = resp.text

print("\n=== RAW RESPONSE (first 300 chars) ===")
print(result[:300])
print("...")

print("\n=== PARSING ===")
# Clean up
cleaned = result.strip()
if cleaned.startswith("```json"):
    cleaned = cleaned[7:]
    print("✅ Removed ```json prefix")
if cleaned.startswith("```"):
    cleaned = cleaned[3:]
    print("✅ Removed ``` prefix")
if cleaned.endswith("```"):
    cleaned = cleaned[:-3]
    print("✅ Removed ``` suffix")
cleaned = cleaned.strip()

print(f"\nCleaned text (first 200 chars): {cleaned[:200]}")

try:
    data = json.loads(cleaned)
    print(f"\n✅ JSON PARSED SUCCESSFULLY!")
    print(f"   Design Name: {data.get('designName')}")
    print(f"   Code length: {len(data.get('code', ''))} chars")
    print(f"   Code preview: {data.get('code', '')[:100]}...")
except Exception as e:
    print(f"\n❌ JSON PARSE FAILED: {e}")
    print(f"   Treating as plain code (fallback)")
