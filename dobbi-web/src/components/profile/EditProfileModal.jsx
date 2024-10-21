import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { InputField } from '../auth/ui/AuthInputField'
import { Label } from "@/components/auth/ui/Label"
import { Textarea } from "@/components/ui/textarea"

const EditProfileModal = ({ isOpen, onClose, company, onSave }) => {
    const [editedCompany, setEditedCompany] = useState(company)
    const [newLogo, setNewLogo] = useState(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditedCompany(prev => ({ ...prev, [name]: value }))
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewLogo(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({ ...editedCompany, logo: newLogo || editedCompany.logo })
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg p-6 w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <Button variant="ghost" onClick={onClose} className="p-1">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="logo" className="block mb-2">Company Logo</Label>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={newLogo || editedCompany.logo}
                                        alt="Company Logo"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <Label htmlFor="logo" className="cursor-pointer">
                                        <div className="flex items-center space-x-2 bg-[#F66C72] text-white px-3 py-2 rounded-md hover:bg-opacity-90 transition duration-300">
                                            <Upload size={16} />
                                            <span>Upload New Logo</span>
                                        </div>
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                    </Label>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="name" className="block mb-2">Company Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={editedCompany.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description" className="block mb-2">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={editedCompany.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="address" className="block mb-2">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={editedCompany.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone" className="block mb-2">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={editedCompany.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" className="block mb-2">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={editedCompany.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="website" className="block mb-2">Website</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    value={editedCompany.website}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-[#F66C72] text-white hover:bg-opacity-90 transition duration-300">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default EditProfileModal