
-- First, drop any existing trigger that might be causing issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop any existing function that might be problematic
DROP FUNCTION IF EXISTS public.handle_new_cvwriter_user;

-- Create a proper function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Create the trigger to use our function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
