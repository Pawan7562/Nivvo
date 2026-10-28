import React, { useState } from 'react';
import { Sparkles, Trophy, Gift, CheckCircle2, ArrowRight, X, Coins } from 'lucide-react';
import { playClickSound, playOrderFanfare } from '../utils/audioEffects';

export default function ScratchCardModal({ isOpen, onClose, onRewardClaimed }) {
  const [isScratched, setIsScratched] = useState(false);
  const [rewardAmount] = useState(100);
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const handleScratch = () => {
    if (!isScratched) {
      setIsScratched(true);
      playOrderFanfare();
    }
  };

  const handleClaim = () => {
    playClickSound();
    setClaimed(true);
    if (onRewardClaimed) {
      onRewardClaimed(rewardAmount);
    }
    setTimeout(() => {
      onClose();
      setClaimed(false);
      setIsScratched(false);
    }, 1200);
  };

  return (
    <div className="scratch-card-overlay" onClick={onClose}>
      <div className="scratch-card-container" onClick={(e) => e.stopPropagation()}>
        <button className="scratch-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="scratch-header">
          <div className="scratch-trophy-badge">
            <Trophy size={26} color="#D97706" />
          </div>
          <h3>Nivvo Mystery Reward</h3>
          <p>Tap or scratch the card below to reveal your instant Fashion Cash!</p>
        </div>

        {/* Scratch Surface Card */}
        <div 
          className={`scratch-foil-card ${isScratched ? 'scratched' : ''}`}
          onClick={handleScratch}
        >
          {!isScratched ? (
            <div className="foil-overlay">
              <Gift size={42} color="#0F172A" />
              <span className="foil-instruction">✨ TAP TO SCRATCH ✨</span>
              <span className="foil-sub">Win up to ₹150 Nivvo Cash</span>
            </div>
          ) : (
            <div className="reward-content animate-pop">
              <Coins size={44} color="#D97706" className="reward-coin-icon" />
              <div className="reward-cash-title">YOU WON</div>
              <div className="reward-cash-number">₹{rewardAmount}</div>
              <span className="reward-cash-badge">INSTANT WALLET CASH</span>
              <p className="reward-note">Auto-applied at checkout on your next 10-minute order!</p>
            </div>
          )}
        </div>

        {isScratched && (
          <button 
            className="scratch-claim-btn"
            onClick={handleClaim}
            disabled={claimed}
          >
            {claimed ? (
              <>
                <CheckCircle2 size={16} />
                <span>Credited to Wallet!</span>
              </>
            ) : (
              <>
                <span>Claim ₹{rewardAmount} Nivvo Cash</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
