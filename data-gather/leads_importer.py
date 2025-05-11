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

# === Download CSV from URL ===
def download_csv_data():
    response = requests.get(REGISTRY_URL)
    response.raise_for_status()
    return StringIO(response.content.decode("utf-8"))

# === Import CSV data into MySQL ===
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

    conn.commit()
    cursor.close()
    conn.close()
    print("Import complete.")

# === Run the script ===
if __name__ == "__main__":
    try:
        csv_data = download_csv_data()
        import_csv_to_db(csv_data)
    except Exception as e:
        print("Error occurred:")
        traceback.print_exc()