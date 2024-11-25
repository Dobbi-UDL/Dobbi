import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import DataTable from "react-data-table-component";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("role", "company");

      if (error) throw error;
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCompanyStatus(id, newStatus) {
    try {
      const { data, error } = await supabase
        .from("companies")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchCompanies();
    } catch (error) {
      console.error("Error updating company status:", error);
    }
  }

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => updateCompanyStatus(row.id, "verified")}>
            ✓
          </button>
          <button onClick={() => updateCompanyStatus(row.id, "rejected")}>
            ✗
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTable
      title="Companies"
      columns={columns}
      data={companies}
      pagination
    />
  );
}
