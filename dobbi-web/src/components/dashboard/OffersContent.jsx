'use client';

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function OffersContent() {
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discount_code: '',
        start_date: '',
        end_date: '',
        points: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingOfferId, setEditingOfferId] = useState(null);
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchOffers();
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

    const fetchOffers = async () => {
        if (user) {
            const { data, error } = await supabase
                .from('test_offers')
                .select('*')
                .eq('company_id', user.id); // Filter by user id (company_id)
            
            if (error) {
                console.error('Error fetching offers:', error);
            } else {
                setOffers(data);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveOffer = async () => {
        const offerData = {
            ...formData,
            company_id: user.id, // Assign the current user's ID as company_id
        };

        if (isEditing) {
            const { data, error } = await supabase
                .from('test_offers')
                .update(offerData)
                .eq('id', editingOfferId);
            if (error) {
                console.error('Error updating offer:', error);
            }
        } else {
            const { data, error } = await supabase
                .from('test_offers')
                .insert([offerData]);
            if (error) {
                console.error('Error creating offer:', error);
            }
        }
        closeModal();
        fetchOffers();
    };

    const handleEdit = (offer) => {
        setFormData({
            title: offer.title,
            description: offer.description,
            discount_code: offer.discount_code,
            start_date: offer.start_date,
            end_date: offer.end_date,
            points: offer.points,
        });
        setEditingOfferId(offer.id);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('test_offers')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting offer:', error);
        }
        fetchOffers();
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setFormData({ title: '', description: '', discount_code: '', start_date: '', end_date: '', points: 0 });
    };

    // Define las columnas de la tabla
    const columns = [
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row) => row.description,
            sortable: true,
        },
        {
            name: 'Discount Code',
            selector: (row) => row.discount_code,
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: (row) => row.start_date,
            sortable: true,
        },
        {
            name: 'End Date',
            selector: (row) => row.end_date,
            sortable: true,
        },
        {
            name: 'Points',
            selector: (row) => row.points,
            sortable: true,
        },
        {
            name: 'Actions',
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
                            <h2 className="text-2xl font-bold">{isEditing ? 'Edit Offer' : 'Create Offer'}</h2>

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
                                <span className="text-gray-700 font-semibold">Discount Code</span>
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
                                    name="points"
                                    placeholder="Points"
                                    value={formData.points}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:outline-none text-gray-800 font-medium"
                                />
                            </label>

                            <button
                                onClick={handleSaveOffer}
                                className="bg-blue-500 text-white w-full py-2 rounded font-bold mt-4"
                            >
                                {isEditing ? 'Update Offer' : 'Create Offer'}
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
