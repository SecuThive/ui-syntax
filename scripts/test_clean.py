#!/usr/bin/env python3
"""
Clean test: Generate ONE design with proper validation
"""
import os
import requests
import json
from datetime import datetime, UTC

API_BASE = os.environ.get("API_BASE", "https://ui-syntax.vercel.app")
OLLAMA_BASE = os.environ.get("OLLAMA_BASE", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "mistral")

print("=" * 70)
print("CLEAN TEST - Single Design Generation with Validation")
print("=" * 70)
print(f"\nConfiguration:")
print(f"  API Base: {API_BASE}")
print(f"  Ollama Base: {OLLAMA_BASE}")
print(f"  Model: {OLLAMA_MODEL}")

# Test component
category = "button"
variant = "primary"
base_name = "PrimaryButton"

print(f"\n\nStep 1: Testing Ollama Connection...")
try:
    test_response = requests.get(f"{OLLAMA_BASE}/api/tags", timeout=5)
    if test_response.status_code == 200:
        print(f"  [OK] Ollama is running")
        models = test_response.json().get("models", [])
        for model in models:
            print(f"      - {model.get('name', 'Unknown')}")
    else:
        print(f"  [FAIL] Status: {test_response.status_code}")
        exit(1)
except Exception as e:
    print(f"  [ERROR] {e}")
    exit(1)

print(f"\n\nStep 2: Generating Code with Ollama...")
print(f"  Component: {category}/{variant}")

PROMPT = f"""Create a beautiful {category} component ({variant} style).

REQUIREMENTS:
- Include 'import React from "react";' at the top
- ONLY use Tailwind CSS (NO external libraries like framer-motion, react-icons, etc)
- NO other imports except React  
- Pure JSX/TSX with inline Tailwind classes
- Modern design with gradients, shadows, rounded corners

IMPORTANT: Return ONLY valid JSON, no other text:
{{
  "designName": "Creative name (e.g., Glass Glow, Neon Pulse)",
  "code": "import React from \\"react\\";\\n\\nexport default function {base_name}() {{\\n  return (<button>Button</button>);\\n}}"
}}"""

try:
    response = requests.post(
        f"{OLLAMA_BASE}/api/generate",
        json={
            "model": OLLAMA_MODEL,
            "prompt": PROMPT,
            "stream": False,
            "temperature": 0.5,
            "format": "json",
        },
        timeout=300
    )
    
    if response.status_code != 200:
        print(f"  [FAIL] Ollama returned {response.status_code}")
        exit(1)
    
    result = response.json().get("response", "")
    print(f"  [OK] Response received")
    
    # Parse JSON
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
    
    if not design_name or not code:
        print(f"  [FAIL] Missing designName or code in response")
        print(f"         designName: {design_name}")
        print(f"         code length: {len(code)}")
        exit(1)
    
    print(f"  [OK] JSON parsed successfully")
    print(f"       Design: {design_name}")
    print(f"       Code: {len(code)} chars")
    
    # Validate code structure
    if "import React" not in code:
        print(f"  [WARN] Code missing 'import React'")
    if "export default" not in code:
        print(f"  [WARN] Code missing 'export default'")
    if "framer-motion" in code or "react-icons" in code:
        print(f"  [FAIL] Code contains external libraries!")
        exit(1)
    
    print(f"\n  Code preview:")
    lines = code.split('\n')[:5]
    for line in lines:
        print(f"    {line}")
    print(f"    ...")
    
except json.JSONDecodeError as e:
    print(f"  [FAIL] JSON parse error: {e}")
    print(f"         Response: {result[:200]}")
    exit(1)
except Exception as e:
    print(f"  [ERROR] {e}")
    exit(1)

print(f"\n\nStep 3: Saving to Database...")

try:
    payload = {
        "category": category,
        "variant": variant,
        "title": f"{base_name} - {design_name}",
        "description": f"A {design_name} style {category}",
        "code": code,
        "source": "ollama-clean-test",
        "status": "published"
    }
    
    print(f"  Payload:")
    print(f"    Title: {payload['title']}")
    print(f"    Category: {payload['category']}")
    print(f"    Variant: {payload['variant']}")
    
    response = requests.post(
        f"{API_BASE}/api/designs",
        json=payload,
        timeout=10
    )
    
    if response.status_code not in [200, 201]:
        print(f"  [FAIL] Status {response.status_code}")
        print(f"         {response.text[:200]}")
        exit(1)
    
    result_data = response.json()
    design_id = result_data.get('design', {}).get('id')
    
    if not design_id:
        print(f"  [FAIL] No design ID in response")
        exit(1)
    
    print(f"  [OK] Saved successfully")
    print(f"       ID: {design_id}")
        
except Exception as e:
    print(f"  [ERROR] {e}")
    exit(1)

print(f"\n\nStep 4: Verifying Saved Design...")

try:
    # Query by ID
    response = requests.get(
        f"{API_BASE}/api/designs/{design_id}",
        timeout=10
    )
    
    if response.status_code != 200:
        print(f"  [FAIL] Could not fetch by ID: {response.status_code}")
        exit(1)
    
    design = response.json().get('design', {})
    
    print(f"  [OK] Design retrieved by ID")
    print(f"       Title: {design.get('title')}")
    print(f"       Category: {design.get('category')}")
    print(f"       Variant: {design.get('variant')}")
    print(f"       Status: {design.get('status')}")
    print(f"       Code: {len(design.get('code', ''))} chars")
    
    # Verify code is intact
    stored_code = design.get('code', '')
    if stored_code != code:
        print(f"  [WARN] Stored code differs from original!")
    else:
        print(f"  [OK] Code verified - matches exactly")
        
except Exception as e:
    print(f"  [ERROR] {e}")
    exit(1)

print(f"\n\nStep 5: Testing Preview Rendering Logic...")

try:
    # Simulate what preview-simple.tsx does
    import re
    
    # Remove imports
    code_no_imports = re.sub(
        r'^import\s+[\s\S]*?from\s+[\'"][^\'"]*[\'"]\s*;?\n*',
        '',
        stored_code,
        flags=re.MULTILINE
    ).strip()
    
    # Remove export default
    code_clean = re.sub(r'export\s+default\s+', '', code_no_imports).strip()
    
    # Extract component name
    const_match = re.search(r'const\s+(\w+)\s*=\s*\(?\)?', code_clean)
    func_match = re.search(r'function\s+(\w+)\s*\(', code_clean)
    component_name = const_match.group(1) if const_match else (func_match.group(1) if func_match else 'Component')
    
    print(f"  [OK] Code processing simulation:")
    print(f"       Component name: {component_name}")
    print(f"       Code after cleanup: {len(code_clean)} chars")
    print(f"       Has React: {'React' in code_clean}")
    print(f"       Has JSX: {'<' in code_clean and '>' in code_clean}")
    
except Exception as e:
    print(f"  [ERROR] {e}")
    exit(1)

print(f"\n\n" + "=" * 70)
print("TEST COMPLETE - ALL STEPS PASSED")
print("=" * 70)
print(f"\nNext step: Visit https://ui-syntax.vercel.app/docs/{category}/{variant}")
print(f"Expected: Design preview should render correctly")
print()
