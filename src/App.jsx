import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const wheelRef = useRef(null);
  const [score, setScore] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultText, setResultText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const prizes = [70, 30, 90, 50, 20, 100, 10, 60];
  const [freeSpins, setFreeSpins] = useState(0);
  const [rotation, setRotation] = useState(0);

  const tgApp = window.Telegram?.WebApp || {
    expand: () => {},
    ready: () => {},
    BackButton: { onClick: () => {} },
    close: () => {},
  };

  useEffect(() => {
    tgApp.expand();
    tgApp.ready();

    tgApp.BackButton.onClick(() => {
      if (showModal) {
        setShowModal(false);
      } else {
        tgApp.close();
      }
    });
  }, []);

  const getPrizeFromRotation = (deg) => {
    const norm = deg % 360;
    const index = Math.round(norm / 45) % 8;
    const prizeIndex = index === 0 ? 0 : (8 - index) % 8;
    return prizes[prizeIndex];
  };

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setSpinsLeft(spinsLeft - 1);
    setResultText("");

    const turns = 5 + Math.floor(Math.random() * 5);
    const extra = Math.floor(Math.random() * 360);
    const totalRotation = turns * 360 + extra;

    setRotation((prev) => prev + totalRotation);
    wheelRef.current.style.transform = `rotate(${rotation + totalRotation}deg)`;

    setTimeout(() => {
      const prize = getPrizeFromRotation(extra);
      setScore((prev) => prev + prize);
      setResultText(`You won ${prize} points!`);

      if (spinsLeft - 1 <= 0) {
        const bonusSpins = Math.max(1, Math.floor((score + prize) / 20));
        setFreeSpins(bonusSpins);
        setShowModal(true);
      }

      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div className="container">
      <h1>Spin & Win</h1>
      <div className="wheel-container">
        <div className="wheel" ref={wheelRef}>
          {prizes.map((p, i) => (
            <div
              key={i}
              className="wheel-section"
              style={{ "--i": i + 1, "--clr": getColor(i) }}
            >
              <span>{p}</span>
            </div>
          ))}
        </div>
        <div className="spinner"></div>
      </div>
      <button id="spin-btn" onClick={spinWheel}>
        SPIN
      </button>
      <div className="stats">
        <div className="score">
          Score: <span>{score}</span>
        </div>
        <div className="spins">
          Spins Left: <span>{spinsLeft}</span>
        </div>
      </div>
      <div className="result">{resultText}</div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <h2>Congratulations!</h2>
            <p>
              You've won <span id="free-spins">{freeSpins}</span> free spins!
            </p>
            <p className="total-score">
              Your total score: <span>{score}</span>
            </p>
            <p className="bonus-text">
              Register on the site to get your bonuses
            </p>
            <a
              href="https://blastbet.com/en/games"
              target="_blank"
              id="get-bonus-btn"
            >
              GET YOUR BONUSES
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function getColor(index) {
  const colors = [
    "#ff0000",
    "#ff8800",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#8800ff",
    "#ff00ff",
  ];
  return colors[index % colors.length];
}

export default App;
