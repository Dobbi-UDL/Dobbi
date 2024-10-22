"use client";

import React from "react";
import Image from "next/image";

export default function AppDownload() {
  return (
    <section id="app-download" className="bg-gradient-to-br from-white to-[#FFF0F0] py-12 md:py-20 min-h-screen flex items-center">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 xl:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
        <div className="w-full lg:w-1/2 max-w-3xl flex flex-col justify-center text-center lg:text-left mt-10 sm:mt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          <span className="text-[#F66C72]">Dobbi</span> is currently under Development
          </h1>
          <div className="space-y-4 mb-8">
            <p className="text-lg md:text-xl text-gray-600">
              We are working hard on the design and development of Dobbi to offer you the best possible experience.
            </p>
            <p className="text-lg md:text-xl text-gray-600 justify-center">
              <span className="font-semibold text-[#F66C72]">✓</span> Intuitive interface
              <span className="font-semibold text-[#F66C72]"> ✓</span> Innovative functionalities <p></p>
              <span className="font-semibold text-[#F66C72]"> ✓</span> Modern design
            </p>
            <p className="text-lg md:text-xl text-gray-600">
              Keep track of our progress and be the first to test our app when it's ready.            
            </p>
          </div>
          <div className="flex justify-center lg:justify-start">
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
          <div className="grid grid-cols-3 gap-4 relative w-full max-w-lg text-center">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="rounded-3xl transform transition-transform duration-300 hover:rotate-6"
                style={{
                  width: '105%',
                  height: '105%',
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                }}
              >
                <Image
                  src={`/images/mockup${index}.png`}
                  alt={`mockup${index}`}
                  layout="responsive"
                  width={144}
                  height={304}
                  className="rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="absolute bottom-4 right-4 text-sm text-gray-500 mt-4 text-center lg:text-right">
        *Images are representative. The final design may vary.
      </p>
    </section>
  );
}