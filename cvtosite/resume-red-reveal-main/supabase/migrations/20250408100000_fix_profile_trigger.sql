
-- First, drop any existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_cvwriter_user(); -- Explicitly drop this function as well

-- Also check for and drop any other triggers that might be causing issues
DO $$ 
BEGIN
    -- Drop any other triggers that might exist on auth.users
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname != 'on_auth_user_created' AND tgrelid = 'auth.users'::regclass) THEN
        EXECUTE (
            SELECT 'DROP TRIGGER IF EXISTS ' || tgname || ' ON auth.users;'
            FROM pg_trigger 
            WHERE tgrelid = 'auth.users'::regclass
            LIMIT 1
        );
    END IF;
END $$;

-- Create a proper function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, approved)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user',
    TRUE
  );
  RETURN NEW;
END;
$$;

-- Create the trigger to use our function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
