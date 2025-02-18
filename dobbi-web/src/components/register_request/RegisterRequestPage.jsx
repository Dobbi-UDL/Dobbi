"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { useScroll } from "@/contexts/ScrollContext";

export default function RegisterRequestPage() {
    const { scrollTo } = useScroll();
    
    return (
        <section id="hero" className="bg-gradient-to-br from-white to-[#FFF0F0] py-12 md:py-20 min-h-screen flex items-center">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 xl:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
                <div className="w-full lg:w-3/5 max-w-3xl flex flex-col justify-center text-center lg:text-left mt-10 sm:mt-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 animate-fade-in-up">
                        Thanks to be interested on <span className="text-[#F66C72]">Dobbi</span> for Companies
                    </h1>
                    <div className="space-y-4 mb-8">
                        <p className="text-lg md:text-xl text-gray-600 animate-fade-in-up animation-delay-200">
                            We are processing your request, be patient during this process.
                        </p>
                        <p className="text-lg md:text-xl text-gray-600 animate-fade-in-up animation-delay-400">
                            We will notify you as soon as possible.
                        </p>
                    </div>
                    <div className="flex justify-center lg:justify-start">
                        <button 
                            onClick={() => scrollTo("cta")} 
                            className="bg-[#F66C72] text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-lg font-semibold flex items-center group hover:bg-opacity-90 transition duration-300 transform hover:scale-105 shadow-lg">
                            Get Started Now
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
                <div className="w-full lg:w-2/5 flex justify-center lg:justify-center mt-8 lg:mt-0">
                    <div className="relative w-full max-w-sm lg:max-w-md">
                        <Image
                            src="/images/dobbi-hug.png"
                            alt="Hero Image"
                            width={450}
                            height={270}
                            layout="responsive"
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>

    );
}


