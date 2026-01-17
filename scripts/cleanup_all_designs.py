import requests
import sys

# Use deployed Vercel API
API_BASE = "https://ui-syntax.vercel.app"

def delete_all_designs():
    """Delete all designs from the database"""
    try:
        # Get all designs
        print("Fetching all designs...")
        response = requests.get(f"{API_BASE}/api/designs")
        
        if response.status_code != 200:
            print(f"Failed to fetch designs: {response.status_code}")
            return
        
        data = response.json()
        designs = data.get('designs', [])
        
        if not designs:
            print("No designs found in database.")
            return
        
        print(f"\nFound {len(designs)} designs to delete.")
        
        # Delete each design
        deleted_count = 0
        failed_count = 0
        
        for design in designs:
            design_id = design.get('id')
            title = design.get('title', 'Unknown')
            category = design.get('category', 'Unknown')
            variant = design.get('variant', 'Unknown')
            
            print(f"Deleting: {title} ({category}/{variant}) [ID: {design_id}]...")
            
            try:
                delete_response = requests.delete(f"{API_BASE}/api/designs/{design_id}")
                
                if delete_response.status_code == 200:
                    deleted_count += 1
                    print(f"  -> Deleted successfully")
                else:
                    failed_count += 1
                    print(f"  -> Failed to delete: {delete_response.status_code}")
            except Exception as e:
                failed_count += 1
                print(f"  -> Error deleting: {str(e)}")
        
        print(f"\n=== Cleanup Complete ===")
        print(f"Successfully deleted: {deleted_count}")
        print(f"Failed to delete: {failed_count}")
        print(f"Total processed: {len(designs)}")
        
    except Exception as e:
        print(f"Error during cleanup: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    print("=" * 50)
    print("DATABASE CLEANUP - DELETE ALL DESIGNS")
    print("=" * 50)
    delete_all_designs()
