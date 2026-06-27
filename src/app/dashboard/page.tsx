import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Target, 
  Dumbbell, 
  CreditCard, 
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch metrics
  const activeGoalsCount = await db.fitnessGoal.count({
    where: {
      userId,
      status: "IN_PROGRESS",
    },
  });

  const totalLogsCount = await db.workoutLog.count({
    where: {
      userId,
    },
  });

  const membership = await db.membership.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      plan: true,
    },
  });

  const recentLogs = await db.workoutLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });

  // Fetch exercise names
  const exerciseIds = recentLogs.map((log) => log.exerciseId);
  const exercises = await db.exercise.findMany({
    where: {
      id: { in: exerciseIds },
    },
    select: {
      id: true,
      name: true,
      muscleGroup: true,
    },
  });

  const exerciseMap = new Map(
    exercises.map((ex) => [ex.id, { name: ex.name, muscleGroup: ex.muscleGroup }])
  );

  const getMembershipStatus = () => {
    if (!membership) return { text: "No Membership", color: "var(--accent-red)", tier: "N/A" };
    if (membership.status === "ACTIVE") {
      const now = new Date();
      if (new Date(membership.endDate) < now) {
        return { text: "Expired", color: "#6b7280", tier: membership.plan.tier };
      }
      return { text: "Active", color: "var(--accent-green)", tier: membership.plan.tier };
    }
    return { text: membership.status, color: "var(--accent-orange)", tier: membership.plan.tier };
  };

  const statusInfo = getMembershipStatus();

  return (
    <div>
      <div className="dashboard-welcome-banner">
        <h1 className="dashboard-welcome-title">Welcome back, {session.user.name}!</h1>
        <p className="dashboard-welcome-desc">
          Ready to crush your workout today? Track your fitness achievements, manage your membership, and monitor your metrics.
        </p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-label">Membership Tier</span>
            <span className="stat-card-value" style={{ fontSize: "1.5rem", marginTop: "0.25rem" }}>
              {statusInfo.tier === "N/A" ? "No Plan" : `${statusInfo.tier} Plan`}
            </span>
            <span style={{ fontSize: "0.85rem", color: statusInfo.color, fontWeight: "600" }}>
              {statusInfo.text}
            </span>
          </div>
          <div className="stat-card-icon">
            <CreditCard size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-label">Active Goals</span>
            <span className="stat-card-value">{activeGoalsCount}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              In progress
            </span>
          </div>
          <div className="stat-card-icon">
            <Target size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-label">Logged Workouts</span>
            <span className="stat-card-value">{totalLogsCount}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Total logs
            </span>
          </div>
          <div className="stat-card-icon">
            <Dumbbell size={24} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", marginTop: "3rem" }}>
        {/* Recent Workouts Log */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Recent Workouts</h2>
            <Link 
              href="/dashboard/log" 
              style={{ 
                color: "var(--primary)", 
                fontSize: "0.9rem", 
                fontWeight: "600", 
                display: "flex", 
                alignItems: "center",
                gap: "0.25rem"
              }}
            >
              Log Workout <ChevronRight size={16} />
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div 
              style={{ 
                background: "var(--bg-secondary)", 
                border: "1px solid var(--border-color)", 
                borderRadius: "var(--radius-md)", 
                padding: "3rem", 
                textAlign: "center",
                color: "var(--text-secondary)"
              }}
            >
              <Dumbbell size={40} style={{ margin: "0 auto 1rem auto", opacity: 0.5, color: "var(--secondary)" }} />
              <p style={{ marginBottom: "1rem" }}>No workouts logged yet. Start tracking your sets and reps!</p>
              <Link href="/dashboard/log" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                Log Your First Workout
              </Link>
            </div>
          ) : (
            <div className="timeline-container">
              {recentLogs.map((log) => {
                const exInfo = exerciseMap.get(log.exerciseId);
                return (
                  <div key={log.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-title">
                          {exInfo?.name || "Workout Session"}
                        </span>
                        <span className="timeline-date">
                          {new Date(log.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="timeline-body">
                        <div>
                          <strong>{log.sets} sets</strong> × <strong>{log.reps} reps</strong> at <strong>{log.weight} kg</strong>
                          {log.duration > 0 && <span> • Duration: {log.duration} mins</span>}
                        </div>
                        {log.notes && (
                          <div style={{ marginTop: "0.5rem", fontStyle: "italic", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Note: &quot;{log.notes}&quot;
                          </div>
                        )}
                        {exInfo?.muscleGroup && (
                          <span 
                            style={{ 
                              display: "inline-block", 
                              fontSize: "0.75rem", 
                              background: "rgba(255,255,255,0.05)", 
                              padding: "0.15rem 0.5rem", 
                              borderRadius: "4px", 
                              marginTop: "0.5rem" 
                            }}
                          >
                            {exInfo.muscleGroup}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
