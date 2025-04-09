
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Website {
  id: string;
  created_at: string;
  custom_slug?: string;
  user_id: string;
  userEmail?: string;
}

interface RecentWebsitesTableProps {
  title: string;
  description: string;
  websites: Website[] | undefined;
  isLoading: boolean;
}

const RecentWebsitesTable: React.FC<RecentWebsitesTableProps> = ({ 
  title, 
  description, 
  websites,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 rounded-full border-4 border-t-transparent border-brand-red animate-spin"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Website ID/Slug</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {websites?.map((website) => (
                <TableRow key={website.id}>
                  <TableCell>
                    {format(new Date(website.created_at || new Date()), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{website.userEmail}</TableCell>
                  <TableCell>{website.custom_slug || website.id}</TableCell>
                </TableRow>
              ))}
              {(!websites || websites.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No websites found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentWebsitesTable;
