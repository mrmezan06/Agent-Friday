import React from 'react';

export default function LiveTranscript({ text }) {
  if (!text) return null;

  const words = text.trim().split(/\s+/);

  return (
    <div className="live-transcript">
      <div className="transcript-label">You said:</div>
      <div className="transcript-text">
        {words.map((word, index) => (
          <span
            key={index}
            className="word"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}