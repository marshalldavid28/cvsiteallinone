
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const useAdminStats = (userId: string | null, isAdmin: boolean | undefined, isAuthenticated: boolean) => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      try {
        console.log('Starting to fetch user stats');
        
        // Use the RPC function we created to bypass RLS when fetching profiles
        // This will fetch ALL profiles for admins, but only self profile for regular users
        const { data: allProfiles, error: allProfilesError } = await supabase
          .rpc('admin_get_all_profiles');
        
        if (allProfilesError) {
          console.error('Error fetching all profiles with RPC:', allProfilesError);
          throw new Error(`Failed to fetch profiles: ${allProfilesError.message}`);
        }
        
        // Log the profiles we fetched
        console.log('ALL profiles fetched with RPC call:', {
          count: Array.isArray(allProfiles) ? allProfiles.length : 0,
          data: allProfiles
        });
        
        // Calculate total users - ensure we're actually counting all profiles
        const totalUsers = Array.isArray(allProfiles) ? allProfiles.length : 0;
        
        // WEBSITES COUNT
        const { data: websites, error: websitesError } = await supabase
          .from('cv_websites')
          .select('id, created_at');
        
        if (websitesError) {
          console.error('Error fetching websites:', websitesError);
          throw new Error(`Failed to fetch websites: ${websitesError.message}`);
        }
        
        const totalWebsites = Array.isArray(websites) ? websites.length : 0;
        
        // Get websites created by day for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: websitesByDay } = await supabase
          .from('cv_websites')
          .select('created_at')
          .gte('created_at', thirtyDaysAgo.toISOString());

        // Process website data for chart
        const websiteDailyCounts: Record<string, number> = {};
        websitesByDay?.forEach(website => {
          const date = new Date(website.created_at as string);
          const dateStr = format(date, 'MMM dd');
          websiteDailyCounts[dateStr] = (websiteDailyCounts[dateStr] || 0) + 1;
        });

        // Convert website data to array format for charts
        const websiteCreationData = Object.entries(websiteDailyCounts).map(([date, count]) => ({
          date,
          count
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Process user registration data by day
        const userDailyCounts: Record<string, number> = {};
        allProfiles?.forEach(profile => {
          if (profile.created_at) {
            const date = new Date(profile.created_at);
            // Only include users from the last 30 days
            if (date >= thirtyDaysAgo) {
              const dateStr = format(date, 'MMM dd');
              userDailyCounts[dateStr] = (userDailyCounts[dateStr] || 0) + 1;
            }
          }
        });

        // Convert user data to array format for charts
        const userGrowthData = Object.entries(userDailyCounts).map(([date, count]) => ({
          date,
          count
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Get latest websites
        const { data: latestWebsites } = await supabase
          .from('cv_websites')
          .select('id, created_at, custom_slug, user_id')
          .order('created_at', { ascending: false })
          .limit(10);

        // Separately fetch user emails for the websites
        const websiteUserEmails: Record<string, string> = {};
        
        if (latestWebsites && latestWebsites.length > 0) {
          // Get unique user IDs from the websites
          const userIds = [...new Set(latestWebsites.map(website => website.user_id))];
          
          // Fetch profiles for these user IDs
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, email')
            .in('id', userIds);
          
          // Map user IDs to emails
          if (profilesData) {
            profilesData.forEach(profile => {
              websiteUserEmails[profile.id] = profile.email;
            });
          }
        }

        // Attach emails to website data
        const websitesWithUserInfo = latestWebsites?.map(website => ({
          ...website,
          userEmail: websiteUserEmails[website.user_id] || 'Unknown'
        }));

        // Log final stats before returning
        console.log('Final stats being returned:', {
          totalUsers,
          totalWebsites,
          websiteCreationData: websiteCreationData?.length,
          userGrowthData: userGrowthData?.length,
          latestWebsites: websitesWithUserInfo?.length
        });

        return {
          totalUsers,
          totalWebsites,
          websiteCreationData,
          userGrowthData,
          latestWebsites: websitesWithUserInfo
        };
      } catch (error) {
        console.error('Error in userStats query:', error);
        throw error;
      }
    },
    enabled: isAuthenticated && (isAdmin === true),
    refetchInterval: 2000, // Refresh data every 2 seconds to be more responsive
    refetchOnWindowFocus: true,
    staleTime: 0, // Mark data as immediately stale to force refresh
    gcTime: 0, // Don't cache the data
    retry: 3, // Retry failed queries up to 3 times
  });
};
