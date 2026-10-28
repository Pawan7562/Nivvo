import React, { useState, useEffect } from 'react';
import { Mic, X, Sparkles, Volume2 } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function VoiceSearchModal({ isOpen, onClose, onSelectQuery }) {
  const [isListening, setIsListening] = useState(true);
  const [spokenText, setSpokenText] = useState('');

  const SUGGESTED_VOICE_QUERIES = [
    'Crisp white formal shirt',
    'Coffee spill rescue kit',
    'EVA cloud slides',
    'Doorstep 2-size trial sneakers',
    'Supima cotton trunks',
    'Korean cargo pants'
  ];

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setSpokenText('');
      // Simulate listening transition
      const timer = setTimeout(() => {
        const randomQuery = SUGGESTED_VOICE_QUERIES[Math.floor(Math.random() * SUGGESTED_VOICE_QUERIES.length)];
        setSpokenText(randomQuery);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePick = (q) => {
    playClickSound();
    onSelectQuery(q);
    onClose();
  };

  return (
    <div className="voice-search-overlay" onClick={onClose}>
      <div className="voice-search-card" onClick={(e) => e.stopPropagation()}>
        <button className="voice-close-btn" onClick={onClose} aria-label="Close Voice Search">
          <X size={18} />
        </button>

        <div className="voice-mic-glow-wrapper">
          <div className="voice-pulsing-ring ring-1" />
          <div className="voice-pulsing-ring ring-2" />
          <div className="voice-mic-circle">
            <Mic size={32} color="#FFFFFF" />
          </div>
        </div>

        {/* Animated Audio Waveform Bars */}
        <div className="audio-waveform-bars">
          {[40, 70, 30, 90, 60, 100, 50, 85, 45, 95, 65, 35].map((h, i) => (
            <div 
              key={i} 
              className="wave-bar" 
              style={{ 
                animationDelay: `${i * 0.08}s`,
                height: `${h}%`
              }} 
            />
          ))}
        </div>

        <h3 className="voice-title">
          {spokenText ? `"${spokenText}"` : 'Listening for your outfit...'}
        </h3>
        <p className="voice-subtitle">
          {spokenText ? 'Matching with 10-minute dark store inventory...' : 'Speak now or tap any suggested fashion search below'}
        </p>

        {spokenText && (
          <button 
            className="voice-confirm-btn"
            onClick={() => handlePick(spokenText)}
          >
            <span>Search "{spokenText}"</span>
          </button>
        )}

        <div className="voice-suggestions-list">
          <span className="suggestions-label">Try saying:</span>
          <div className="voice-chips-row">
            {SUGGESTED_VOICE_QUERIES.map((q) => (
              <button 
                key={q} 
                className="voice-chip"
                onClick={() => handlePick(q)}
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
