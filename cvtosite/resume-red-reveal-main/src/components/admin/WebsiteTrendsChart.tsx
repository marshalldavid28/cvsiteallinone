
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface WebsiteTrendsChartProps {
  title: string;
  description: string;
  data: Array<{ date: string; count: number }>;
  isLoading: boolean;
}

const WebsiteTrendsChart: React.FC<WebsiteTrendsChartProps> = ({ 
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
                websites: { color: "#FF5A6E" }
              }}
              className="w-full h-full"
            >
              <AreaChart 
                data={data || []} 
                margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorWebsites" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5A6E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF5A6E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#FF5A6E" 
                  fillOpacity={1} 
                  fill="url(#colorWebsites)" 
                  name="websites"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteTrendsChart;
