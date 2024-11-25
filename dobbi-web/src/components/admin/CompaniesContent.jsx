import React, { useEffect } from "react";
import { CompanyTable } from "./tables/CompanyTable";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const CompaniesContent = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user && isAdmin) {
      router.push("dashboard");
    }
  }, [user, isAdmin, router]);

  return (
    <div
      id="dashboard-container"
      className="min-h-screen bg-gradient-to-br from-white to-[#FFF0F0]"
    >
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      <CompanyTable />
    </div>
  );
};

export default CompaniesContent;
