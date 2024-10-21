import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/Button"
import { Divider } from "@mui/material"
import { Edit, Trash2, MapPin, Phone, Mail, Globe, Twitter, Facebook, Linkedin } from 'lucide-react'

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

const ProfileContent = () => {
    const company = {
        name: "TechCorp Solutions",
        logo: "/images/placeholder-user.png",
        description: "Leading provider of innovative tech solutions for modern businesses.",
        address: "123 Tech Street, San Francisco, CA 94105",
        phone: "+1 (555) 123-4567",
        email: "contact@techcorpsolutions.com",
        website: "https://www.techcorpsolutions.com",
        social: {
            twitter: "https://twitter.com/techcorp",
            facebook: "https://facebook.com/techcorp",
            linkedin: "https://linkedin.com/company/techcorp"
        }
    }

    return (
        <div id="profile-container" className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Motion for downward animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <div id="profile-header" className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <Image
                        src={company.logo}
                        alt={company.name}
                        width={200}
                        height={200}
                        className="rounded-full"
                    />
                    <div id="profile-info" className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                        <p className="text-gray-600 mb-4">{company.description}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Button id="edit-profile" variant="default" size="default">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                            <Button id="delete-account" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
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
                        <ContactItem icon={Mail} text={company.email} />
                        <ContactItem icon={Globe} text={company.website} />
                    </div>
                </div>

                <Divider />

                <div id="social-media-section">
                    <h2 className="text-xl font-semibold mb-4">Social Media</h2>
                    <div id="social-media" className="flex gap-4">
                        <SocialMediaItem icon={Twitter} link={company.social.twitter} />
                        <SocialMediaItem icon={Facebook} link={company.social.facebook} />
                        <SocialMediaItem icon={Linkedin} link={company.social.linkedin} />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ProfileContent