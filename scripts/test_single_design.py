#!/usr/bin/env python3
"""
Test script: Generate one design and verify it works
"""
import os
import requests
import json
from datetime import datetime, UTC

API_BASE = os.environ.get("API_BASE", "https://ui-syntax.vercel.app")
OLLAMA_BASE = os.environ.get("OLLAMA_BASE", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "mistral")

print("=" * 70)
print("DESIGN GENERATION TEST - Single Component")
print("=" * 70)
print(f"\nConfiguration:")
print(f"  API Base: {API_BASE}")
print(f"  Ollama Base: {OLLAMA_BASE}")
print(f"  Model: {OLLAMA_MODEL}")

# Test component
category = "button"
variant = "primary"
base_name = "Primary Button"

print(f"\n\nStep 1: Testing Ollama Connection...")
print(f"  Target: {OLLAMA_BASE}")

try:
    # Test Ollama connection
    test_response = requests.get(f"{OLLAMA_BASE}/api/tags", timeout=5)
    if test_response.status_code == 200:
        print("  ✅ Ollama connection successful")
        models = test_response.json().get("models", [])
        print(f"  Available models: {len(models)}")
        for model in models:
            print(f"    - {model.get('name', 'Unknown')}")
    else:
        print(f"  ❌ Ollama connection failed: {test_response.status_code}")
        exit(1)
except Exception as e:
    print(f"  ❌ Connection error: {e}")
    exit(1)

print(f"\n\nStep 2: Generating Code with Ollama...")
print(f"  Component: {category}/{variant} ({base_name})")

PROMPT = f"""Create a beautiful {category} component ({variant} style) with:
- Tailwind CSS styling
- Smooth animations and hover effects
- Modern design
- Clean React/TypeScript code
- Accessibility support

CRITICAL: Respond with ONLY valid JSON, no other text or code blocks:
{{
  "designName": "Creative name (e.g., Glass Glow, Neon)",
  "code": "export default function {base_name.replace(' ', '')}() {{ ... }}"
}}"""

try:
    print(f"\n  Sending request to Ollama...")
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
        print(f"  ❌ Ollama request failed: {response.status_code}")
        print(f"     Response: {response.text[:200]}")
        exit(1)
    
    print(f"  ✅ Ollama response received")
    result = response.json().get("response", "")
    
    print(f"\n  Parsing JSON response...")
    # Clean up response
    cleaned = result.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()
    
    data = json.loads(cleaned)
    design_name = data.get("designName", "").strip() or f"{base_name} v1"
    code = data.get("code", "").strip()
    
    print(f"  ✅ JSON parsed successfully")
    print(f"     Design Name: {design_name}")
    print(f"     Code Length: {len(code)} chars")
    print(f"     Code Preview: {code[:100]}...")
    
except json.JSONDecodeError as e:
    print(f"  ❌ JSON parsing failed: {e}")
    print(f"     Raw response: {result[:300]}")
    exit(1)
except Exception as e:
    print(f"  ❌ Error: {e}")
    exit(1)

print(f"\n\nStep 3: Saving to Database...")
print(f"  API Endpoint: {API_BASE}/api/designs")

try:
    payload = {
        "category": category,
        "variant": variant,
        "title": f"{base_name} - {design_name}",
        "description": f"A {design_name} style {category} component",
        "code": code,
        "source": "ollama-test",
        "status": "published"
    }
    
    print(f"\n  Payload:")
    print(f"    Title: {payload['title']}")
    print(f"    Category: {payload['category']}")
    print(f"    Variant: {payload['variant']}")
    print(f"    Status: {payload['status']}")
    print(f"    Code Length: {len(payload['code'])} chars")
    
    response = requests.post(
        f"{API_BASE}/api/designs",
        json=payload,
        timeout=10
    )
    
    if response.status_code in [200, 201]:
        result_data = response.json()
        design_id = result_data.get('design', {}).get('id', 'Unknown')
        print(f"\n  ✅ Design saved successfully")
        print(f"     Design ID: {design_id}")
    else:
        print(f"\n  ❌ Save failed: {response.status_code}")
        print(f"     Response: {response.text}")
        exit(1)
        
except Exception as e:
    print(f"  ❌ Error saving: {e}")
    exit(1)

print(f"\n\nStep 4: Verifying Design in Database...")

try:
    response = requests.get(
        f"{API_BASE}/api/designs?category={category}&variant={variant}&status=published",
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        designs = data.get('designs', [])
        print(f"  ✅ Designs found: {len(designs)}")
        
        if designs:
            latest = designs[0]
            print(f"\n  Latest Design:")
            print(f"    Title: {latest.get('title', 'N/A')}")
            print(f"    Status: {latest.get('status', 'N/A')}")
            print(f"    Source: {latest.get('source', 'N/A')}")
            print(f"    Code Length: {len(latest.get('code', ''))} chars")
        else:
            print(f"  ❌ No designs found for {category}/{variant}")
    else:
        print(f"  ❌ Query failed: {response.status_code}")
        
except Exception as e:
    print(f"  ❌ Error verifying: {e}")

print(f"\n\n" + "=" * 70)
print("TEST COMPLETE")
print("=" * 70)
print(f"\n✅ Visit: {API_BASE}/docs/{category}/{variant}")
print(f"   to see the generated design in action!")
print()
