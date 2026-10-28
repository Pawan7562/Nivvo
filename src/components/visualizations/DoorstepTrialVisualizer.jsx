import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Clock, Bike, ShieldCheck, ArrowRight, RotateCcw, Package, ThumbsUp } from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function DoorstepTrialVisualizer() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes in seconds (600s)

  const steps = [
    {
      id: 0,
      title: '1. Select 2 Sizes at Checkout',
      subtitle: 'Order UK 8 and UK 9 together with zero trial fee.',
      tag: 'Zero Deposit'
    },
    {
      id: 1,
      title: '2. 12-Min Courier Dispatch',
      subtitle: 'Rider collects both pairs directly from the local boutique shelf.',
      tag: 'Local Dispatch'
    },
    {
      id: 2,
      title: '3. 10-Minute Doorstep Try-On',
      subtitle: 'Try both sizes in the comfort of your home while courier waits.',
      tag: 'Try Before You Pay'
    },
    {
      id: 3,
      title: '4. Keep What Fits, Hand Over Other',
      subtitle: 'Keep UK 8, hand UK 9 back directly. Zero return forms or boxes.',
      tag: 'Instant Handover'
    }
  ];

  // Auto-advance steps every 4.5 seconds if isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  // Smooth countdown simulation for Step 2 (Doorstep Try-On)
  useEffect(() => {
    let timer;
    if (activeStep === 2) {
      setTimerSeconds(584); // Start at 09:44
      timer = setInterval(() => {
        setTimerSeconds(s => (s > 0 ? s - 1 : 600));
      }, 1000);
    } else {
      setTimerSeconds(600);
    }
    return () => clearInterval(timer);
  }, [activeStep]);

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const strokeDashoffset = 283 - (283 * (600 - timerSeconds)) / 600;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid rgba(19, 24, 21, 0.08)',
      boxShadow: '0 16px 40px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr'
    }}>
      {/* ─── LEFT: STEP BREAKDOWN & INTERACTIVE SCRUBBER ─── */}
      <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FDF6E8', color: '#B45309', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, marginBottom: '12px', width: 'fit-content' }}>
          <Sparkles size={13} />
          <span>FLAGSHIP INNOVATION</span>
        </div>

        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0C291E', letterSpacing: '-0.025em', margin: '0 0 8px 0' }}>
          The 10-Minute Doorstep Try-On
        </h3>
        <p style={{ fontSize: '13px', color: '#525A54', lineHeight: 1.55, margin: '0 0 24px 0' }}>
          Never guess your footwear or apparel size online again. Order two sizes, try both on at home, and keep the one that fits.
        </p>

        {/* Step Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => {
                  playClickSound();
                  setIsPlaying(false);
                  setActiveStep(step.id);
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: isActive ? '1.5px solid #0C291E' : '1px solid rgba(19, 24, 21, 0.08)',
                  backgroundColor: isActive ? '#F6F8F4' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0C291E' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#717A74', marginTop: '2px' }}>
                    {step.subtitle}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? '#0C291E' : '#EDEFE9',
                  color: isActive ? '#FFFFFF' : '#525A54'
                }}>
                  {step.tag}
                </span>
              </div>
            );
          })}
        </div>

        {/* Playback Controls */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#717A74' }}>
          <button
            onClick={() => {
              playClickSound();
              setIsPlaying(!isPlaying);
            }}
            style={{
              background: 'none',
              border: '1px solid rgba(19, 24, 21, 0.12)',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#0C291E',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
          </button>
          <span>Step {activeStep + 1} of 4</span>
        </div>
      </div>

      {/* ─── RIGHT: DYNAMIC ANIMATED SIMULATION STAGE ─── */}
      <div style={{
        backgroundColor: '#0C291E',
        color: '#FFFFFF',
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Glow */}
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          backgroundColor: '#C49752',
          opacity: 0.12,
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        {/* STAGE 0: DUAL SIZE SELECTOR SIMULATION */}
        {activeStep === 0 && (
          <div style={{ textAlign: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#C49752', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              STEP 1: SIZING CONFIGURATION
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 18px 0', color: '#FFFFFF' }}>
              Everyday Court Sneaker
            </h4>

            {/* Sizing Chips Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #22C55E',
                borderRadius: '10px',
                padding: '14px 20px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 800 }}>PRIMARY SIZE</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>UK 8</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #C49752',
                borderRadius: '10px',
                padding: '14px 20px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(196, 151, 82, 0.3)'
              }}>
                <div style={{ fontSize: '11px', color: '#C49752', fontWeight: 800 }}>TRIAL SIZE (FREE)</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>UK 9</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)' }}>
              ✓ Both pairs dispatched together &nbsp; ✓ Zero return paperwork
            </div>
          </div>
        )}

        {/* STAGE 1: COURIER DISPATCH SIMULATION */}
        {activeStep === 1 && (
          <div style={{ textAlign: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#C49752', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              STEP 2: LOCAL DISPATCH
            </div>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(196, 151, 82, 0.18)',
              border: '2px solid #C49752',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#C49752',
              boxShadow: '0 0 24px rgba(196, 151, 82, 0.4)'
            }}>
              <Bike size={36} strokeWidth={2.2} />
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
              Direct From Sole Street Shelf
            </h4>
            <div style={{ fontSize: '14px', color: '#22C55E', fontWeight: 700, marginBottom: '6px' }}>
              Arriving in 12 Minutes
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              Courier Rajesh M. is carrying both pairs in a reusable trial tote bag.
            </p>
          </div>
        )}

        {/* STAGE 2: 10-MINUTE COUNTDOWN RING */}
        {activeStep === 2 && (
          <div style={{ textAlign: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#C49752', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              STEP 3: 10-MIN HOME TRY-ON
            </div>

            {/* Circular Progress Ring */}
            <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px' }}>
              <svg width="140" height="140" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Track */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" />
                {/* Animated Sweep Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#C49752"
                  strokeWidth="6"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>

              {/* Center Digital Timer */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  {timeFormatted}
                </div>
                <div style={{ fontSize: '10px', color: '#C49752', fontWeight: 800 }}>
                  TRY-ON WINDOW
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
              Try both pairs on carpets or indoors. The courier waits at your door.
            </p>
          </div>
        )}

        {/* STAGE 3: INSTANT HANDOVER CONFIRMATION */}
        {activeStep === 3 && (
          <div style={{ textAlign: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              STEP 4: ZERO-FRICTION HANDOVER
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1.5px solid #22C55E',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <Check size={20} color="#22C55E" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>KEEP UK 8</div>
                <div style={{ fontSize: '10px', color: '#22C55E', marginTop: '2px' }}>Perfect Fit</div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <RotateCcw size={18} color="#C49752" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>RETURN UK 9</div>
                <div style={{ fontSize: '10px', color: '#C49752', marginTop: '2px' }}>Hand to Rider</div>
              </div>
            </div>

            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Pay Only for What You Keep
            </h4>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)' }}>
              Scan UPI or pay cash on doorstep. The returned size goes straight back to the shop.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
