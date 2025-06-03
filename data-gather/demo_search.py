#!/usr/bin/env python3
"""
Business Online Presence Search Demo

This script demonstrates how to use the business online search functionality
to find social media profiles and websites for businesses, with confidence scores.
"""

from leads_importer import search_business_online

def main():
    # Example businesses to search for
    businesses = [
        {"name": "Latvijas Mobilais Telefons", "type": "SIA"},
        {"name": "Tieto Latvia", "type": "SIA"},
        {"name": "Citadele banka", "type": "AS"},
        {"name": "Macovel", "type": "SIA"}
    ]
    
    for business in businesses:
        name = business["name"]
        reg_type = business["type"]
        
        print(f"\nSearching for: {name} ({reg_type})")
        print("=" * 60)
        
        # Call the search function
        print(f"Starting search and verification process...")
        results = search_business_online(name, reg_type)
        
        # Display results
        print("\nFinal Results:")
        print("-" * 40)
        
        # Website result
        if results["website"]:
            print(f"✓ Website: {results['website']}")
        else:
            print("✗ No verified website found")
            
        # Social media results
        if results["social_media"]:
            print("\nSocial Media Profiles:")
            for platform, url in results["social_media"].items():
                print(f"  ✓ {platform.capitalize()}: {url}")
        else:
            print("\n✗ No social media profiles found")
        
        print("=" * 60)

if __name__ == "__main__":
    main() 