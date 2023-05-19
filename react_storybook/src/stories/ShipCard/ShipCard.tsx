import React, { useState } from "react";
import "./shipCard.css";

interface Props {
  shipName: string;
  shipImage: string;
}

export function ShipCard({ shipName, shipImage }: Props) {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={"ship-card " + (selected ? 'ship-card--selected' : 'ship-card--unselected')}
      onClick={() => setSelected(!selected)}
    >
      <img src={shipImage} alt="Background" className="background-image" />
      <div className="ship-card__content">
        <h2 className="ship-card__title">{shipName}</h2>
        <div className="ship-card__selection-icon-wrapper">
          <img
            src={selected ? "../assets/selected.svg" : "../assets/unselected.svg"}
            alt="Selection icon"
            className="ship-card__selection-icon"
          />
        </div>
      </div>
    </div>
  );
}

export default ShipCard;
