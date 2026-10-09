"use client";

import React from "react";
import "./animations.css";

interface ScrollDownIndicatorProps {
  targetId?: string;
}

const ScrollDownIndicator: React.FC<ScrollDownIndicatorProps> = ({
  targetId = "content",
}) => {
  const handleScroll = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleScroll}
      aria-label="Scroll down"
      className="scroll-down"
    >
      <span className="scroll-down__mouse">
        <span className="scroll-down__wheel" />
      </span>

      <span className="scroll-down__text">Scroll Down</span>

      <span className="scroll-down__arrow">↓</span>
    </button>
  );
};

export default ScrollDownIndicator;