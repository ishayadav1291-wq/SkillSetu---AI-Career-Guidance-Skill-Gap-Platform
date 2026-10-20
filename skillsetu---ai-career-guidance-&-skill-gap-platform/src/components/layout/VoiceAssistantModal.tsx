import React, { useEffect, useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { processVoiceIntent, speakText, VoiceIntentResult } from '../../services/voiceService';

export const VoiceAssistantModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, profile, language, setActiveView } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [intentResult, setIntentResult] = useState<VoiceIntentResult | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  // Setup Web Speech Recognition if available
  useEffect(() => {
    if (!isVoiceModalOpen) {
      setIsListening(false);
      setIsSpeaking(false);
      window.speechSynthesis?.cancel();
    }
  }, [isVoiceModalOpen]);

  const handleStartListening = () => {
    setRecognitionError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionError('Speech recognition is not supported in this browser. Please use the quick voice chips below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        handleProcessSpeech(spokenText);
      };

      recognition.onerror = (err: any) => {
        setIsListening(false);
        setRecognitionError('Could not capture audio. Try clicking one of the sample voice questions below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setRecognitionError('Microphone permission or recognition error. Use sample chips below.');
    }
  };

  const handleProcessSpeech = async (text: string) => {
    const result = processVoiceIntent(text, profile, language);
    setIntentResult(result);

    const speechText =
      language === 'hi'
        ? result.spokenResponseHi
        : language === 'mr'
        ? result.spokenResponseMr
        : result.spokenResponse;

    setIsSpeaking(true);
    await speakText(speechText, language);
    setIsSpeaking(false);
  };

  const handleQuickPrompt = (promptText: string) => {
    setTranscript(promptText);
    handleProcessSpeech(promptText);
  };

  if (!isVoiceModalOpen) return null;

  const quickPrompts = [
    {
      label: language === 'hi' ? 'मेरा अगला कदम क्या है?' : language === 'mr' ? 'माझी पुढची पायरी काय आहे?' : 'What is my next step?',
      sub: 'Next step in learning pathway',
      query: 'What is my next step?',
    },
    {
      label: language === 'hi' ? 'मेरी स्किल गैप्स समझाओ' : language === 'mr' ? 'माझी कौशल्य तफावत स्पष्ट करा' : 'Explain my skill gaps',
      sub: 'Summary of missing skills',
      query: 'Explain my skill gaps',
    },
    {
      label: language === 'hi' ? 'मेरे लिए उपयुक्त करियर दिखाओ' : language === 'mr' ? 'माझ्यासाठी करिअर दाखवा' : 'Show careers for me',
      sub: 'Top matched roles',
      query: 'Show careers for me',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            window.speechSynthesis?.cancel();
            setIsVoiceModalOpen(false);
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#F28C28] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Feature 3: Voice-First Guidance</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {language === 'hi'
              ? 'आवाज से पूछें (Voice Assistant)'
              : language === 'mr'
              ? 'आवाजाने मार्गदर्शन मिळवा'
              : 'Voice Career Guide'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi'
              ? 'हिंदी, मराठी या अंग्रेजी में पूछें। स्किलसेतु आपको बोलकर समझाएगा।'
              : language === 'mr'
              ? 'मराठी, हिंदी किंवा इंग्रजीमध्ये विचारा. उत्तर ऐका.'
              : 'Ask in Hindi, Marathi, or English. SkillSetu listens and responds with speech.'}
          </p>
        </div>

        {/* Microphone Visualizer Circle */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative">
            {isListening && (
              <div className="absolute -inset-4 rounded-full bg-orange-400/20 animate-ping" />
            )}
            {isSpeaking && (
              <div className="absolute -inset-3 rounded-full bg-blue-500/20 animate-pulse" />
            )}
            <button
              onClick={isListening ? () => setIsListening(false) : handleStartListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white scale-110 shadow-rose-500/30'
                  : isSpeaking
                  ? 'bg-[#1F4E79] text-white animate-pulse'
                  : 'bg-gradient-to-tr from-[#1F4E79] to-[#2A68A1] text-white hover:scale-105 shadow-blue-900/20'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 animate-bounce" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          <span className="text-xs font-bold text-slate-600 mt-3">
            {isListening
              ? 'Listening... Speak now'
              : isSpeaking
              ? 'Setu is speaking...'
              : 'Tap to speak'}
          </span>
        </div>

        {/* Recognition Error Notice if any */}
        {recognitionError && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-800 text-center mb-3">
            {recognitionError}
          </div>
        )}

        {/* Spoken Answer & Result Card */}
        {intentResult && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Heard: "{transcript}"</span>
              <button
                onClick={() =>
                  speakText(
                    language === 'hi'
                      ? intentResult.spokenResponseHi
                      : language === 'mr'
                      ? intentResult.spokenResponseMr
                      : intentResult.spokenResponse,
                    language
                  )
                }
                className="p-1 text-[#1F4E79] hover:bg-blue-100 rounded flex items-center gap-1 font-bold text-[11px]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Repeat</span>
              </button>
            </div>
            <p className="text-sm font-medium text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
              {language === 'hi'
                ? intentResult.spokenResponseHi
                : language === 'mr'
                ? intentResult.spokenResponseMr
                : intentResult.spokenResponse}
            </p>

            {/* Quick Action to Navigate to Screen */}
            <div className="pt-1 flex justify-end">
              {intentResult.matchedIntent === 'next_step' && (
                <button
                  onClick={() => {
                    setIsVoiceModalOpen(false);
                    setActiveView('pathway');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F4E79] text-white text-xs font-bold hover:bg-[#143552]"
                >
                  <span>Open Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {intentResult.matchedIntent === 'explain_gaps' && (
                <button
                  onClick={() => {
                    setIsVoiceModalOpen(false);
                    setActiveView('gaps');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F4E79] text-white text-xs font-bold hover:bg-[#143552]"
                >
                  <span>Open Gap Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {intentResult.matchedIntent === 'show_careers' && (
                <button
                  onClick={() => {
                    setIsVoiceModalOpen(false);
                    setActiveView('matches');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F4E79] text-white text-xs font-bold hover:bg-[#143552]"
                >
                  <span>View Matched Careers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Voice Chips (Section 17.1 Demo Script) */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Try these instant voice questions:
          </span>
          <div className="space-y-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(p.query)}
                className="w-full text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-[#1F4E79] hover:bg-blue-50/50 transition-all flex items-center justify-between text-xs group cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-slate-800 group-hover:text-[#1F4E79]">
                    "{p.label}"
                  </span>
                  <span className="block text-[10px] text-slate-400">{p.sub}</span>
                </div>
                <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-[#1F4E79]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
