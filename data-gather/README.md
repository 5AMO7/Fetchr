# Business Data Gathering Tool

This tool imports business data from a government registry and enriches it with online presence information (websites and social media profiles).

## Features

- Import business data from government registry CSV files
- Search the web for businesses to find:
  - Official websites
  - Social media profiles (Facebook, Instagram, LinkedIn, Twitter/X)
- Verify website and social media ownership by company
- Store the gathered information in a database

## Requirements

- Python 3.6+
- MySQL/MariaDB database
- Required Python packages:
  - requests
  - beautifulsoup4
  - pymysql
  - python-dotenv

## Installation

1. Install the required packages:

```bash
pip install requests beautifulsoup4 pymysql python-dotenv
```

2. Make sure your database has the required columns:

```bash
mysql -u root -p < update_db_table.sql
```

The database should have the following columns for online presence:
- `website` - The business website
- `facebook` - Facebook profile URL
- `linkedin` - LinkedIn company page URL
- `instagram` - Instagram profile URL
- `twitter` - Twitter/X profile URL

## Usage

### Import business data from CSV

```bash
python leads_importer.py
```

### Search for businesses' online presence

```bash
python leads_importer.py search [limit]
```

Where `[limit]` is an optional parameter specifying the number of businesses to search for (default: 10).

### Run the demo script

```bash
python demo_search.py
```

## How It Works

The tool uses advanced web scraping techniques to search for businesses online:

1. It creates search queries based on the business name and registration type
2. It uses Bing search to find relevant links
3. It extracts potential social media profiles and website URLs using regular expressions
4. It verifies potential websites by:
   - Checking if the business name appears on the website
   - Checking if the registration type (SIA, AS, etc.) appears near the business name
   - Analyzing the website title, footer, contact info, and metadata
   - Calculating a confidence score for each website
5. It verifies social media profiles by checking if the business name and registration type appear in the profile
6. It selects the website and social media profiles with the highest confidence scores
7. The results are stored in the database in their respective fields

## Function Documentation

### `search_business_online(business_name, reg_type)`

Searches for a business online to find its website and social media profiles.

Parameters:
- `business_name` (str): The name of the business
- `reg_type` (str): The registration type (e.g., SIA, AS)

Returns:
- A dictionary containing:
  - `website`: The URL of the business website (or None if not found)
  - `social_media`: A dictionary of social media platforms and their URLs

### `verify_website_ownership(url, business_name, reg_type)`

Verifies if a website belongs to the target business.

Parameters:
- `url` (str): The website URL to check
- `business_name` (str): The business name to look for
- `reg_type` (str): The registration type to look for

Returns:
- A confidence score between 0.0 and 1.0

### `verify_social_media(url, business_name, reg_type)`

Verifies if a social media profile belongs to the target business.

Parameters:
- `url` (str): The social media URL to check
- `business_name` (str): The business name to look for
- `reg_type` (str): The registration type to look for

Returns:
- A confidence score between 0.0 and 1.0

## Notes

- Web scraping is subject to rate limiting. The tool includes delays between requests to be respectful to search engines.
- The accuracy of found websites and social media profiles depends on the search engine results and verification process.
- For production use, consider using official search APIs (e.g., Google Custom Search API) instead of scraping.
- Some social media sites actively block scraping, so verification may fall back to using the most likely profile. 