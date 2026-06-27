import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import Link from "next/link";
import { Clock, Flame, Dumbbell, Award, ChevronRight } from "lucide-react";
import "../marketing.css";

export const revalidate = 3600; // Cache for 1 hour

export default async function WorkoutsPage() {
  const plans = await db.workoutPlan.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "beginner":
        return "var(--accent-green)";
      case "intermediate":
        return "var(--accent-orange)";
      case "advanced":
        return "var(--accent-red)";
      default:
        return "var(--primary)";
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "120px", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
        <div className="container" style={{ marginBottom: "5rem" }}>
          <div className="section-header" style={{ marginBottom: "3rem" }}>
            <span className="section-subtitle">Workout Splits</span>
            <h1 className="section-title">WORKOUT PLANS & DIRECTORY</h1>
            <p className="section-desc">
              Find the perfect training split tailored to your goals. Whether you want to build raw strength, pack on hypertrophy, or torch body fat.
            </p>
          </div>

          {plans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-secondary)" }}>
              <Dumbbell size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <h3>No Workout Plans Found</h3>
            </div>
          ) : (
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
                gap: "1.5rem" 
              }}
            >
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="glass-card"
                  style={{
                    padding: "2rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "320px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--bg-secondary)",
                    transition: "transform var(--transition-fast), border-color var(--transition-fast)"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span className="badge" style={{ fontSize: "0.75rem" }}>{plan.category}</span>
                      <span 
                        className="badge" 
                        style={{ 
                          fontSize: "0.75rem", 
                          borderColor: getDifficultyColor(plan.difficulty), 
                          color: getDifficultyColor(plan.difficulty) 
                        }}
                      >
                        {plan.difficulty}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                      {plan.name}
                    </h3>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                      {plan.description}
                    </p>
                  </div>

                  <div>
                    {/* Stats bar */}
                    <div 
                      style={{ 
                        display: "flex", 
                        gap: "1.5rem", 
                        fontSize: "0.85rem", 
                        color: "var(--text-secondary)", 
                        borderTop: "1px solid rgba(255,255,255,0.05)", 
                        paddingTop: "1rem",
                        marginBottom: "1.5rem" 
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={16} style={{ color: "var(--secondary)" }} />
                        {plan.duration} mins
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Flame size={16} style={{ color: "var(--accent-red)" }} />
                        {plan.calories} kcal
                      </span>
                    </div>

                    <Link 
                      href={`/workouts/${plan.id}`} 
                      className="btn btn-secondary" 
                      style={{ 
                        width: "100%", 
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem"
                      }}
                    >
                      View Workout split <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
