
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface WebsiteDistributionChartProps {
  title: string;
  description: string;
  data: Array<{ date: string; count: number }>;
  isLoading: boolean;
}

const WebsiteDistributionChart: React.FC<WebsiteDistributionChartProps> = ({ 
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
              <BarChart
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
                <Bar 
                  dataKey="count" 
                  fill="#FF5A6E" 
                  name="websites"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteDistributionChart;
