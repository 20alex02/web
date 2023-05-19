import React from "react";
import "./playerCard.css";

interface Props {
  playerName: string;
  playerImage: string;
  registeredAt: Date;
  timePlayedSeconds: number;
  rank: string;
  rankedPosition: number;
}

export function PlayerCard({
  playerName,
  playerImage,
  registeredAt,
  timePlayedSeconds,
  rank,
  rankedPosition,
}: Props) {
  return (
    <>
      <div className="player-card">
        <div className="player-card__player-info">
          <div className="player-card__info-wrapper">
            <h3 className="player-card__player-info--emphasis">Name</h3>
            <p>{playerName}</p>
          </div>
          <div className="player-card__profile-image">
            <img src={playerImage} alt="Profile" className="image" />
          </div>
        </div>
        <div className="player-card__game-stats">
          <h3 className="player-card__player-info--emphasis">
            Game statistics
          </h3>
          <div>
            <div className="player-card__stat-entry">
              <p>Registered at:</p>
              <p>{registeredAt.toLocaleDateString()}</p>
            </div>
            <div className="player-card__stat-entry">
              <p>Time played:</p>
              <p>{timePlayedSeconds / 60 / 60}h</p>
            </div>
            <div className="player-card__stat-entry">
              <p>Rank:</p>
              <p>{rank}</p>
            </div>
            <div className="player-card__stat-entry">
              <p>Ranked position:</p>
              <p>{rankedPosition}.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayerCard;
