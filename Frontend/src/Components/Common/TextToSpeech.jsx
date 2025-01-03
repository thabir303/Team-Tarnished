// src/components/common/TextToSpeech.jsx

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeOff } from 'lucide-react';

const TextToSpeech = ({ text, lang = 'bn-BD' }) => {
  const [voice, setVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const populateVoice = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      // Attempt to find a Bangla voice
      const banglaVoice = availableVoices.find(v => v.lang === lang);
      
      if (banglaVoice) {
        setVoice(banglaVoice);
      } else {
        // If no Bangla voice is found, optionally you can set a default or notify the user
        console.warn('No Bangla voice found. Please ensure your browser has Bangla TTS support.');
      }
    };

    populateVoice();
    window.speechSynthesis.onvoiceschanged = populateVoice;
  }, [lang]);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('দুঃখিত, আপনার ব্রাউজার টেক্সট-টু-স্পিচ সমর্থন করে না।');
      return;
    }

    if (!text) {
      alert('বক্তব্য করার জন্য কোনো টেক্সট নেই।');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    if (voice) {
      utterance.voice = voice;
    } else {
      // Optionally, set a default voice or handle the absence of a Bangla voice
      console.warn('Using default voice as Bangla voice is not available.');
    }

    // Customize voice parameters if needed
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center mt-2">
      <button
        onClick={speak}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={isSpeaking ? "উত্তর বন্ধ করুন" : "উত্তর শুনুন"}
      >
        {isSpeaking ? <VolumeOff size={20} /> : <Volume2 size={20} />}
      </button>
      {/* Inform the user if no Bangla voice is available */}
      {!voice && (
        <p className="ml-2 text-xs text-red-500">
          আপনার ব্রাউজারে বাংলা ভয়েস উপলব্ধ নেই।
        </p>
      )}
    </div>
  );
};

export default TextToSpeech;