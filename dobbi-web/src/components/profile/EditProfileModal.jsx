import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const EditProfileModal = ({ isOpen, onClose, company, onSave }) => {
  const [editedCompany, setEditedCompany] = useState(company);
  const [newLogo, setNewLogo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name}, New value: ${value}`);
    setEditedCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...editedCompany, logo: newLogo || editedCompany.logo });
    onClose();
  };

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  const FormSection = ({ id, label, children }) => (
    <div id={`${id}-section`} className="mb-4 space-y-4">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      {children}
    </div>
  );

  const FormItem = ({ id, label, value, required }) => {
    return (
      <div id={`${id}-item`}>
        <Label htmlFor={id} className="block mb-2">
          {label}
        </Label>
        <Input
          id={id}
          name={id}
          value={value}
          onChange={handleInputChange}
          required={required}
        />
      </div>
    );
  };

  const pages = [
    <div key="account-info">
      <FormSection id="account-info" label="Account Information">
        <div id="logo-upload-section">
          <Label htmlFor="logo" className="block mb-2">
            Company Logo
          </Label>
          <div className="flex items-center space-x-4">
            <img
              id="company-logo"
              src={newLogo || editedCompany.logo}
              alt="Company Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
            <Button
              id="upload-logo-button"
              variant="outline"
              type="button" // This is a button, not a submit input
              className="p-2"
              onClick={() => document.getElementById("logo").click()} // Trigger file input on button click
            >
              <Upload size={16} />
              <span>Upload New Logo</span>
            </Button>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
        </div>
        <FormItem
          id="name"
          label="Company Name"
          value={editedCompany.name}
          required={true}
        />
        <FormItem
          id="description"
          label="Description"
          value={editedCompany.description}
          required={true}
        />
      </FormSection>
    </div>,
    <div key="contact-info">
      <FormSection id="contact-info" label="Contact Information">
        <FormItem
          id="address"
          label="Address"
          value={editedCompany.address}
          required={false}
        />
        <FormItem
          id="phone"
          label="Phone"
          value={editedCompany.phone}
          required={false}
        />
        <FormItem
          id="email"
          label="Email"
          value={editedCompany.email}
          required={true}
        />
        <FormItem
          id="website"
          label="Website"
          value={editedCompany.website}
          required={false}
        />
      </FormSection>
    </div>,
    <div key="social-media">
      <FormSection id="social-media" label="Social Media">
        <FormItem
          id="twitter"
          label="Twitter"
          value={editedCompany.social.twitter}
          required={false}
        />
        <FormItem
          id="facebook"
          label="Facebook"
          value={editedCompany.social.facebook}
          required={false}
        />
        <FormItem
          id="linkedin"
          label="LinkedIn"
          value={editedCompany.social.linkedin}
          required={false}
        />
      </FormSection>
    </div>,
  ];

  return (
    <AnimatePresence>
      {console.log("Rendering EditProfileModal")}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            id="edit-profile-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh]"
          >
            <div
              id="edit-profile-header"
              className="flex justify-between items-center mb-4"
            >
              <h2 id="edit-profile-title" className="text-2xl font-bold">
                Edit Profile
              </h2>
              <Button
                id="close-modal-button"
                variant="ghost"
                onClick={onClose}
                className="p-1"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <form
              id="edit-profile-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {pages[currentPage]}
              <div
                id="form-buttons"
                className="flex justify-end space-x-2 mt-6"
              >
                {currentPage > 0 && (
                  <Button
                    id="prev-button"
                    type="button"
                    variant="outline"
                    onClick={prevPage}
                  >
                    Previous
                  </Button>
                )}
                {currentPage < pages.length - 1 && (
                  <Button id="next-button" type="button" onClick={nextPage}>
                    Next
                  </Button>
                )}
                {currentPage === pages.length - 1 && (
                  <>
                    <Button
                      id="cancel-button"
                      type="button"
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      id="save-button"
                      type="submit"
                      className="bg-[#F66C72] text-white hover:bg-opacity-90 transition duration-300"
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
