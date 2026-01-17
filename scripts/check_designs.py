import requests
import json

API_BASE = "https://ui-syntax.vercel.app"

def check_designs():
    """Check all designs in the database"""
    try:
        print("Fetching all designs from database...\n")
        response = requests.get(f"{API_BASE}/api/designs")
        
        if response.status_code != 200:
            print(f"Failed to fetch designs: {response.status_code}")
            return
        
        data = response.json()
        designs = data.get('designs', [])
        
        print(f"=" * 70)
        print(f"Total designs in database: {len(designs)}")
        print(f"=" * 70)
        
        if not designs:
            print("\nDatabase is empty.")
            return
        
        print()
        for idx, design in enumerate(designs, 1):
            title = design.get('title', 'No title')
            category = design.get('category', 'N/A')
            variant = design.get('variant', 'N/A')
            status = design.get('status', 'N/A')
            source = design.get('source', 'N/A')
            design_id = design.get('id', 'N/A')
            
            print(f"{idx}. {title}")
            print(f"   Category: {category} | Variant: {variant}")
            print(f"   Status: {status} | Source: {source}")
            print(f"   ID: {design_id}")
            print()
        
    except Exception as e:
        print(f"Error checking designs: {str(e)}")

if __name__ == "__main__":
    check_designs()
