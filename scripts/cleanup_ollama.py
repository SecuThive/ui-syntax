import os
import requests
from dotenv import load_dotenv

load_dotenv()

SITE_URL = os.getenv("SITE_URL", "https://ui-syntax.vercel.app")

# 삭제할 날짜 형식 디자인들
design_ids_to_delete = [
    "cmkiaz7eu000104l1clh9n1rp",  # Neumorphic Button 20260117-1248
    "cmkiavd3v000104l2gak88wxz",  # Progress Bar 20260117-1245
    "cmkiapmy3000104jreaobpvnl",  # Skeleton Card 20260117-1240
    "cmkiaoamb000104l4wh90mzws",  # Solid Badge 20260117-1239
]

def delete_design(design_id: str):
    """디자인 삭제"""
    url = f"{SITE_URL}/api/designs/{design_id}"
    
    try:
        response = requests.delete(url)
        if response.status_code == 200:
            print(f"✅ Deleted {design_id}")
        else:
            print(f"❌ Failed to delete {design_id}: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("🗑️  Deleting old date-based Ollama designs...\n")
    for design_id in design_ids_to_delete:
        delete_design(design_id)
    print(f"\n✨ Deleted {len(design_ids_to_delete)} designs.")

if __name__ == "__main__":
    main()
