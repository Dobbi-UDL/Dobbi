"use client";

import React from "react";
import { Building, Smartphone } from "lucide-react";

export default function CTA() {
    return (
        <section id="cta" className="py-20 bg-gradient-to-r from-[#4A90E2] to-[#F66C72]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-8">Ready to Transform Your Finances?</h2>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        //onClick={() => window.location.href = ''}
                        className="bg-white text-[#4A90E2] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg"
                    >
                        <Building className="mr-2" />
                        Join as a Company
                    </button>
                    <button
                        //onClick={() => window.location.href = ''}
                        className="bg-white text-[#F66C72] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg"
                    >
                        <Smartphone className="mr-2" />
                        Download the App
                    </button>
                </div>
            </div>
        </section>
    );
}