import os
import requests
from dotenv import load_dotenv

load_dotenv()

SITE_URL = os.getenv("SITE_URL", "https://ui-syntax.vercel.app")

# 새로 삭제할 디자인 ID 목록
design_ids_to_delete = [
    "cmki8tizc000304lelqza46km",  # Password Input 20260117-1147
    "cmki8sdk9000104le4v92t3he",  # Email Input 20260117-1146
]

def delete_design(design_id: str):
    """디자인 삭제"""
    url = f"{SITE_URL}/api/designs/{design_id}"
    
    try:
        response = requests.delete(url)
        if response.status_code == 200:
            print(f"✅ Deleted design {design_id}")
        else:
            print(f"❌ Failed to delete {design_id}: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error deleting {design_id}: {e}")

def main():
    print("🗑️  Deleting date-based designs...\n")
    
    for design_id in design_ids_to_delete:
        delete_design(design_id)
    
    print(f"\n✨ Deleted {len(design_ids_to_delete)} designs.")

if __name__ == "__main__":
    main()
