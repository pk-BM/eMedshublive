import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Test.css";
import { GetLatestTests } from "../../../lib/APIs/testAPI";

const Test = () => {
  const [tests, setTests] = useState([]);

  const getTests = async () => {
    try {
      const response = await GetLatestTests();
      setTests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTests();
  }, []);
  return (
    <div className="contact-container">
      {tests.map((test, index) => (
        <Link key={index} to={`/tests/${test._id}`} className="contact-card">
          <div className="contact-icon">🧬</div>
          <h3>{test.name}</h3>
          <p>{test.description.slice(0, 70)} ...</p>
        </Link>
      ))}
    </div>
  );
};

export default Test;
