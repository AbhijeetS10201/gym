import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import LocationsSearch from "./LocationsSearch";
import "../marketing.css";

export const revalidate = 3600; // Cache for 1 hour

export default async function LocationsPage() {
  const locations = await db.gymLocation.findMany({
    where: {
      active: true,
    },
    orderBy: {
      city: "asc",
    },
  });

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "120px", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
        <div className="container" style={{ marginBottom: "5rem" }}>
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <span className="section-subtitle">Gym Locations</span>
            <h1 className="section-title">FIND AN AB FITNESS GYM NEAR YOU</h1>
            <p className="section-desc">
              With 25+ locations across major cities in India, a world-class workout is always within reach. Explore amenities, schedules, and map directions.
            </p>
          </div>

          <Suspense fallback={<div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem" }}>Loading gym locations...</div>}>
            <LocationsSearch locations={locations} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
