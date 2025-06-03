-- Make sure the leads table has fields for website and social media platforms
-- Use this script if these columns don't exist yet
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS website VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS facebook VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS instagram VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS twitter VARCHAR(255) NULL;

-- Create indexes for better query performance if they don't exist yet
CREATE INDEX IF NOT EXISTS idx_website ON leads(website);
CREATE INDEX IF NOT EXISTS idx_registration_number ON leads(registration_number);

-- Sample query to find businesses with social media presence
-- SELECT business_name, reg_type, website, facebook, linkedin, instagram, twitter
-- FROM leads 
-- WHERE facebook IS NOT NULL OR linkedin IS NOT NULL OR instagram IS NOT NULL OR twitter IS NOT NULL; 