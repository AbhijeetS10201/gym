import React from 'react';
import { Globe, Award, Activity, ShieldCheck, Zap, Coffee } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: <Globe size={24} />,
      title: "All-India Gym Access",
      desc: "One membership card grants access to any of our 25+ premium gym locations in major Indian cities. Work out wherever you travel."
    },
    {
      icon: <Award size={24} />,
      title: "Certified Personal Trainers",
      desc: "Get elite guidance from certified fitness coaches to accelerate your strength gains, safety, and form refinement."
    },
    {
      icon: <Activity size={24} />,
      title: "Digital Progress Logs",
      desc: "Log your weights, reps, and workout duration. Watch your fitness trends and body fat statistics improve over time."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "State-of-the-Art Gear",
      desc: "Train on top-tier cardiovascular equipment, custom CrossFit rigs, free weight sections, and Olympic lifting setups."
    },
    {
      icon: <Zap size={24} />,
      title: "Dynamic Group Classes",
      desc: "Join daily high-energy sessions including HIIT fat burners, recovery yoga, and functional conditioning circuits."
    },
    {
      icon: <Coffee size={24} />,
      title: "Healthy Shake Bar & Cafe",
      desc: "Refuel your muscles post-workout at our healthy cafe bars, serving customized protein blends and high-nutrition shakes."
    }
  ];

  return (
    <section id="features" className="section container">
      <div className="section-header">
        <span className="section-subtitle">Amenities & Benefits</span>
        <h2 className="section-title">WHY AB FITNESS?</h2>
        <p className="section-desc">
          We integrate premium fitness infrastructure with modern digital tools to deliver a premium, holistic gym experience.
        </p>
      </div>

      <div className="grid-responsive" style={{ marginTop: '2rem' }}>
        {features.map((f, i) => (
          <div key={i} className="card-glass">
            <div className="feature-icon-container">
              {f.icon}
            </div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
