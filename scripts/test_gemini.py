import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash-exp')

prompt = """Create an exceptionally beautiful and modern button component (outlined style).

IMPORTANT: Your response MUST be in this exact JSON format:
{
  "designName": "A creative 2-4 word design style name (e.g., 'Glass Morphism Glow', 'Neon Gradient')",
  "code": "```tsx\\n[your component code here]\\n```"
}

Return ONLY this JSON object, nothing else."""

resp = model.generate_content(prompt)
print('=== RAW RESPONSE ===')
print(resp.text)
print('\n=== PARSING ===')

# Try to parse
result = resp.text.strip()
if result.startswith("```json"):
    result = result[7:]
if result.startswith("```"):
    result = result[3:]
if result.endswith("```"):
    result = result[:-3]
result = result.strip()

try:
    data = json.loads(result)
    print(f"✅ Design Name: {data.get('designName')}")
    print(f"✅ Code length: {len(data.get('code', ''))} chars")
except Exception as e:
    print(f"❌ Parse failed: {e}")
