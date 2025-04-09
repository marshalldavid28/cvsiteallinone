
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = (userId: string | null, isAuthenticated: boolean) => {
  return useQuery({
    queryKey: ["isUserAdmin", userId],
    queryFn: async () => {
      if (!userId) return false;
      
      // Call the Supabase function we created to check admin status
      const { data, error } = await supabase.rpc('is_admin', {
        check_user_id: userId
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data;
    },
    enabled: isAuthenticated && !!userId,
  });
};
