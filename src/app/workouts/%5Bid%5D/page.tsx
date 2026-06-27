import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Flame, ChevronLeft, Award, HelpCircle, Dumbbell } from "lucide-react";
import RestTimer from "@/components/RestTimer";
import "../../marketing.css";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  const { id } = await params;

  const plan = await db.workoutPlan.findUnique({
    where: { id },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!plan) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "120px", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
        <div className="container" style={{ marginBottom: "5rem" }}>
          {/* Back button */}
          <Link 
            href="/workouts" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.25rem", 
              color: "var(--text-secondary)", 
              marginBottom: "2rem",
              fontSize: "0.95rem"
            }}
          >
            <ChevronLeft size={16} /> Back to Workout splits
          </Link>

          {/* Plan Header */}
          <div 
            style={{ 
              background: "var(--bg-secondary)", 
              border: "1px solid var(--border-color)", 
              borderRadius: "var(--radius-lg)", 
              padding: "2.5rem 2rem",
              marginBottom: "3rem" 
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <span className="badge">{plan.category}</span>
              <span className="badge" style={{ color: "var(--secondary)", borderColor: "var(--secondary)" }}>
                {plan.difficulty}
              </span>
            </div>

            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "1rem" }}>
              {plan.name}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.6", maxWidth: "800px", marginBottom: "2rem" }}>
              {plan.description}
            </p>

            <div style={{ display: "flex", gap: "2rem", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Clock size={20} style={{ color: "var(--secondary)" }} />
                <strong>Duration:</strong> {plan.duration} minutes
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Flame size={20} style={{ color: "var(--accent-red)" }} />
                <strong>Est. Calories:</strong> {plan.calories} kcal
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Dumbbell size={20} style={{ color: "var(--primary)" }} />
                <strong>Exercises:</strong> {plan.exercises.length} movements
              </span>
            </div>
          </div>

          {/* Exercises Checklist */}
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "1.5rem" }}>Workout Breakdown</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {plan.exercises.map((item, idx) => {
                const ex = item.exercise;
                const tips: string[] = JSON.parse(ex.tips || "[]");

                return (
                  <div 
                    key={item.id}
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      padding: "1.5rem 2rem",
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "1.5rem"
                    }}
                  >
                    {/* Header: Number, Name, Target Stats */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span 
                          style={{ 
                            width: "36px", 
                            height: "36px", 
                            borderRadius: "50%", 
                            background: "rgba(139, 92, 246, 0.1)", 
                            border: "1px solid var(--primary)",
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "var(--primary)" 
                          }}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <h3 style={{ fontSize: "1.3rem", fontWeight: "800", margin: 0 }}>{ex.name}</h3>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {ex.muscleGroup} • {ex.equipment}
                          </span>
                        </div>
                      </div>

                      {/* Targets & Timer */}
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                        <div style={{ fontSize: "0.95rem" }}>
                          <span style={{ color: "var(--text-secondary)" }}>Target: </span>
                          <strong>{item.sets} sets</strong> × <strong>{item.reps} reps</strong>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Rest:</span>
                          <RestTimer defaultSeconds={item.restSeconds} />
                        </div>
                      </div>
                    </div>

                    {/* Body: Instructions & Tips */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                      <div>
                        <h4 style={{ fontSize: "0.9rem", color: "var(--secondary)", display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.5rem" }}>
                          <HelpCircle size={14} /> Instructions
                        </h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                          {ex.instructions}
                        </p>
                      </div>

                      {tips.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: "0.9rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.5rem" }}>
                            <Award size={14} /> Form & Safety Tips
                          </h4>
                          <ul style={{ paddingLeft: "1.25rem", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.5", margin: 0 }}>
                            {tips.map((tip, i) => (
                              <li key={i} style={{ marginBottom: "0.25rem" }}>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
