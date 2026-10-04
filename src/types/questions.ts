export type QuestionDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "short_answer";

export interface Subject {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Chapter {
  id: number;
  subject_id: number;
  name: string;
  description: string | null;
  grade_level: number;
  display_order: number;
  is_active: boolean;
}

export interface Question {
  id: number;
  chapter_id: number;
  question_text: string;
  question_type: QuestionType;
  difficulty: QuestionDifficulty;

  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;

  correct_answer: string;
  explanation: string | null;

  exam_year: number | null;
  source: string | null;
  xp_reward: number;
  is_active: boolean;
}

export interface QuestionWithDetails extends Question {
  chapters: {
    id: number;
    name: string;
    subjects: {
      id: number;
      name: string;
    };
  };
}