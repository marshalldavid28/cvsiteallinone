
-- First, drop any existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_cvwriter_user();

-- Drop any other triggers that might exist on auth.users
DO $$ 
BEGIN
    -- Find and drop any triggers on auth.users
    FOR r IN (SELECT tgname FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass) LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users;', r.tgname);
    END LOOP;
    
    -- Find and drop any functions that might be related to user creation
    DROP FUNCTION IF EXISTS public.handle_new_profile();
END $$;

-- Create a simple, reliable function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles with proper error handling
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, approved)
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data->>'full_name', ''),
      'user',
      TRUE
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but allow the user creation to continue
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;

-- Create a fresh trigger to use our function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
