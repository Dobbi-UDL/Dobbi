"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Heart, Pencil, Trash2 } from "lucide-react";

export default function ChallengeContent() {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData());
  const [isEditing, setIsEditing] = useState(false);
  const [editingChallengeId, setEditingChallengeId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchChallenges();
  }, [user]);

  useEffect(() => {
    setFilteredChallenges(
      challenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(filterText.toLowerCase()) ||
          challenge.description.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, challenges]);

  const fetchChallenges = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("saving_goals")
        .select("*")
        .eq("company_id", user.id);

      if (error) {
        console.error("Error fetching challenges:", error);
      } else {
        setChallenges(data);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "target_amount") {
      const formattedValue = parseFloat(value).toFixed(2);
      if (!isNaN(formattedValue)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: formattedValue,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSaveChallenge = async () => {
    const challengeData = {
      ...formData,
      company_id: user.id,
      is_sponsored: true,
      expiring_date: new Date(formData.expiring_date).toISOString(),
    };

    if (isEditing) {
      await updateChallenge(editingChallengeId, challengeData);
    } else {
      await createChallenge(challengeData);
    }
    closeModal();
    fetchChallenges();
  };

  const updateChallenge = async (id, challengeData) => {
    const { error } = await supabase
      .from("saving_goals")
      .update(challengeData)
      .eq("id", id);
    if (error) {
      console.error("Error updating challenge:", error);
    }
  };

  const createChallenge = async (challengeData) => {
    const { error } = await supabase
      .from("saving_goals")
      .insert([challengeData]);
    if (error) {
      console.error("Error creating challenge:", error);
    }
  };

  const handleEdit = (challenge) => {
    setFormData({
      title: challenge.title,
      description: challenge.description,
      target_amount: challenge.target_amount.toFixed(2),
      expiring_date: formatDateForInput(challenge.expiring_date),
      points_rewards: challenge.points_rewards,
      monthly_saving: challenge.monthly_saving,
    });
    setEditingChallengeId(challenge.id);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("saving_goals").delete().eq("id", id);
    if (error) {
      console.error("Error deleting challenge:", error);
    }
    fetchChallenges();
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setFormData(initialFormData());
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Target Amount",
      selector: (row) => `$${row.target_amount.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Monthly Saving",
      selector: (row) => `$${row.monthly_saving.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Expiring Date",
      selector: (row) => new Date(row.expiring_date).toLocaleString(),
      sortable: true,
    },
    {
      name: "Points Reward",
      selector: (row) => row.points_rewards,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEdit(row)}
            variant="ghost"
            size="icon"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDelete(row.id)}
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF0F0] p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-800"
            >
              Welcome back, {user?.user_metadata.display_name || user?.email}!
            </motion.h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Input
              type="text"
              placeholder="Search challenges..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="max-w-sm"
            />
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-[#ff7b92] hover:bg-[#ff6b85] text-white"
            >
              <Heart className="mr-2 h-4 w-4" /> Create Challenge
            </Button>
          </div>

          <div className="rounded-lg border border-pink-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredChallenges}
              pagination
              highlightOnHover
              defaultSortField="title"
              customStyles={{
                table: {
                  style: {
                    backgroundColor: "white",
                  },
                },
                headRow: {
                  style: {
                    backgroundColor: "#FFF0F0",
                    color: "#4A5568",
                    fontWeight: "bold",
                  },
                },
                rows: {
                  style: {
                    "&:nth-of-type(even)": {
                      backgroundColor: "#FFF5F5",
                    },
                    "&:hover": {
                      backgroundColor: "#FFEAEA",
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "Edit Challenge" : "Create Challenge"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="target_amount">Target Amount</Label>
                <Input
                  id="target_amount"
                  name="target_amount"
                  type="number"
                  step="0.01"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="monthly_saving">Monthly Saving</Label>
                <Input
                  id="monthly_saving"
                  name="monthly_saving"
                  type="number"
                  step="0.01"
                  value={formData.monthly_saving}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expiring_date">Expiring Date</Label>
                <Input
                  id="expiring_date"
                  name="expiring_date"
                  type="datetime-local"
                  value={formData.expiring_date}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="points_rewards">Points Reward</Label>
                <Input
                  id="points_rewards"
                  name="points_rewards"
                  type="number"
                  value={formData.points_rewards}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveChallenge}
                className="bg-[#ff7b92] hover:bg-[#ff6b85] text-white"
              >
                {isEditing ? "Update Challenge" : "Create Challenge"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const initialFormData = () => ({
  title: "",
  description: "",
  target_amount: 0,
  expiring_date: "",
  points_rewards: "",
  monthly_saving: 0,
});
