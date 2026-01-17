import os
import requests
from dotenv import load_dotenv

load_dotenv()

SITE_URL = os.getenv("SITE_URL", "https://ui-syntax.vercel.app")

# 삭제할 디자인 ID 목록 (날짜 형식 타이틀을 가진 것들)
design_ids_to_delete = [
    "cmki7tt1h000504l8760ohiii",  # Input Search 20260117
    "cmki7ti83000304l8szk6tzrs",  # Card Compact 20260117
    "cmki7svvc000104l8npwkrs3t",  # Button Outlined 20260117
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
    print("🗑️  Starting cleanup of old designs with date-based titles...\n")
    
    for design_id in design_ids_to_delete:
        delete_design(design_id)
    
    print(f"\n✨ Cleanup complete! Deleted {len(design_ids_to_delete)} designs.")

if __name__ == "__main__":
    main()
