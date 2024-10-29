"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Select } from "@/components/ui/Select";

export default function OffersContent() {
  const [offers, setOffers] = useState([]);
  const [offersCategories, setOffersCategories] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData());
  const [isEditing, setIsEditing] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOffers();
    fetchOffersCategories();
  }, [user]);

  useEffect(() => {
    setFilteredOffers(
      offers.filter(
        (offer) =>
          offer.title.toLowerCase().includes(filterText.toLowerCase()) ||
          offer.description.toLowerCase().includes(filterText.toLowerCase()) ||
          offer.discount_code.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, offers]);

  const fetchOffersCategories = async () => {
    const { data, error } = await supabase
      .from("offer_categories")
      .select("* ");
    if (error) {
      console.error("Error fetching offers categories:", error);
    } else {
      setOffersCategories(data);
    }
    console.log("Offers categories:", data);
  };

  const fetchOffers = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("company_id", user.id);

      if (error) {
        console.error("Error fetching offers:", error);
      } else {
        setOffers(data);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveOffer = async () => {
    const offerData = {
      ...formData,
      company_id: user.id,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    };

    if (isEditing) {
      await updateOffer(editingOfferId, offerData);
    } else {
      await createOffer(offerData);
    }
    closeModal();
    fetchOffers();
  };

  const updateOffer = async (id, offerData) => {
    const { error } = await supabase
      .from("offers")
      .update(offerData)
      .eq("id", id);
    if (error) {
      console.error("Error updating offer:", error);
    }
  };

  const createOffer = async (offerData) => {
    const { error } = await supabase.from("offers").insert([offerData]);
    if (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleEdit = (offer) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      discount_code: offer.discount_code,
      start_date: formatDateForInput(offer.start_date),
      end_date: formatDateForInput(offer.end_date),
      points_required: offer.points_required,
      offer_status: offer.offer_status,
      category_id: offer.category_id,
    });
    setEditingOfferId(offer.id);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) {
      console.error("Error deleting offer:", error);
    }
    fetchOffers();
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
      name: "Discount Code",
      selector: (row) => row.discount_code,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => {
        const category = offersCategories.find(
          (category) => category.id === row.category_id
        );
        return category?.name;
      },
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.start_date).toLocaleString(),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.end_date).toLocaleString(),
      sortable: true,
    },
    {
      name: "Points",
      selector: (row) => row.points_required,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.offer_status,
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
            placeholder="Search offers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Create Offer
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filteredOffers}
          pagination
          highlightOnHover
          defaultSortField="title"
          className="border"
        />

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 space-y-4">
              <h2 className="text-2xl font-bold">
                {isEditing ? "Edit Offer" : "Create Offer"}
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
                  Discount Code
                </span>
                <input
                  type="text"
                  name="discount_code"
                  placeholder="Discount Code"
                  value={formData.discount_code}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">Start Date</span>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">End Date</span>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">Points</span>
                <input
                  type="number"
                  name="points_required"
                  placeholder="Points"
                  value={formData.points_required}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-semibold">Status</span>
                <Select
                  id="offer_status"
                  value={formData.offer_status}
                  onValueChange={(value) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      offer_status: value,
                    }))
                  }
                  options={[
                    { value: "Draft", label: "Draft" },
                    { value: "Active", label: "Active" },
                    { value: "Pending", label: "Pending" },
                    { value: "Expired", label: "Expired" },
                  ]}
                  placeholder="Select a status"
                />
              </label>

              <label>
                <span className="text-gray-700 font-semibold">Category</span>
                <Select
                  id="category_id"
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      category_id: value,
                    }))
                  }
                  options={offersCategories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  placeholder="Select a category"
                />
              </label>

              <button
                onClick={handleSaveOffer}
                className="bg-blue-500 text-white w-full py-2 rounded font-bold mt-4"
              >
                {isEditing ? "Update Offer" : "Create Offer"}
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
  discount_code: "",
  start_date: "",
  end_date: "",
  points_required: 0,
  offer_status: "Draft",
  category_id: "",
});
