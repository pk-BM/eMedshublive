import React from 'react';
import './Heading.css'

export const Heading = ({ heading, text }) => {
  return (
    <div className="heading-container ">
      <h2>{heading}</h2>
      <p>{text}</p>
    </div>
  );
};
