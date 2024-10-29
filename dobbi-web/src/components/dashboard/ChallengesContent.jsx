"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

    // Limit to 2 decimal places for target_amount
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
      is_sponsored: true, // Set is_sponsored to true by default
      target_date: new Date(formData.target_date).toISOString(),
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
      target_date: formatDateForInput(challenge.target_date),
      sponsor_reward: challenge.sponsor_reward,
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
      name: "Target Date",
      selector: (row) => new Date(row.target_date).toLocaleString(),
      sortable: true,
    },
    {
      name: "Sponsor Reward",
      selector: (row) => row.sponsor_reward,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-green-500 text-white px-3 py-1 rounded font-bold"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500 text-white px-3 py-1 rounded font-bold"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF0F0]">
      <div className="h-16"></div>

      <div className="container mx-auto px-4 py-8 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800"
          >
            Welcome back, {user?.user_metadata.display_name || user?.email}!
          </motion.h1>
        </div>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search challenges..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Create Challenge
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filteredChallenges}
          pagination
          highlightOnHover
          defaultSortField="title"
          className="border"
        />

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 space-y-4">
              <h2 className="text-2xl font-bold">
                {isEditing ? "Edit Challenge" : "Create Challenge"}
              </h2>

              <label className="block">
                <span className="text-gray-700 font-semibold">Title</span>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">Description</span>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">
                  Target Amount
                </span>
                <input
                  type="number"
                  name="target_amount"
                  placeholder="Target Amount"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                  step="0.01" // Sets the step to 0.01 for 2 decimal precision
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">Target Date</span>
                <input
                  type="datetime-local"
                  name="target_date"
                  value={formData.target_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">
                  Sponsor Reward
                </span>
                <input
                  type="text"
                  name="sponsor_reward"
                  placeholder="Sponsor Reward"
                  value={formData.sponsor_reward}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <button
                onClick={handleSaveChallenge}
                className="bg-blue-500 text-white w-full py-2 rounded font-bold mt-4"
              >
                {isEditing ? "Update Challenge" : "Create Challenge"}
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white w-full py-2 rounded font-bold mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const initialFormData = () => ({
  title: "",
  description: "",
  target_amount: 0,
  target_date: "",
  sponsor_reward: "",
});
