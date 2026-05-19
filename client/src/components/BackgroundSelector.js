import React from 'react';

const backgrounds = [
  { label: 'Default Dark', value: 'https://picsum.photos/id/1015/1920/1080' },
  { label: 'Deep Space', value: 'https://picsum.photos/id/1015/1920/1080' },
  { label: 'Midnight City', value: 'https://picsum.photos/id/1005/1920/1080' },
  { label: 'Cyber Grid', value: 'https://picsum.photos/id/1016/1920/1080' },
  { label: 'Neon Night', value: 'https://picsum.photos/id/1036/1920/1080' },
  { label: 'Ocean Depth', value: 'https://picsum.photos/id/106/1920/1080' },
  { label: 'Abstract Glow', value: 'https://picsum.photos/id/160/1920/1080' },
];

export default function BackgroundSelector({ onChange }) {
  return (
    <div className="background-selector">
      <select onChange={(e) => onChange(e.target.value)}>
        {backgrounds.map((bg, idx) => (
          <option key={idx} value={bg.value}>
            {bg.label}
          </option>
        ))}
      </select>
    </div>
  );
}