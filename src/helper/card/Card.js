import React from "react";
import "./Card.css";

const Card = ({ text, numericalValue }) => {
  
  return (
    <div className="cardContainer">
      <div></div>
      <div>
        <div>
          <p>{text}</p>
        </div>
        <div>
          <h3>{numericalValue}</h3>
        </div>
      </div>
    </div>
  );
};

export default Card;
