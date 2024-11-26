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
import { Select } from "@/components/ui/Select";
import { Heart, Pencil, Trash2 } from "lucide-react";

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
              placeholder="Search offers..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="max-w-sm"
            />
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-[#ff7b92] hover:bg-[#ff6b85] text-white"
            >
              <Heart className="mr-2 h-4 w-4" /> Create Offer
            </Button>
          </div>

          <div className="rounded-lg border border-pink-100 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredOffers}
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
              {isEditing ? "Edit Offer" : "Create Offer"}
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
                <Label htmlFor="discount_code">Discount Code</Label>
                <Input
                  id="discount_code"
                  name="discount_code"
                  value={formData.discount_code}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="points_required">Points</Label>
                <Input
                  id="points_required"
                  name="points_required"
                  type="number"
                  value={formData.points_required}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="offer_status">Status</Label>
                <Select
                  id="offer_status"
                  options={[
                    { value: "Draft", label: "Draft" },
                    { value: "Active", label: "Active" },
                    { value: "Pending", label: "Pending" },
                    { value: "Expired", label: "Expired" },
                  ]}
                  value={formData.offer_status}
                  onValueChange={(value) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      offer_status: value,
                    }))
                  }
                  placeholder="Select a status"
                />
              </div>
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select
                  id="category_id"
                  options={offersCategories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      category_id: value,
                    }))
                  }
                  placeholder="Select a category"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveOffer}
                className="bg-[#ff7b92] hover:bg-[#ff6b85] text-white"
              >
                {isEditing ? "Update Offer" : "Create Offer"}
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
  discount_code: "",
  start_date: "",
  end_date: "",
  points_required: 0,
  offer_status: "Draft",
  category_id: "",
});
