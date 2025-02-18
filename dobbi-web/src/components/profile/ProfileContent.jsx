import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/Button"
import { Divider } from "@mui/material"
import { Edit, Trash2, MapPin, Phone, Mail, Globe, Twitter, Facebook, Linkedin } from 'lucide-react'
import EditProfileModal from './EditProfileModal'
import { useState, useEffect } from 'react'
import { getCompanyById } from '@/services/companyService'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

const ContactItem = ({ icon: Icon, text }) => (
    text && (
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-[#F66C72]" />
            <span>{text}</span>
        </div>
    )
);

const SocialMediaItem = ({ icon: Icon, link }) => (
    link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#F66C72] hover:text-opacity-80">
            <Icon className="h-6 w-6" />
        </a>
    )
);

const RenderedText = ({ text }) => {
    if (!text) return null;
    
    return (
        <>
            {text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    {index < text.split('\n').length - 1 && <br />}
                </React.Fragment>
            ))}
        </>
    );
};

const ProfileContent = () => {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/login');
        return null;
    }

    const [company, setCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state

    // Fetch company data
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                if (!user?.id) return; // Avoid fetching if user ID is not available
                console.log("Fetching company data... user.id: ", user.id);
                const companyData = await getCompanyById(user.id);
                setCompany(companyData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchCompanyData();
    }, [user?.id]);

    const handleEditProfile = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveProfile = (updatedCompany) => {
        setCompany(updatedCompany);
        setIsModalOpen(false);
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmDelete) return;

        // Delete user account
        try {
            const response = await fetch('/api/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // Redirect to logout page to clear session
                router.push(`/logout?deleted=true`);
            } else {
                console.error(data.error); 
                alert("Error deleting account: " + data.error);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert("Error deleting account: " + error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Add a loading indicator while fetching
    }

    if (!company) {
        return <div>No company data available</div>; // Handle null company scenario
    }

    return (
        <div id="profile-container" className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <div id="profile-header" className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div id="profile-image">
                        <Image
                            src={company.logo || "/images/placeholder-user.png"} // Fallback in case logo is not available
                            alt={company.name}
                            width={200}
                            height={200}
                            className="rounded-full"
                        />
                    </div>
                    <div id="profile-info" className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                        <p className="text-gray-600 mb-4 text-justify">
                            <RenderedText text={company.description} />
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Button id="edit-profile" variant="default" size="default" onClick={handleEditProfile}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                            <Button id="delete-account" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={handleDeleteAccount}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>

                <Divider />

                <div id="contact-info-section">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <div id="contact-info" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ContactItem icon={MapPin} text={company.address} />
                        <ContactItem icon={Phone} text={company.phone} />
                        <ContactItem icon={Mail} text={company.contact_email} />
                        <ContactItem icon={Globe} text={company.website} />
                    </div>
                </div>
                
                <Divider />

                <div id="social-media-section">
                    <h2 className="text-xl font-semibold mb-4">Social Media</h2>
                    <div id="social-media" className="flex gap-4">
                        <SocialMediaItem icon={Twitter} link={company.twitter} />
                        <SocialMediaItem icon={Facebook} link={company.facebook} />
                        <SocialMediaItem icon={Linkedin} link={company.linkedin} />
                    </div>
                </div>
            </motion.div>
            <EditProfileModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                company={company}
                onSave={handleSaveProfile}
            />
        </div>
    );
}

export default ProfileContent;
