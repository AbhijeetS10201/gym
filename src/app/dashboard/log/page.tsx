import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import WorkoutLogForm from "./WorkoutLogForm";

export const revalidate = 0;

export default async function LogPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch all exercises to populate dropdown selection
  const exercises = await db.exercise.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      muscleGroup: true,
    },
  });

  return (
    <div>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem" }}>Workout Logger</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Log your training volumes. Keep track of exercises, weights, sets, and notes to hit progressive overload.
        </p>
      </div>

      <WorkoutLogForm exercises={exercises} />
    </div>
  );
}
