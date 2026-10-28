import React from "react";
import { ShoppingBag, Apple, UtensilsCrossed } from "lucide-react";
import { playClickSound } from "../utils/audioEffects";

const MODES = [
  {
    id: "shop",
    label: "Fashion & Store",
    Icon: ShoppingBag,
    badge: null,
    sub: "12m delivery"
  },
  {
    id: "grocery",
    label: "Grocery Mart",
    Icon: Apple,
    badge: "10m",
    sub: "Fresh daily"
  },
  {
    id: "food",
    label: "Food Dining",
    Icon: UtensilsCrossed,
    badge: "Hot",
    sub: "Live kitchens"
  },
];

export default function ShoppingModeSwitcher({ activeMode = "shop", onModeChange }) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E7EAE3",
        padding: "8px 14px",
        position: "relative",
        zIndex: 35
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {MODES.map((mode) => {
          const isActive = activeMode === mode.id;
          const IconComponent = mode.Icon;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                playClickSound();
                if (onModeChange) onModeChange(mode.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                flexShrink: 0,
                padding: "8px 14px",
                borderRadius: "10px",
                border: isActive ? "1.5px solid #24452D" : "1px solid #E7EAE3",
                backgroundColor: isActive ? "#24452D" : "#F7F8F5",
                color: isActive ? "#FFFFFF" : "#4A5245",
                fontFamily: "var(--nv-font, 'Inter', sans-serif)",
                cursor: "pointer",
                transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isActive ? "0 2px 6px rgba(36, 69, 45, 0.16)" : "none",
                outline: "none"
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "6px",
                  backgroundColor: isActive ? "rgba(183, 243, 74, 0.18)" : "#FFFFFF",
                  border: isActive ? "none" : "1px solid #E7EAE3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? "#B7F34A" : "#24452D"
                }}
              >
                <IconComponent size={13} strokeWidth={2.4} />
              </div>

              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  <span>{mode.label}</span>
                  {mode.badge && (
                    <span
                      style={{
                        fontSize: "8.5px",
                        fontWeight: 800,
                        padding: "1px 5px",
                        borderRadius: "4px",
                        backgroundColor: isActive ? "#B7F34A" : "#E2E8F0",
                        color: isActive ? "#24452D" : "#334155",
                        letterSpacing: "0.02em",
                        textTransform: "uppercase"
                      }}
                    >
                      {mode.badge}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "9.5px",
                    color: isActive ? "rgba(255, 255, 255, 0.72)" : "#73796F",
                    marginTop: "1px",
                    fontWeight: 500
                  }}
                >
                  {mode.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
