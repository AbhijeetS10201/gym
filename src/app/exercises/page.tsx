import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import ExercisesSearch from "./ExercisesSearch";
import "../marketing.css";

export const revalidate = 3600; // Cache for 1 hour

export default async function ExercisesPage() {
  const exercises = await db.exercise.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "120px", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
        <div className="container" style={{ marginBottom: "5rem" }}>
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <span className="section-subtitle">Exercise Library</span>
            <h1 className="section-title">EXERCISE DIRECTORY</h1>
            <p className="section-desc">
              Browse detailed instructions, muscle groups, equipment requirements, and professional tips for dozens of exercises to perfect your form.
            </p>
          </div>

          <Suspense fallback={<div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem" }}>Loading exercises...</div>}>
            <ExercisesSearch exercises={exercises} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
