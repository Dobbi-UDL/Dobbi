import React, { useEffect } from "react";
import { CompanyTable } from "./tables/CompanyTable";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const CompaniesContent = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user && isAdmin) {
      router.push("dashboard");
    }
  }, [user, isAdmin, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF0F0] p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesContent;
