
-- Add triggers to auto-update timestamps

-- Function to update the timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update triggers for cv_versions table
DROP TRIGGER IF EXISTS set_cv_versions_updated_at ON cv_versions;
CREATE TRIGGER set_cv_versions_updated_at
BEFORE UPDATE ON cv_versions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
