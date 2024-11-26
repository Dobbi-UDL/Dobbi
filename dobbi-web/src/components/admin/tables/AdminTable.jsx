import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import DataTable from "react-data-table-component";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function AdminTable() {
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
        .eq("role", "admin");

      if (error) throw error;
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
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
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      row.status === "active"
                        ? "bg-green-100 text-green-800"
                        : row.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
  ];

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <DataTable
        columns={columns}
        data={companies}
        pagination
        responsive
        highlightOnHover
        striped
        customStyles={{
          headRow: {
            style: {
              backgroundColor: "#f3f4f6",
              fontWeight: "bold",
            },
          },
          rows: {
            style: {
              "&:nth-of-type(odd)": {
                backgroundColor: "#f9fafb",
              },
            },
          },
        }}
      />
    </div>
  );
}
