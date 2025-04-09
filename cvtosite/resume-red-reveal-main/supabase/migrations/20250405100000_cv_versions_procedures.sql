
-- Add functions to handle cv_versions operations

-- Function to get CV versions by parent_cv_id
CREATE OR REPLACE FUNCTION get_cv_versions(p_parent_cv_id TEXT)
RETURNS TABLE(
  id TEXT,
  name TEXT,
  target_role TEXT,
  job_description TEXT,
  cv_data JSONB,
  optimization_notes TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cv_versions.id::TEXT,
    cv_versions.name,
    cv_versions.target_role,
    cv_versions.job_description,
    cv_versions.cv_data,
    cv_versions.optimization_notes,
    cv_versions.created_at
  FROM cv_versions
  WHERE parent_cv_id = p_parent_cv_id
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to insert a CV version
CREATE OR REPLACE FUNCTION insert_cv_version(
  p_id TEXT,
  p_parent_cv_id TEXT,
  p_name TEXT,
  p_target_role TEXT,
  p_job_description TEXT,
  p_cv_data JSONB,
  p_optimization_notes TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO cv_versions (
    id,
    parent_cv_id,
    name,
    target_role,
    job_description,
    cv_data,
    optimization_notes
  ) VALUES (
    p_id,
    p_parent_cv_id,
    p_name,
    p_target_role,
    p_job_description,
    p_cv_data,
    p_optimization_notes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a CV version
CREATE OR REPLACE FUNCTION delete_cv_version(p_id TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM cv_versions WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
