import React from 'react';

export default function ResultDisplay({ result }) {
  const text = result?.spokenResponse || '';
  const words = text.split(' ').filter(Boolean);
  const sources = result?.sources || [];
  const sourceType = result?.sourceType;

  if (!result) return null;

  return (
    <div className="result-container">
      <div className="result-text">
        {words.map((word, idx) => (
          <span
            key={idx}
            className="word"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            {word}
          </span>
        ))}
      </div>

      {sources.length > 0 && (
        <div className="sources">
          <h4>
            {sourceType === 'web_search'
              ? 'Sources'
              : sourceType === 'groq_llm'
                ? 'Powered by'
                : 'Source'}
          </h4>
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.link || '#'}
              target={source.link ? '_blank' : '_self'}
              rel="noopener noreferrer"
            >
              {source.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}