import React, { useState, useEffect } from "react";
import { AdminTable } from "./tables/AdminTable";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const AdminsContent = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { signUp } = useAuth();

  useEffect(() => {
    console.log("User:", isAdmin);
    if (!user && isAdmin) {
      router.push("dashboard");
    }
  }, [user, isAdmin, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const result = await signUp({
        name: newAdminData.name,
        email: newAdminData.email,
        password: newAdminData.password,
      });
      if (result.error) throw result.error;

      // Add the new admin to the 'companies' table as well
      const { error: insertError } = await supabase
        .from("companies")
        .update({
          role: "admin",
          status: "verified",
        })
        .eq("id", result.data.user.id);

      if (insertError) throw insertError;

      alert("Admin created successfully!");
      setIsModalOpen(false);
      setNewAdminData({ email: "", password: "", name: "" });
      // Refresh the admin table
      // You might want to implement a refresh function in AdminTable component
    } catch (error) {
      console.error("Error creating admin:", error);
      if (error.message.includes("email")) {
        alert("Invalid email address. Please try again.");
      } else if (error.message.includes("password")) {
        alert("Password must be at least 6 characters long.");
      } else {
        alert("Error creating admin. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF0F0] p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Admins</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>Create Admin</Button>
        </CardHeader>
        <CardContent>
          <AdminTable />
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newAdminData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newAdminData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newAdminData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Admin</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminsContent;
