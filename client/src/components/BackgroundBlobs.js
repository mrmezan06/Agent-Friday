import React, { useMemo } from 'react';
import '../styles/BackgroundBlobs.css';

const BLOB_COLORS = [
  'rgba(0, 243, 255, 0.15)',
  'rgba(138, 43, 226, 0.12)',
  'rgba(0, 255, 136, 0.10)',
  'rgba(255, 0, 128, 0.10)',
  'rgba(64, 128, 255, 0.13)',
  'rgba(255, 190, 0, 0.08)',
  'rgba(0, 243, 255, 0.08)',
  'rgba(168, 85, 247, 0.12)',
];

function generateBlobConfig(index) {
  const size = 180 + Math.random() * 320;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const duration = 14 + Math.random() * 18;
  const delay = -(Math.random() * 10);
  const driftX = -30 + Math.random() * 60;
  const driftY = -30 + Math.random() * 60;
  const morphFrames = Array.from({ length: 4 }, () => ({
    rx: 30 + Math.random() * 20,
    ry: 30 + Math.random() * 20,
    tx: -15 + Math.random() * 30,
    ty: -15 + Math.random() * 30,
  }));

  return {
    id: index,
    size,
    left,
    top,
    duration,
    delay,
    driftX,
    driftY,
    color: BLOB_COLORS[index % BLOB_COLORS.length],
    morphFrames,
  };
}

const BLOBS = Array.from({ length: 8 }, (_, i) => generateBlobConfig(i));

export default function BackgroundBlobs() {
  const blobs = useMemo(() => BLOBS, []);

  return (
    <div className="bg-blobs-container">
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="bg-blob"
          style={{
            '--size': `${blob.size}px`,
            '--left': `${blob.left}%`,
            '--top': `${blob.top}%`,
            '--duration': `${blob.duration}s`,
            '--delay': `${blob.delay}s`,
            '--drift-x': `${blob.driftX}px`,
            '--drift-y': `${blob.driftY}px`,
            '--color': blob.color,
            '--m0-rx': `${blob.morphFrames[0].rx}%`,
            '--m0-ry': `${blob.morphFrames[0].ry}%`,
            '--m0-tx': `${blob.morphFrames[0].tx}px`,
            '--m0-ty': `${blob.morphFrames[0].ty}px`,
            '--m1-rx': `${blob.morphFrames[1].rx}%`,
            '--m1-ry': `${blob.morphFrames[1].ry}%`,
            '--m1-tx': `${blob.morphFrames[1].tx}px`,
            '--m1-ty': `${blob.morphFrames[1].ty}px`,
            '--m2-rx': `${blob.morphFrames[2].rx}%`,
            '--m2-ry': `${blob.morphFrames[2].ry}%`,
            '--m2-tx': `${blob.morphFrames[2].tx}px`,
            '--m2-ty': `${blob.morphFrames[2].ty}px`,
            '--m3-rx': `${blob.morphFrames[3].rx}%`,
            '--m3-ry': `${blob.morphFrames[3].ry}%`,
            '--m3-tx': `${blob.morphFrames[3].tx}px`,
            '--m3-ty': `${blob.morphFrames[3].ty}px`,
          }}
        />
      ))}
    </div>
  );
}