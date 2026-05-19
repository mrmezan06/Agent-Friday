import React, { useState } from 'react';

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function MemoryBar({ label, used, total, color }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="sys-metric">
      <div className="sys-metric-header">
        <span>{label}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="sys-bar-track">
        <div
          className="sys-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="sys-metric-detail">
        {used}MB / {total}MB
      </div>
    </div>
  );
}

export default function Sidebar({ weather, systemInfo, onCommand }) {
  const [textInput, setTextInput] = useState('');
  const sys = systemInfo;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = textInput.trim();
    if (cmd && onCommand) {
      onCommand(cmd);
      setTextInput('');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-scroll">
        <h3>Weather</h3>
        {weather && (
          <div className="weather-card">
            <div className="weather-location">
              {weather.location}, {weather.country}
            </div>
            <div className="weather-temp">{Math.round(weather.main?.temp)}°</div>
            <div className="weather-desc">{weather.weather?.[0]?.description}</div>
            <div className="weather-detail">
              Feels {Math.round(weather.main?.feels_like)}° · Humidity {weather.main?.humidity}%
            </div>
          </div>
        )}

        <h3>System</h3>
        {sys ? (
          <div className="sys-section">
            <div className="sys-row">
              <span className="sys-label">OS</span>
              <span className="sys-value">{sys.platform} · {sys.hostname}</span>
            </div>
            <div className="sys-row">
              <span className="sys-label">Uptime</span>
              <span className="sys-value">{formatUptime(sys.uptime)}</span>
            </div>
            <div className="sys-row">
              <span className="sys-label">CPU</span>
              <span className="sys-value">{sys.cpu.usage}% · {sys.cpu.cores} cores</span>
            </div>

            <MemoryBar
              label="RAM"
              used={sys.memory.used}
              total={sys.memory.total}
              color="#00f3ff"
            />
          </div>
        ) : (
          <div className="sys-loading">Connecting...</div>
        )}
      </div>

      <form className="sidebar-input" onSubmit={handleSubmit}>
        <textarea
          placeholder="Type a command..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="sidebar-text-input"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </form>
    </div>
  );
}