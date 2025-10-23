import React from "react";
import { Link } from "react-router-dom";
import "./Test.css";

const Test = () => {
  return (
    <div className="contact-container">
      <Link to="/tests" className="contact-card">
        <div className="contact-icon">🧬</div>
        <h3>Blood Test</h3>
        <p>Comprehensive blood analysis for accurate results.</p>
      </Link>

      <Link to="/tests" className="contact-card">
        <div className="contact-icon">🩺</div>
        <h3>Health Checkup</h3>
        <p>Full-body health screening with expert guidance.</p>
      </Link>

      <Link to="/tests" className="contact-card">
        <div className="contact-icon">🧫</div>
        <h3>Urine Test</h3>
        <p>Essential diagnostics for kidney and metabolic health.</p>
      </Link>

      <Link to="/tests" className="contact-card">
        <div className="contact-icon">💊</div>
        <h3>COVID-19 Test</h3>
        <p>Quick and reliable testing with fast reporting.</p>
      </Link>
    </div>
  );
};

export default Test;
