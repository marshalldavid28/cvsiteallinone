
-- Create table for CV versions
CREATE TABLE IF NOT EXISTS cv_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_cv_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_role TEXT,
  job_description TEXT,
  cv_data JSONB NOT NULL,
  optimization_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups by parent CV ID
CREATE INDEX IF NOT EXISTS cv_versions_parent_cv_id_idx ON cv_versions(parent_cv_id);
