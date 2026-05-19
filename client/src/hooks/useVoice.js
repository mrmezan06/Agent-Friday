import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [weather, setWeather] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const voiceRef = useRef(null);
  const currentTranscriptRef = useRef('');

  const processCommand = useCallback(async (text) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const { data } = await axios.post(`${API_URL}/command/process`, {
        command: text,
      });

      const responseData = {
        spokenResponse: data.spokenResponse,
        sources: data.sources || [],
        sourceType: data.sourceType,
        result: data.result,
      };

      setResult(responseData);
      setTranscript('');
      currentTranscriptRef.current = '';
      setCommandHistory((prev) => [
        ...prev,
        { command: text, timestamp: Date.now() },
      ]);

      // Speak the response
      if (responseData.spokenResponse) {
        speak(responseData.spokenResponse);
      }

      if (
        responseData.sourceType === 'execute_only' &&
        responseData.result?.url
      ) {
        window.open(responseData.result.url, '_blank');
      }
    } catch (error) {
      console.error('Command processing error:', error);
      setResult({
        spokenResponse: "Sorry, I couldn't process that command right now.",
        sources: [],
        sourceType: 'error',
      });
      setTranscript('');
      currentTranscriptRef.current = '';
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current || !text) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsListening(true);
    setIsProcessing(false);
    setAudioLevel(0);
  }, []);

  const startListening = useCallback(() => {
    if (
      !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }

      const currentText = (finalTranscript || interim).trim();
      currentTranscriptRef.current = currentText;
      setTranscript(currentText);

      // Simulate audio level
      setAudioLevel(Math.random() * 0.8 + 0.2);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      setIsListening(true);
      setIsProcessing(false);
      setAudioLevel(0);
    };

    recognition.onend = () => {
      setIsListening(false);
      setAudioLevel(0);

      const finalText = currentTranscriptRef.current.trim();
      if (finalText) {
        processCommand(finalText);
        currentTranscriptRef.current = '';
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      setTranscript('');
      currentTranscriptRef.current = '';
      setIsSpeaking(false);
    } catch (err) {
      console.error('Failed to start recognition:', err);
    }
  }, [processCommand]);

  const restartListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {
        console.error('Failed to abort recognition:');
      }
    }
    startListening();
  }, [startListening]);

  const deleteHistory = useCallback(() => {
    setCommandHistory([]);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setTranscript('');
  }, []);

  useEffect(() => {
    const setVoice = () => {
      const voices = synthRef.current.getVoices();
      const female = voices.find(
        (v) =>
          v.name.toLowerCase().includes('veena') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('moira') ||
          v.name.toLowerCase().includes('tessa') ||
          v.name.toLowerCase().includes('susan') ||
          v.name.toLowerCase().includes('fiona') ||
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('woman'),
      );
      if (female) {
        voiceRef.current = female;
      }
    };
    setVoice();
    synthRef.current.onvoiceschanged = setVoice;
    return () => {
      synthRef.current.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/weather/current`);
        setWeather(data.weather);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/system/info`);
        setSystemInfo(data.system);
      } catch (error) {
        console.error('Failed to fetch system info:', error);
      }
    };
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    result,
    commandHistory,
    audioLevel,
    weather,
    systemInfo,
    startListening,
    restartListening,
    stopSpeaking,
    deleteHistory,
    clearResult,
    processCommand,
  };
}
