import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-hero">
        <h1>
          Book <em>Physio</em><br/>Care You Trust
        </h1>
        <p>
          Connect with qualified physiotherapists, schedule appointments at your convenience, and get back to feeling your best.
        </p>
        <div className="landing-cta">
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
            Sign In
          </Link>
        </div>
      </div>

      <div className="landing-cards">
        {[
          { icon: '🩺', title: 'Expert Physios', desc: 'Verified & qualified' },
          { icon: '📅', title: 'Easy Booking', desc: 'Pick your slot instantly' },
          { icon: '💳', title: 'Secure Payment', desc: 'Pay safely online' },
        ].map((f) => (
          <div className="landing-feature" key={f.title}>
            <div className="icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: '0.25rem' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}