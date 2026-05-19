import React from 'react';
import '../styles/ReactorLogo.css';

export default function ReactorLogo() {
  return (
    <div className="reactor-logo">
      <div className="reactor-ring r1" />
      <div className="reactor-ring r2" />
      <div className="reactor-ring r3" />
      <div className="reactor-core" />
    </div>
  );
}