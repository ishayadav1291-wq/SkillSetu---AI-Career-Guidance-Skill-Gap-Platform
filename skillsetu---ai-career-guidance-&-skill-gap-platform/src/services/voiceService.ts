import { Language, StudentProfile } from '../types';
import { calculateRoleGaps, getCareerRecommendations } from './recommendationEngine';
import { CAREER_ROLES } from '../data/rolesData';

export interface VoiceIntentResult {
  matchedIntent: 'next_step' | 'explain_gaps' | 'show_careers' | 'unknown';
  queryText: string;
  spokenResponse: string;
  spokenResponseHi: string;
  spokenResponseMr: string;
  actionPayload?: any;
}

/**
 * Routes voice input text to the appropriate MVP guidance intent.
 */
export function processVoiceIntent(
  transcript: string,
  profile: StudentProfile,
  language: Language = 'en'
): VoiceIntentResult {
  const clean = transcript.toLowerCase().trim();

  // 1. Next Step intent
  if (
    clean.includes('next step') ||
    clean.includes('kadam') ||
    clean.includes('agla') ||
    clean.includes('what should i do') ||
    clean.includes('pudhchi payari') ||
    clean.includes('पुढची') ||
    clean.includes('अगला कदम') ||
    clean.includes('आगे क्या')
  ) {
    const targetRole = CAREER_ROLES.find((r) => r.id === profile.targetRoleId) || CAREER_ROLES[0];
    const { readiness, gaps } = calculateRoleGaps(targetRole, profile.skills);
    const topGap = gaps.find((g) => g.status !== 'have');

    const spokenResponse = `Your target role is ${targetRole.title} with current readiness at ${readiness} percent. Your immediate next step is to complete Week 1 course for ${topGap ? topGap.skillName : 'safety standards'}.`;
    const spokenResponseHi = `आपका लक्ष्य ${targetRole.titleHi} है और आपकी तत्परता ${readiness} प्रतिशत है। आपका अगला कदम ${topGap ? topGap.skillName : 'कौशल अभ्यास'} के लिए पहला मॉड्यूल पूरा करना है।`;
    const spokenResponseMr = `तुमचे लक्ष्य ${targetRole.titleMr} असून तयारी ${readiness} टक्के आहे. तुमची पुढची पायरी म्हणजे ${topGap ? topGap.skillName : 'कौशल्य सराव'} पूर्ण करणे.`;

    return {
      matchedIntent: 'next_step',
      queryText: transcript,
      spokenResponse,
      spokenResponseHi,
      spokenResponseMr,
      actionPayload: { targetRole, topGap, readiness },
    };
  }

  // 2. Explain Skill Gaps intent
  if (
    clean.includes('gap') ||
    clean.includes('kamzori') ||
    clean.includes('tafawat') ||
    clean.includes('explain') ||
    clean.includes('samjhao') ||
    clean.includes('कमी') ||
    clean.includes('गैप') ||
    clean.includes('स्पष्ट')
  ) {
    const targetRole = CAREER_ROLES.find((r) => r.id === profile.targetRoleId) || CAREER_ROLES[0];
    const { readiness, gaps } = calculateRoleGaps(targetRole, profile.skills);
    const missingGaps = gaps.filter((g) => g.status === 'missing').map((g) => g.skillName);
    const partialGaps = gaps.filter((g) => g.status === 'partial').map((g) => g.skillName);

    const spokenResponse = `For ${targetRole.title}, your readiness is ${readiness} percent. You need to develop ${missingGaps.slice(0, 2).join(' and ')}, and upgrade your partial skill in ${partialGaps[0] || 'core diagnostics'}.`;
    const spokenResponseHi = `${targetRole.titleHi} के लिए आपकी तत्परता ${readiness}% है। आपको मुख्य रूप से ${missingGaps.slice(0, 2).join(' और ')} में कौशल सुधारने की आवश्यकता है।`;
    const spokenResponseMr = `${targetRole.titleMr} साठी तुमची तयारी ${readiness}% आहे. तुम्हाला मुख्यत्वे ${missingGaps.slice(0, 2).join(' आणि ')} शिकण्याची गरज आहे.`;

    return {
      matchedIntent: 'explain_gaps',
      queryText: transcript,
      spokenResponse,
      spokenResponseHi,
      spokenResponseMr,
      actionPayload: { gaps, readiness },
    };
  }

  // 3. Show Careers intent
  if (
    clean.includes('career') ||
    clean.includes('job') ||
    clean.includes('role') ||
    clean.includes('dikhao') ||
    clean.includes('nokri') ||
    clean.includes('करियर') ||
    clean.includes('दाखवा') ||
    clean.includes('नौकरी')
  ) {
    const recs = getCareerRecommendations(profile);
    const top2 = recs.slice(0, 2);

    const spokenResponse = `Based on your profile, your top career matches are ${top2[0].role.title} with ${top2[0].fitScore} percent fit, and ${top2[1]?.role.title} with ${top2[1]?.fitScore} percent fit.`;
    const spokenResponseHi = `आपकी प्रोफाइल के अनुसार, शीर्ष करियर हैं: ${top2[0].role.titleHi} (${top2[0].fitScore}% फिट) और ${top2[1]?.role.titleHi} (${top2[1]?.fitScore}% फिट)।`;
    const spokenResponseMr = `तुमच्या प्रोफाइलनुसार अव्वल करिअर: ${top2[0].role.titleMr} (${top2[0].fitScore}% फिट) आणि ${top2[1]?.role.titleMr} (${top2[1]?.fitScore}% फिट).`;

    return {
      matchedIntent: 'show_careers',
      queryText: transcript,
      spokenResponse,
      spokenResponseHi,
      spokenResponseMr,
      actionPayload: { recommendations: top2 },
    };
  }

  // Fallback
  return {
    matchedIntent: 'unknown',
    queryText: transcript,
    spokenResponse: `I heard: "${transcript}". You can ask me: "What is my next step?", "Explain my skill gaps", or "Show careers for me".`,
    spokenResponseHi: `मैंने सुना: "${transcript}"। आप मुझसे पूछ सकते हैं: "मेरा अगला कदम क्या है?", "मेरी स्किल गैप्स समझाओ", या "मेरे लिए करियर दिखाओ"।`,
    spokenResponseMr: `मी ऐकले: "${transcript}". तुम्ही विचारू शकता: "माझी पुढची पायरी काय आहे?", "माझी कौशल्य तफावत स्पष्ट करा", किंवा "माझ्यासाठी करिअर दाखवा".`,
  };
}

/**
 * Text-to-Speech synthesis utilizing Web Speech API with regional voice fallbacks.
 */
export function speakText(text: string, language: Language = 'en'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser environment.');
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang.startsWith(langCode.slice(0, 2)) || v.lang.includes('IN')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}
