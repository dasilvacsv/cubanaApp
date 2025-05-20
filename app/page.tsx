"use client";

import MedicalCard from "@/components/MedicalCard";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-[8.5in] mx-auto">
        <div className="bg-white rounded shadow page">
          <MedicalCard />
        </div>
      </div>
    </main>
  );
}