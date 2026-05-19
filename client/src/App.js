import React from 'react';
import useVoice from './hooks/useVoice';
import BlobAnimation from './components/BlobAnimation';
import ResultDisplay from './components/ResultDisplay';
import LiveTranscript from './components/LiveTranscript';
import Sidebar from './components/Sidebar';
import BackgroundBlobs from './components/BackgroundBlobs';
import ReactorLogo from './components/ReactorLogo';
import './styles/App.css';

function App() {
  const {
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    result,
    audioLevel,
    weather,
    systemInfo,
    startListening,
    restartListening,
    stopSpeaking,
    clearResult,
    processCommand,
  } = useVoice();

  const getStatusText = () => {
    if (isProcessing) return 'Processing...';
    if (isSpeaking) return 'Speaking...';
    if (isListening) return 'Listening...';
    return 'Ready';
  };

  return (
    <div className="app">
      <div
        className="app-bg"
        style={{
          backgroundImage: 'url(https://picsum.photos/id/1015/1920/1080)',
        }}
      />
      <div className="app-overlay" />

      <BackgroundBlobs />

      <ReactorLogo />

      <div className="main-content">
        <div className="dashboard">
          <div className={`status-text ${isListening ? 'listening' : ''}`}>
            {getStatusText()}
          </div>

          <BlobAnimation
            isListening={isListening}
            isSpeaking={isSpeaking}
            audioLevel={audioLevel}
          />

          <LiveTranscript text={transcript} />

          <ResultDisplay result={result} />
        </div>
      </div>

      <Sidebar
        weather={weather}
        systemInfo={systemInfo}
        onCommand={processCommand}
      />

      <div className="controls">
        {isSpeaking && (
          <button className="btn danger" onClick={stopSpeaking}>
            Stop Speaking (Ctrl+Q)
          </button>
        )}
        {!isListening && !isSpeaking && (
          <button className="btn primary" onClick={restartListening}>
            🎤 Start Listening
          </button>
        )}
        {isListening && (
          <button className="btn danger" onClick={restartListening}>
            Stop Listening
          </button>
        )}
        {result && !isSpeaking && (
          <button className="btn" onClick={clearResult}>
            Clear Result
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
