import { Language, StudentProfile } from '../types';
import { CAREER_ROLES } from '../data/rolesData';
import { calculateRoleGaps, getCareerRecommendations } from './recommendationEngine';

export interface VoiceIntentResult {
  matchedIntent: 'next_step' | 'explain_gaps' | 'show_careers' | 'general';
  spokenResponse: string;
  spokenResponseHi: string;
  spokenResponseMr: string;
}

/**
 * Parses user speech/text and generates multi-lingual spoken responses
 * grounded in the user's specific vocational skill profile.
 */
export function processVoiceIntent(
  transcript: string,
  profile: StudentProfile,
  language: Language = 'en'
): VoiceIntentResult {
  const query = transcript.toLowerCase().trim();
  const targetRole =
    CAREER_ROLES.find((r) => r.id === profile.targetRoleId) || CAREER_ROLES[0];
  const { readiness, gaps } = calculateRoleGaps(targetRole, profile.skills);
  const missingGaps = gaps.filter((g) => g.status === 'missing');
  const topGap = missingGaps[0] || gaps[0];

  // 1. Next Step intent
  if (
    query.includes('next') ||
    query.includes('step') ||
    query.includes('अगला') ||
    query.includes('कदम') ||
    query.includes('पुढची') ||
    query.includes('पायरी') ||
    query.includes('roadmap') ||
    query.includes('path')
  ) {
    const skillName = topGap ? topGap.skillName : 'Practical Workshop Training';
    return {
      matchedIntent: 'next_step',
      spokenResponse: `Your highest priority next step is mastering ${skillName}. Completing this module will bridge your biggest gap towards becoming a certified ${targetRole.title}.`,
      spokenResponseHi: `आपका अगला सबसे महत्वपूर्ण कदम ${topGap ? topGap.skillName : 'कौशल मॉड्यूल'} सीखना है। इसे पूरा करने से ${targetRole.titleHi} पद के लिए आपकी तैयारी तेजी से बढ़ेगी।`,
      spokenResponseMr: `तुमची पुढची मुख्य पायरी म्हणजे ${topGap ? topGap.skillName : 'कौशल्य'} पूर्ण करणे. यामुळे ${targetRole.titleMr} या पदासाठी तुमची पात्रता लक्षणीय वाढेल.`,
    };
  }

  // 2. Explain Gaps intent
  if (
    query.includes('gap') ||
    query.includes('गैप') ||
    query.includes('तफावत') ||
    query.includes('missing') ||
    query.includes('कमजोरी') ||
    query.includes('कमी') ||
    query.includes('skill')
  ) {
    const missingList = gaps
      .filter((g) => g.status === 'missing')
      .map((g) => g.skillName)
      .slice(0, 3)
      .join(', ');

    return {
      matchedIntent: 'explain_gaps',
      spokenResponse: `For ${targetRole.title}, your current readiness is ${readiness}%. Your main skill gaps to cover are ${missingList || 'foundational lab certifications'}.`,
      spokenResponseHi: `${targetRole.titleHi} के लिए आपकी वर्तमान तत्परता ${readiness}% है। मुख्य स्किल गैप्स हैं: ${missingList || 'प्रमाणित व्यावहारिक कौशल'}।`,
      spokenResponseMr: `${targetRole.titleMr} साठी तुमची तयारी ${readiness}% आहे. तुमच्या मुख्य कौशल्य तफावती आहेत: ${missingList || 'प्रमाणित कौशल्ये'}.`,
    };
  }

  // 3. Show Careers intent
  if (
    query.includes('career') ||
    query.includes('job') ||
    query.includes('करियर') ||
    query.includes('नोकरी') ||
    query.includes('match') ||
    query.includes('रोल')
  ) {
    const recs = getCareerRecommendations(profile);
    const topRec = recs[0];
    const topTitle = topRec ? topRec.role.title : targetRole.title;
    const topTitleHi = topRec ? topRec.role.titleHi : targetRole.titleHi;
    const topTitleMr = topRec ? topRec.role.titleMr : targetRole.titleMr;
    const coverage = topRec ? topRec.skillCoverage : readiness;

    return {
      matchedIntent: 'show_careers',
      spokenResponse: `Based on your verified skills, your top recommended career match is ${topTitle} with an estimated readiness of ${coverage}%.`,
      spokenResponseHi: `आपकी सत्यापित योग्यताओं के आधार पर, आपके लिए सबसे उपयुक्त करियर ${topTitleHi} है, जिसमें आपकी तत्परता लगभग ${coverage}% है।`,
      spokenResponseMr: `तुमच्या कौशल्यांनुसार सर्वात योग्य करिअर ${topTitleMr} आहे, ज्यामध्ये तुमची तयारी अंदाजे ${coverage}% आहे.`,
    };
  }

  // 4. Default / General Voice Response
  return {
    matchedIntent: 'general',
    spokenResponse: `Hello ${profile.name}! You are currently tracking ${targetRole.title} with ${readiness}% readiness. You can ask about your roadmap, skill gaps, or matched careers anytime.`,
    spokenResponseHi: `नमस्ते ${profile.name}! आप ${targetRole.titleHi} के लिए प्रयासरत हैं और आपकी तैयारी ${readiness}% है। आप कभी भी अपने रोडमैप या स्किल गैप्स के बारे में पूछ सकते हैं।`,
    spokenResponseMr: `नमस्कार ${profile.name}! तुम्ही ${targetRole.titleMr} साठी प्रयत्नशील आहात आणि तयारी ${readiness}% आहे. तुम्ही रोडमॅप किंवा नोकऱ्यांबद्दल विचारू शकता.`,
  };
}

/**
 * Text-to-speech engine using the browser SpeechSynthesis API.
 * Gracefully selects the best available voice for Indian English, Hindi, or Marathi.
 */
export function speakText(text: string, language: Language = 'en'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const targetLangCode =
        language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.lang = targetLangCode;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const matchingVoice =
          voices.find((v) => v.lang === targetLangCode) ||
          voices.find((v) => v.lang.startsWith(language)) ||
          voices.find((v) => v.lang.includes('IN'));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = () => {
        resolve();
      };

      // Fallback timeout in case onend doesn't fire
      setTimeout(() => {
        resolve();
      }, 8000);

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}
