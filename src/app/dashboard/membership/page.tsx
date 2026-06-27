import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatINR } from "@/lib/razorpay";
import { 
  Dumbbell, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowLeft,
  Calendar
} from "lucide-react";

export const revalidate = 0;

export default async function MembershipPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch active or latest membership
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

  // Fetch user payments
  const payments = await db.payment.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getTierClass = (tier?: string) => {
    if (!tier) return "silver";
    return tier.toLowerCase(); // silver, gold, platinum
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>Success</span>;
      case "FAILED":
        return <span style={{ color: "var(--accent-red)", fontWeight: 600 }}>Failed</span>;
      default:
        return <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>Pending</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem" }}>Your Membership</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Manage your subscription plans, view your digital check-in card, and track payment transactions.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem" }}>
        {/* Digital Gym Card Column */}
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1.5rem" }}>Digital Pass</h2>
          
          {membership ? (
            <div className="digital-gym-card-container">
              <div className={`digital-gym-card ${getTierClass(membership.plan.tier)}`}>
                <div className="digital-card-glow" />
                <div className="digital-card-header">
                  <div className="digital-card-logo">
                    <Dumbbell size={20} style={{ color: "#ffffff" }} />
                    <span>AB FITNESS</span>
                  </div>
                  <div className="digital-card-tier">
                    {membership.plan.tier}
                  </div>
                </div>
                <div className="digital-card-body">
                  <div className="digital-card-number">{membership.cardNumber}</div>
                  <div className="digital-card-holder">{session.user.name}</div>
                </div>
                <div className="digital-card-footer">
                  <div className="digital-card-dates">
                    <span>
                      VALID FROM: {new Date(membership.startDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </span>
                    <span>
                      VALID THRU: {new Date(membership.endDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="digital-card-qr">
                    <div className="qr-simulated" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div 
              style={{ 
                background: "var(--bg-secondary)", 
                border: "1px solid var(--border-color)", 
                borderRadius: "var(--radius-md)", 
                padding: "3rem 2rem", 
                textAlign: "center",
                maxWidth: "500px",
                margin: "0 auto 3rem auto"
              }}
            >
              <AlertTriangle size={48} style={{ color: "var(--accent-orange)", marginBottom: "1rem" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>No Active Membership</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                You do not have an active membership pass. Please select a plan to gain access to our facilities.
              </p>
              <Link href="/#pricing" className="btn btn-primary">
                View Pricing Plans
              </Link>
            </div>
          )}
        </div>

        {/* Membership Details */}
        {membership && (
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              Subscription Summary
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Plan Name</span>
                <p style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.25rem" }}>{membership.plan.name}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Price Paid</span>
                <p style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.25rem" }}>{formatINR(membership.plan.price)}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Status</span>
                <p style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.25rem", color: membership.status === "ACTIVE" ? "var(--accent-green)" : "var(--text-secondary)" }}>
                  {membership.status}
                </p>
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Auto Renew</span>
                <p style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.25rem" }}>{membership.autoRenew ? "Enabled" : "Disabled"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1.5rem" }}>Billing History</h2>
          
          {payments.length === 0 ? (
            <div 
              style={{ 
                background: "var(--bg-secondary)", 
                border: "1px solid var(--border-color)", 
                borderRadius: "var(--radius-md)", 
                padding: "2rem", 
                textAlign: "center",
                color: "var(--text-secondary)"
              }}
            >
              No payment transactions found.
            </div>
          ) : (
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>OrderId</th>
                    <th>PaymentId</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{payment.razorpayOrderId}</td>
                      <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{payment.razorpayPaymentId || "N/A"}</td>
                      <td>{formatINR(payment.amount)}</td>
                      <td>{getStatusBadge(payment.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
