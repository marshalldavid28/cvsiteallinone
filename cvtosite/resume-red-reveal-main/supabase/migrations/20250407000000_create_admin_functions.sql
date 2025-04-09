
-- Create a database function to return all profiles
-- This will bypass RLS and can only be called by admins
CREATE OR REPLACE FUNCTION public.admin_get_all_profiles()
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the permissions of the creator
AS $$
BEGIN
  -- Check if the current user is an admin
  IF EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    -- If admin, return all profiles
    RETURN QUERY SELECT * FROM public.profiles;
  ELSE
    -- If not admin, return only the current user's profile
    RETURN QUERY SELECT * FROM public.profiles WHERE id = auth.uid();
  END IF;
END;
$$;
