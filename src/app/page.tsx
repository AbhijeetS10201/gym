import React from 'react';
import PricingCards from '@/components/PricingCards';
import { db } from '@/lib/db';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import LocationsPreview from '@/components/LocationsPreview';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import Footer from '@/components/Footer';
import './marketing.css';

// Fallback plans in case the database is empty or not loaded yet
const FALLBACK_PLANS = [
  {
    id: "silver-fallback",
    name: "Silver Plan",
    slug: "silver-plan",
    price: 999,
    duration: 1,
    tier: "SILVER",
    description: "Access to your home gym location with all basic facilities.",
    features: JSON.stringify([
      'Access to home gym location',
      'Basic workout planner tools',
      'Standard equipment access',
      'Free Wi-Fi access'
    ]),
    popular: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "gold-fallback",
    name: "Gold Plan",
    slug: "gold-plan",
    price: 1999,
    duration: 1,
    tier: "GOLD",
    description: "Popular choice. Access to any gym franchise in India with group classes.",
    features: JSON.stringify([
      'Access to all gym locations across India',
      'All standard features',
      'Access to group classes',
      'Progress tracking charts',
      '1 complimentary personal trainer assessment'
    ]),
    popular: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "platinum-fallback",
    name: "Platinum Plan",
    slug: "platinum-plan",
    price: 3499,
    duration: 1,
    tier: "PLATINUM",
    description: "The ultimate fitness package including personal trainers and custom nutrition.",
    features: JSON.stringify([
      'Access to all gym locations across India',
      '4 personal trainer sessions per month',
      'Customized nutrition & diet plans',
      'Priority booking for premium classes',
      'Free access to healthy shake bar (1/day)',
      'Exclusive locker room access'
    ]),
    popular: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const FALLBACK_LOCATIONS = [
  {
    id: "bandra-fallback",
    name: "AB Fitness - Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Linking Road, Opp KFC, Bandra West, Mumbai 400050",
    phone: "022-26458991",
    email: "bandra@abfitness.com",
    lat: 19.0596,
    lng: 72.8295,
    rating: 4.8,
    timings: "6:00 AM - 11:00 PM",
    imageUrl: null,
    amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'CrossFit', 'Cafe', 'Locker Room']),
  },
  {
    id: "indiranagar-fallback",
    name: "AB Fitness - Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    address: "100 Feet Road, Indiranagar, Bengaluru 560038",
    phone: "080-41223456",
    email: "indiranagar@abfitness.com",
    lat: 12.9719,
    lng: 77.6412,
    rating: 4.9,
    timings: "5:00 AM - 11:00 PM",
    imageUrl: null,
    amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'Locker Room', 'Steam Bath']),
  }
];

export default async function Home() {
  let plans = [];
  let locations = [];

  try {
    plans = await db.plan.findMany({
      where: { active: true }
    });
    if (plans.length === 0) plans = FALLBACK_PLANS;
  } catch (err) {
    console.error("Failed to fetch plans, using fallbacks:", err);
    plans = FALLBACK_PLANS;
  }

  try {
    locations = await db.gymLocation.findMany({
      where: { active: true }
    });
    if (locations.length === 0) locations = FALLBACK_LOCATIONS;
  } catch (err) {
    console.error("Failed to fetch locations, using fallbacks:", err);
    locations = FALLBACK_LOCATIONS;
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features / Amenities Grid */}
        <FeaturesGrid />
        
        {/* Testimonials Slider */}
        <TestimonialsCarousel />

        {/* Gym Locator Map Preview */}
        <LocationsPreview locations={locations} />

        {/* Pricing Subscriptions Section */}
        <section id="pricing" className="section container">
          <div className="section-header">
            <span className="section-subtitle">Memberships</span>
            <h2 className="section-title">CHOOSE YOUR VIBE PLAN</h2>
            <p className="section-desc">
              Unlock the ultimate fitness workspace. Choose the subscription model that works for your life.
            </p>
          </div>
          
          <PricingCards plans={plans} />
        </section>
      </main>
      <Footer />
    </>
  );
}
