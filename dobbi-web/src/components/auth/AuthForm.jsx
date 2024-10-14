import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";

export function AuthForm({ fields, onSubmit, buttonLabel }) {
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
    );
    const [showPasswords, setShowPasswords] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: false }), {})
    );

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const togglePassword = (fieldName) => {
        setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {fields.map((field) => (
                    <InputField
                        key={field.name}
                        label={field.label}
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        icon={field.icon}
                        onChange={handleChange}
                        value={formData[field.name]}
                        togglePassword={field.type === "password" ? () => togglePassword(field.name) : undefined}
                        showPassword={field.type === "password" ? showPasswords[field.name] : undefined}
                    />
                ))}
                <Button>
                    {buttonLabel}
                </Button>
            </form>
        </div>
    );
}