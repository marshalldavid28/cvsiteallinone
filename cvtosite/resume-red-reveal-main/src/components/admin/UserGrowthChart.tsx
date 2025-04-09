
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface UserGrowthChartProps {
  title: string;
  description: string;
  data: Array<{ date: string; count: number }>;
  isLoading: boolean;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ 
  title, 
  description, 
  data,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-brand-red animate-spin"></div>
            </div>
          ) : (
            <ChartContainer 
              config={{
                users: { color: "#6366F1" }
              }}
              className="w-full h-full"
            >
              <LineChart 
                data={data || []} 
                margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="users"
                />
              </LineChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
