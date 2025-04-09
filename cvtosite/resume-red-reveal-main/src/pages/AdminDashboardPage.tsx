
import React from "react";
import { Navigate } from "react-router-dom";
import { CalendarIcon, LineChart, Users, FileText, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAdminStats } from "@/hooks/useAdminStats";
import StatsCard from "@/components/admin/StatsCard";
import WebsiteTrendsChart from "@/components/admin/WebsiteTrendsChart";
import WebsiteDistributionChart from "@/components/admin/WebsiteDistributionChart";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import RecentWebsitesTable from "@/components/admin/RecentWebsitesTable";

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, userId, isLoading } = useAuth();

  // Admin verification query
  const { data: isAdmin, isLoading: isAdminLoading } = useAdminCheck(userId, isAuthenticated);

  // User stats query
  const { data: userStats, isLoading: userStatsLoading } = useAdminStats(userId, isAdmin, isAuthenticated);

  // Loading state
  if (isLoading || isAdminLoading) {
    return (
      <PageLayout title="Admin Dashboard - Loading">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-brand-red animate-spin mx-auto"></div>
        </div>
      </PageLayout>
    );
  }

  // Access control - redirect if not admin
  if (!isAuthenticated || isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  // Debug: Log the userStats to help troubleshoot
  console.log('Current userStats:', userStats);

  return (
    <PageLayout title="Admin Dashboard - Analytics">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">View analytics and statistics about your application usage.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Users" 
            value={userStatsLoading ? "Loading..." : userStats?.totalUsers || 0}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="Registered user accounts"
          />
          <StatsCard 
            title="Total Websites" 
            value={userStatsLoading ? "Loading..." : userStats?.totalWebsites || 0} 
            icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
            description="Created CV websites"
          />
          <StatsCard 
            title="Conversion Rate" 
            value={userStatsLoading ? "Loading..." : 
              `${(userStats?.totalUsers && userStats?.totalWebsites 
                ? Math.round((userStats.totalWebsites / userStats.totalUsers) * 100) 
                : 0)}%`
            } 
            icon={<Eye className="h-4 w-4 text-muted-foreground" />} 
            description="Users who created websites"
          />
          <StatsCard 
            title="Last 30 Days" 
            value={userStatsLoading ? "Loading..." : userStats?.websiteCreationData?.length || 0} 
            icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />} 
            description="Days with new websites"
          />
        </div>

        <Tabs defaultValue="trends">
          <TabsList>
            <TabsTrigger value="trends">Growth Trends</TabsTrigger>
            <TabsTrigger value="distributions">Distributions</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <WebsiteTrendsChart
                title="Website Creation Trend"
                description="Number of new websites created daily over the last 30 days"
                data={userStats?.websiteCreationData || []}
                isLoading={userStatsLoading}
              />
              
              <UserGrowthChart
                title="User Growth"
                description="New user registrations by day over the last 30 days"
                data={userStats?.userGrowthData || []}
                isLoading={userStatsLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="distributions">
            <WebsiteDistributionChart
              title="Website Distribution by Day"
              description="Website creation distribution over time"
              data={userStats?.websiteCreationData || []}
              isLoading={userStatsLoading}
            />
          </TabsContent>
          
          <TabsContent value="recent">
            <RecentWebsitesTable
              title="Recently Created Websites"
              description="The 10 most recently created CV websites"
              websites={userStats?.latestWebsites}
              isLoading={userStatsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminDashboardPage;
