import React from 'react';

export default function BlobAnimation({ isListening, isSpeaking, audioLevel }) {
  const clamped = Math.min(Math.max(audioLevel || 0, 0), 1);

  let stateClass = 'idle';

  if (isSpeaking) {
    stateClass = 'speaking';
  } else if (isListening) {
    stateClass = 'listening';
  }

  return (
    <div className="blob-container">
      <div className="blob-ring state-ring" data-state={stateClass} />
      <div className="blob-ring-outer state-ring-outer" data-state={stateClass} />
      <div className={`blob ${stateClass}`} />
    </div>
  );
}