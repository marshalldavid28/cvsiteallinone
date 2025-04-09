
-- Add custom_slug column to cv_websites table
ALTER TABLE cv_websites ADD COLUMN IF NOT EXISTS custom_slug TEXT UNIQUE;

-- Create index on custom_slug for faster lookups
CREATE INDEX IF NOT EXISTS cv_websites_custom_slug_idx ON cv_websites(custom_slug);

-- Adding trigger to ensure slugs are unique and clean before insertion
CREATE OR REPLACE FUNCTION clean_and_validate_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if custom_slug is not null
  IF NEW.custom_slug IS NOT NULL THEN
    -- Convert to lowercase and trim
    NEW.custom_slug = LOWER(TRIM(NEW.custom_slug));
    
    -- Check if slug is already taken (after cleaning)
    IF EXISTS (
      SELECT 1 FROM cv_websites 
      WHERE custom_slug = NEW.custom_slug 
      AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Custom slug "%" is already taken', NEW.custom_slug;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS ensure_clean_slug ON cv_websites;

-- Create the trigger
CREATE TRIGGER ensure_clean_slug
BEFORE INSERT OR UPDATE ON cv_websites
FOR EACH ROW
EXECUTE FUNCTION clean_and_validate_slug();
