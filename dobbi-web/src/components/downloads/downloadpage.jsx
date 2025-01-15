"use client";

import React from "react";
import Image from "next/image";

export default function AppDownload() {
  return (
    <section id="app-download" className="bg-gradient-to-br from-white to-[#FFF0F0] py-12 md:py-20 min-h-screen flex items-center">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 xl:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
        <div className="w-full lg:w-1/2 max-w-3xl flex flex-col justify-center text-center lg:text-left mt-10 sm:mt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Try <span className="text-[#F66C72]">Dobbi</span> Preview Now!
          </h1>
          <div className="space-y-4 mb-8">
            <p className="text-lg md:text-xl text-gray-600">
              We're excited to announce that you can now download the preview version of Dobbi!
            </p>
            <p className="text-lg md:text-xl text-gray-600 justify-center">
              <span className="font-semibold text-[#F66C72]">✓</span> Early access to features
              <span className="font-semibold text-[#F66C72]"> ✓</span> Help shape the future of Dobbi <p></p>
              <span className="font-semibold text-[#F66C72]"> ✓</span> Be part of our testing community
            </p>
            <p className="text-lg md:text-xl text-gray-600">
              Download now and help us improve your experience with your feedback.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="/path/to/your/apk/file"
              className="bg-[#F66C72] hover:bg-[#e55c62] text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download for Android
            </a>
            <button
              disabled
              className="border-2 border-gray-300 text-gray-400 font-bold py-3 px-8 rounded-full flex items-center gap-2 cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Coming soon to iOS
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
          <div className="grid grid-cols-3 gap-4 relative w-full max-w-lg text-center">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="rounded-3xl transform transition-transform duration-300 hover:rotate-6 p-2"
                style={{
                  width: '105%',
                  height: '105%',
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                }}
              >
                <Image
                  src={`/images/final${index}.png`}
                  alt={`final${index}`}
                  layout="responsive"
                  width={144}
                  height={304}
                  className="rounded-xl shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="absolute bottom-4 right-4 text-sm text-gray-500 mt-4 text-center lg:text-right">
        *Preview version may contain bugs. Your feedback helps us improve!
      </p>
    </section>
  );
}