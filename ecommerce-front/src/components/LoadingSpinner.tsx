import React from "react";

interface LoadingSpinnerProps {
  /** Full-screen centering wrapper when true (default). */
  fullScreen?: boolean;
}

/**
 * Simple loading spinner used across Cart, Shop, Deals, and Profile pages.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = true,
}) => (
  <div
    className={
      fullScreen
        ? "min-h-screen flex items-center justify-center"
        : "flex items-center justify-center py-10"
    }
  >
    <span className="loading loading-spinner loading-lg text-orange-400" />
  </div>
);

export default LoadingSpinner;
