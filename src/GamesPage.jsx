import React, { useState } from "react";
import styles from "./GamesPage.module.css";
import BookingPage from "./BookingPage.jsx";

function GamesPage({ onBack }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 1,
      name: "Snooker",
      icon: "🎱",
      price: "₹100/hour",
      description: "Professional snooker table with premium cues",
      features: ["Full-size table", "Premium cues", "Professional balls"],
      color: "#4CAF50"
    },
    {
      id: 2,
      name: "PS5 Gaming",
      icon: "🎮",
      price: "₹100/hour",
      description: "Latest PS5 console with popular games",
      features: ["Latest games", "4K gaming", "Multiplayer support"],
      color: "#2196F3"
    },
    {
      id: 3,
      name: "Pool/8-Ball",
      icon: "🎯",
      price: "₹100/hour",
      description: "Classic pool table for 8-ball and 9-ball",
      features: ["American pool", "Professional felt", "Tournament size"],
      color: "#FF9800"
    },
    {
      id: 7,
      name: "Foosball",
      icon: "⚽",
      price: "₹80/hour",
      description: "Classic foosball table for competitive play",
      features: ["Sturdy construction", "Smooth rods", "Score counters"],
      color: "#795548"
    },

  ];

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  // If a game is selected, show booking page
  if (selectedGame) {
    return <BookingPage game={selectedGame} onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className={styles.gamesPage}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Choose Your Game</h1>
          <p className={styles.subtitle}>Select from our premium gaming collection</p>
        </div>
      </div>

      {/* Games Grid */}
      <div className={styles.gamesContainer}>
        <div className={styles.gamesGrid}>
          {games.map((game, index) => (
            <div
              key={game.id}
              className={styles.gameCard}
              style={{ '--card-delay': `${index * 0.1}s`, '--accent-color': game.color }}
              onClick={() => handleGameSelect(game)}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.cardContent}>
                <div className={styles.gameIcon}>{game.icon}</div>
                <h3 className={styles.gameName}>{game.name}</h3>
                <p className={styles.gamePrice}>{game.price}</p>
                <p className={styles.gameDescription}>{game.description}</p>
                <div className={styles.gameFeatures}>
                  {game.features.map((feature, idx) => (
                    <span key={idx} className={styles.feature}>• {feature}</span>
                  ))}
                </div>
                <button className={styles.bookButton}>
                  Book Now →
                </button>
              </div>
              <div className={styles.cardShine}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.floatingOrb}></div>
        <div className={styles.floatingOrb}></div>
        <div className={styles.floatingOrb}></div>
      </div>
    </div>
  );
}

export default GamesPage;
