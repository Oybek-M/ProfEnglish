export interface User {
  id: string;
  email: string;
  profession: 'it' | 'business' | null;
  level: string | null;
  goal: string | null;
  targetLevel?: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2' | null;
  firstName?: string | null;
  lastName?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  birthDate?: string | null;
  createdAt: string;
}

export interface VocabularyItem {
  word: string;
  meaningUz: string;
  transcription: string;
  example: string;
}

export interface PhraseItem {
  phrase: string;
  usage: string;
}

export interface Exercise {
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Lesson {
  cacheKey: string;
  title: string;
  durationMinutes: number;
  goalSentence: string;
  skill: string;
  mission: string;
  scenario: string;
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  conversationSequence: string[];
  exercises: Exercise[];
  roleplayCharacter: string;
  roleplayOpeningLine: string;
  finalTaskPrompt: string;
  reviewWords: string[];
  reviewPhrases: string[];
}

export interface EvaluationResult {
  scores: {
    vocabulary: number;
    grammar: number;
    fluency: number;
    professionalPhrases: number;
    communicationQuality: number;
    confidence: number;
  };
  overallScore: number;
  feedbackUz: string;
}

export interface LevelTestQuestion {
  id: number;
  question: string;
  options: string[];
}
