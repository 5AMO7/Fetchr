import hashlib
import requests
import pymysql
from dotenv import load_dotenv
import traceback
import os
import sys
import io
import csv
from io import StringIO
from bs4 import BeautifulSoup
import re
import time
import random

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

REGISTRY_URL = "https://data.gov.lv/dati/dataset/4de9697f-850b-45ec-8bba-61fa09ce932f/resource/25e80bf3-f107-4ab4-89ef-251b5b9374e9/download/register.csv"
BENEFICIAL_OWNERS_URL = "https://data.gov.lv/dati/dataset/b7848ab9-7886-4df0-8bc6-70052a8d9e1a/resource/20a9b26d-d056-4dbb-ae18-9ff23c87bdee/download/beneficial_owners.csv"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "rawrat12",
    "database": "fetchr",
    "charset": "utf8mb4"
}


def download_csv_data():
    response = requests.get(REGISTRY_URL)
    response.raise_for_status()
    return StringIO(response.content.decode("utf-8"))


def verify_website_ownership(url, business_name, reg_type):
    """
    Verify that a website belongs to the correct business by checking its content
    
    Args:
        url (str): Website URL to verify
        business_name (str): Business name to look for
        reg_type (str): Registration type to look for
    
    Returns:
        float: A confidence score between 0 and 1
    """
    if not url:
        return 0.0
    
    # Exclude company directory/registry sites
    excluded_sites = ['lursoft.lv', 'firmas.lv', 'company-information.service', 'companylist']
    if any(site in url.lower() for site in excluded_sites):
        print(f"Skipping directory/registry site: {url}")
        return 0.0
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Fetch the website content
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return 0.0
            
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Get the text content of the page
        page_text = soup.get_text().lower()
        
        # Initialize confidence score
        confidence = 0.0
        
        # Prepare business name for comparison - strip special characters and extra whitespace
        clean_business_name = re.sub(r'[^\w\s]', '', business_name.lower()).strip()
        words_in_name = clean_business_name.split()
        
        # Basic presence check - at least give some confidence if business name appears on page
        if clean_business_name in page_text:
            confidence += 0.3
        # Also check for partial match (at least half of the words)
        elif sum(1 for word in words_in_name if len(word) > 3 and word in page_text) >= len(words_in_name) / 2:
            confidence += 0.2
        
        # Check for business name in the title (very strong indicator)
        if soup.title:
            title_text = soup.title.text.lower()
            if clean_business_name in title_text:
                confidence += 0.3
            # Partial match in title
            elif sum(1 for word in words_in_name if len(word) > 3 and word in title_text) >= len(words_in_name) / 2:
                confidence += 0.2
        
        # Check for proximity of business name and registration type
        normalized_text = ' '.join(page_text.split())
        # Try different separators and formats for business name + reg type
        patterns = [
            rf"{re.escape(clean_business_name)}\s*[,.-]?\s*{re.escape(reg_type.lower())}",
            rf"{re.escape(reg_type.lower())}\s*[,.-]?\s*{re.escape(clean_business_name)}",
            rf"{re.escape(clean_business_name)}\s+{re.escape(reg_type.lower())}"
        ]
        for pattern in patterns:
            if re.search(pattern, normalized_text):
                confidence += 0.3
                break
            
        # Check for registration number if it exists in footers, contacts, or about pages
        footer_elements = soup.find_all(['footer', 'div'], class_=lambda c: c and ('footer' in str(c).lower() or 'contact' in str(c).lower() or 'about' in str(c).lower()))
        for element in footer_elements:
            element_text = element.get_text().lower()
            if clean_business_name in element_text and reg_type.lower() in element_text:
                confidence += 0.2
                break
        
        # Look for contact info, legal notices, etc. which often include registration info
        legal_elements = soup.find_all(['div', 'section', 'p'], class_=lambda c: c and ('legal' in str(c).lower() or 'contact' in str(c).lower()))
        for element in legal_elements:
            text = element.get_text().lower()
            if clean_business_name in text and reg_type.lower() in text:
                confidence += 0.2
                break
        
        # Check metadata
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and clean_business_name in meta_desc.get('content', '').lower():
            confidence += 0.1
            
        # Give some base confidence if we've reached this point
        # This prevents zero confidence for sites that might be legitimate but don't match our patterns
        if confidence == 0.0 and not any(term in url.lower() for term in ['wiki', 'news', 'blog']):
            confidence = 0.1
        
        # Cap confidence at 1.0
        return min(confidence, 1.0)
        
    except Exception as e:
        print(f"Error verifying website {url}: {str(e)}")
        # Give minimal confidence to try again later
        return 0.1


def verify_social_media(url, business_name, reg_type):
    """
    Verify that a social media profile belongs to the correct business
    
    Args:
        url (str): Social media URL to verify
        business_name (str): Business name to look for
        reg_type (str): Registration type to look for
    
    Returns:
        float: A confidence score between 0 and 1
    """
    if not url:
        return 0.0
    
    # Clean business name for matching
    clean_business_name = re.sub(r'[^\w\s]', '', business_name.lower()).strip()
    words_in_name = clean_business_name.split()
    
    # Extract username from URL for direct matching
    username_match = re.search(r'(?:facebook|instagram|linkedin|twitter|x)\.com/(?:company/|in/)?([^/\?#]+)', url.lower())
    if username_match:
        username = username_match.group(1)
        
        # Check if username contains significant parts of the business name
        name_parts_in_username = sum(1 for word in words_in_name if len(word) > 3 and word in username)
        if name_parts_in_username >= max(1, len(words_in_name) / 3):
            return 0.7  # High confidence based on URL pattern alone
        
        # Check for initials or abbreviation
        if len(username) >= 2 and all(username.startswith(word[0]) for word in words_in_name[:len(username)]):
            return 0.6  # Decent confidence for initial match
            
    # For social media, try accessing the page but don't require it since many platforms block scraping
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Fetch the social media profile
        response = requests.get(url, headers=headers, timeout=5)  # Shorter timeout for social media
        if response.status_code != 200:
            # Return moderate confidence even if we can't access it
            return 0.5
            
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Get the text content
        page_text = soup.get_text().lower()
        
        # Initialize confidence score
        confidence = 0.5  # Start with moderate confidence
        
        # Check for business name in the profile
        if clean_business_name in page_text:
            confidence += 0.3
        elif sum(1 for word in words_in_name if len(word) > 3 and word in page_text) >= len(words_in_name) / 2:
            confidence += 0.2
        
        # Check if business name is in title or metadata
        if soup.title and clean_business_name in soup.title.text.lower():
            confidence += 0.2
        
        # Check for reg type near business name
        if reg_type.lower() in page_text:
            sentences = re.split(r'[.!?]', page_text)
            for sentence in sentences:
                if clean_business_name in sentence and reg_type.lower() in sentence:
                    confidence += 0.1
                    break
        
        # Cap confidence at 1.0
        return min(confidence, 1.0)
        
    except Exception as e:
        print(f"Error verifying social media {url}: {str(e)}")
        # For social media, we're more lenient - return moderate confidence
        # Often social media sites block scraping
        return 0.5


def search_business_online(business_name, reg_type):
    """
    Search for a business online to find social media profiles and website.
    
    Args:
        business_name (str): The name of the business
        reg_type (str): The registration type (e.g., SIA)
    
    Returns:
        dict: A dictionary containing found social media profiles and website URL
    """
    results = {
        'website': None,
        'social_media': {
            'facebook': None,
            'instagram': None,
            'linkedin': None,
            'twitter': None
        }
    }
    
    # Create search queries based on business name and registration type
    search_queries = [
        f"{business_name} {reg_type} official website",
        f"{business_name} {reg_type} contact",
        f"{business_name} {reg_type} social media"
    ]
    
    # Add the queries without registration type for broader results
    search_queries.append(f"{business_name} official website")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    # Social media domain patterns to look for
    social_media_patterns = {
        'facebook': r'facebook\.com/[^/"\s\?&#]+',
        'instagram': r'instagram\.com/[^/"\s\?&#]+',
        'linkedin': r'linkedin\.com/(?:company|in)/[^/"\s\?&#]+',
        'twitter': r'(?:twitter\.com|x\.com)/[^/"\s\?&#]+'
    }
    
    # Website pattern (simple pattern, can be improved)
    website_pattern = rf'{re.escape(business_name.lower())}\.(?:com|lv|eu|net|org|io)'
    
    # Exclude patterns for directory/registry sites
    exclude_patterns = ['lursoft.lv', 'firmas.lv', 'kontakti.lv', 'balticmarket.com', 'company-information', 'wiki', 'facebook.com/pages']
    
    # Store potential websites with confidence scores
    potential_websites = []
    
    # Store potential social media profiles
    potential_social_media = {
        'facebook': [],
        'instagram': [],
        'linkedin': [],
        'twitter': []
    }
    
    for query in search_queries:
        # Use Bing search (less restrictive than Google for automated queries)
        search_url = f"https://www.bing.com/search?q={query.replace(' ', '+')}"
        
        try:
            response = requests.get(search_url, headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract all links from the search results
                links = soup.find_all('a', href=True)
                for link in links:
                    href = link['href']
                    
                    # Skip excluded sites
                    if any(pattern in href.lower() for pattern in exclude_patterns):
                        continue
                    
                    # Check for social media profiles
                    for platform, pattern in social_media_patterns.items():
                        match = re.search(pattern, href, re.IGNORECASE)
                        if match:
                            full_url = match.group(0)
                            if not full_url.startswith('http'):
                                full_url = f"https://{full_url}"
                                
                            # Add to potential social media with priority
                            # Priority depends on the search query - first query has highest priority
                            priority = len(search_queries) - search_queries.index(query)
                            
                            # Higher priority if link text contains business name
                            link_text = link.text.lower()
                            if business_name.lower() in link_text:
                                priority += 2
                                
                            potential_social_media[platform].append({
                                'url': full_url,
                                'priority': priority,
                                'link_text': link_text
                            })
                    
                    # Check for potential website
                    # First check if there's a domain that matches the business name
                    website_match = re.search(website_pattern, href, re.IGNORECASE)
                    if website_match and not any(ex in href.lower() for ex in exclude_patterns):
                        # Extract the full domain
                        full_domain_match = re.search(r'https?://[^/\s]+', href)
                        if full_domain_match:
                            potential_websites.append({
                                'url': full_domain_match.group(0),
                                'priority': 3,  # High priority for direct name matches
                                'link_text': link.text
                            })
                    # As a fallback, look for any link that might be a corporate website
                    elif business_name.lower() in href.lower() and not any(sm in href.lower() for sm in ['facebook', 'instagram', 'linkedin', 'twitter', 'x.com'] + exclude_patterns):
                        full_domain_match = re.search(r'https?://[^/\s]+', href)
                        if full_domain_match:
                            potential_websites.append({
                                'url': full_domain_match.group(0),
                                'priority': 2,  # Medium priority for partial name matches
                                'link_text': link.text
                            })
                    # Consider links where the text strongly matches the business name
                    elif business_name.lower() in link.text.lower() and re.search(r'https?://[^/\s]+', href) and not any(ex in href.lower() for ex in exclude_patterns + ['facebook', 'instagram', 'linkedin', 'twitter', 'x.com']):
                        full_domain_match = re.search(r'https?://[^/\s]+', href)
                        if full_domain_match:
                            potential_websites.append({
                                'url': full_domain_match.group(0),
                                'priority': 2,  # Medium priority for name in link text
                                'link_text': link.text
                            })
                    # Collect other domain results from top search results
                    elif re.search(r'https?://[^/\s]+', href) and not any(pattern in href.lower() for pattern in exclude_patterns + ['facebook', 'instagram', 'linkedin', 'twitter', 'x.com', 'bing', 'google', 'yahoo']):
                        full_domain_match = re.search(r'https?://[^/\s]+', href)
                        if full_domain_match:
                            # Don't include search engines or common sites
                            domain = full_domain_match.group(0).lower()
                            if not any(site in domain for site in ['google', 'bing', 'yahoo', 'wikipedia', 'youtube']):
                                potential_websites.append({
                                    'url': full_domain_match.group(0),
                                    'priority': 1,  # Low priority for general results
                                    'link_text': link.text
                                })
            
            # Prevent rate limiting by adding a small delay between requests
            time.sleep(random.uniform(1.0, 3.0))
            
        except Exception as e:
            print(f"Error searching for {query}: {str(e)}")
    
    # Process websites
    # Remove duplicates and sort by priority
    unique_websites = []
    seen_domains = set()
    
    for site in sorted(potential_websites, key=lambda x: x['priority'], reverse=True):
        domain = re.sub(r'https?://', '', site['url'].lower())
        domain = re.sub(r'^www\.', '', domain)  # Remove www prefix
        domain = re.sub(r'/.*$', '', domain)  # Remove everything after domain
        
        if domain not in seen_domains:
            seen_domains.add(domain)
            unique_websites.append(site)
    
    print(f"Found {len(unique_websites)} unique potential websites")
    
    # Verify top 3 website candidates
    verified_websites = []
    
    for i, site in enumerate(unique_websites[:5]):  # Check top 5 sites
        if i >= 5:  # Limit to top 5 to avoid too many requests
            break
        
        print(f"Verifying website {i+1}/{min(5, len(unique_websites))}: {site['url']}")
        print(f"  Link text: {site['link_text']}")
        
        confidence = verify_website_ownership(site['url'], business_name, reg_type)
        verified_websites.append({
            'url': site['url'],
            'confidence': confidence,
            'priority': site['priority']
        })
        print(f"  Confidence: {confidence:.2f}")
    
    # Choose the best website based on verification score and priority
    if verified_websites:
        # First check if any site has high confidence
        high_confidence_sites = [site for site in verified_websites if site['confidence'] > 0.6]
        if high_confidence_sites:
            best_site = max(high_confidence_sites, key=lambda x: (x['confidence'], x['priority']))
            results['website'] = best_site['url']
            print(f"Selected website with high confidence {best_site['confidence']:.2f}: {best_site['url']}")
        else:
            # Fall back to highest scoring site if it has minimum confidence
            best_site = max(verified_websites, key=lambda x: (x['confidence'], x['priority']))
            if best_site['confidence'] > 0.2:  # Lower minimum threshold
                results['website'] = best_site['url']
                print(f"Selected website with moderate confidence {best_site['confidence']:.2f}: {best_site['url']}")
            else:
                print("No website passed the minimum confidence threshold")
    
    # Process social media
    # For each platform, deduplicate and verify
    for platform in potential_social_media:
        if not potential_social_media[platform]:
            continue
            
        # Remove duplicates
        unique_urls = []
        seen_urls = set()
        
        for profile in sorted(potential_social_media[platform], key=lambda x: x['priority'], reverse=True):
            # Normalize URL for comparison
            normalized_url = re.sub(r'https?://(www\.)?', '', profile['url'].lower())
            normalized_url = re.sub(r'/+$', '', normalized_url)  # Remove trailing slashes
            normalized_url = re.sub(r'\?.*$', '', normalized_url)  # Remove query parameters
            
            if normalized_url not in seen_urls:
                seen_urls.add(normalized_url)
                unique_urls.append(profile)
        
        if unique_urls:
            print(f"Found {len(unique_urls)} unique {platform} profiles")
            
            # Check top 3 profiles
            for i, profile in enumerate(unique_urls[:3]):
                if i >= 3:  # Limit to top 3
                    break
                
                print(f"Checking {platform} profile {i+1}/{min(3, len(unique_urls))}: {profile['url']}")
                print(f"  Link text: {profile['link_text']}")
                
                try:
                    confidence = verify_social_media(profile['url'], business_name, reg_type)
                    print(f"  Confidence: {confidence:.2f}")
                    
                    # Add if confidence meets threshold
                    if confidence > 0.4:
                        results['social_media'][platform] = profile['url']
                        print(f"Selected {platform} profile with confidence {confidence:.2f}")
                        break  # Found a good profile, stop checking others
                except Exception as e:
                    print(f"Error verifying {platform} profile: {str(e)}")
                    # Default to using the top profile if verification fails
                    results['social_media'][platform] = profile['url']
                    print(f"Selected {platform} profile (verification failed)")
                    break
    
    # Clean up social media URLs - make sure they have proper http prefix
    for platform in results['social_media']:
        if results['social_media'][platform] and not results['social_media'][platform].startswith('http'):
            results['social_media'][platform] = 'https://' + results['social_media'][platform]
    
    # Clean up results - remove None values from social media dict
    results['social_media'] = {k: v for k, v in results['social_media'].items() if v is not None}
    
    return results


def update_business_online_presence(business_name, reg_type, reg_nr, online_data):
    """
    Update the database with the found online presence data for a business
    
    Args:
        business_name (str): Business name
        reg_type (str): Registration type
        reg_nr (str): Registration number
        online_data (dict): Dictionary with website and social media links
    """
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    website = online_data.get('website')
    
    # Extract individual social media URLs
    facebook = online_data.get('social_media', {}).get('facebook')
    linkedin = online_data.get('social_media', {}).get('linkedin')
    instagram = online_data.get('social_media', {}).get('instagram')
    twitter = online_data.get('social_media', {}).get('twitter')
    
    update_query = """
        UPDATE leads
        SET website = %s, facebook = %s, linkedin = %s, instagram = %s, twitter = %s
        WHERE registration_number = %s
    """
    
    cursor.execute(update_query, (website, facebook, linkedin, instagram, twitter, reg_nr))
    conn.commit()
    cursor.close()
    conn.close()


def import_csv_to_db(csv_file_like):
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()

    reader = csv.DictReader(csv_file_like, delimiter=';', quotechar='"')

    insert_query = """
        INSERT INTO leads (business_name, reg_type, registration_number, address, founded_date)
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            business_name = VALUES(business_name),
            reg_type = VALUES(reg_type),
            registration_number = VALUES(registration_number),
            address = VALUES(address),
            founded_date = VALUES(founded_date)
    """

    for i, row in enumerate(reader):
        if i >= 20:
            break

        name = row.get("name_in_quotes")
        reg_type = row.get("type")
        reg_nr = row.get("regcode")
        address = row.get("address")
        raw_founded_date = row.get("registered")
        founded_date = raw_founded_date if raw_founded_date else None

        if not name or not reg_nr:
            continue

        cursor.execute(insert_query, (name, reg_type, reg_nr, address, founded_date))
        
        # Optionally, search for online presence for each business
        # Uncomment the following lines to enable online searching during import
        # Note: This will significantly slow down the import process
        # online_data = search_business_online(name, reg_type)
        # update_business_online_presence(name, reg_type, reg_nr, online_data)

    conn.commit()
    cursor.close()
    conn.close()
    print("Import complete.")


def search_businesses_online(limit=10):
    """
    Search for businesses' online presence from the database
    
    Args:
        limit (int): Maximum number of businesses to process
    """
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # Select businesses without website information
    query = """
        SELECT business_name, reg_type, registration_number
        FROM leads
        WHERE website IS NULL AND facebook IS NULL AND linkedin IS NULL 
              AND instagram IS NULL AND twitter IS NULL
        LIMIT %s
    """
    
    cursor.execute(query, (limit,))
    businesses = cursor.fetchall()
    cursor.close()
    conn.close()
    
    for business in businesses:
        name, reg_type, reg_nr = business
        print(f"Searching online presence for: {name} ({reg_type})")
        
        online_data = search_business_online(name, reg_type)
        update_business_online_presence(name, reg_type, reg_nr, online_data)
        
        # Print found results
        if online_data['website']:
            print(f"  Website: {online_data['website']}")
        
        # Print individual social media accounts
        if online_data['social_media']:
            print(f"  Social media:")
            for platform, url in online_data['social_media'].items():
                print(f"    {platform.capitalize()}: {url}")
        
        # Be polite to search engines
        time.sleep(random.uniform(2.0, 5.0))
    
    print("Online search complete.")


if __name__ == "__main__":
    try:
        # Default behavior: import data
        if len(sys.argv) == 1:
            csv_data = download_csv_data()
            import_csv_to_db(csv_data)
        # New command line option to search online
        elif len(sys.argv) > 1 and sys.argv[1] == "search":
            limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
            search_businesses_online(limit)
    except Exception as e:
        print("Error occurred:")
        traceback.print_exc()