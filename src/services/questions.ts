import { supabase } from "../lib/supabase";

import type {
  Chapter,
  QuestionWithDetails,
  Subject,
} from "../types/questions";

export async function getSubjects() {
  return supabase
    .from("subjects")
    .select(
      `
        id,
        name,
        description,
        icon,
        display_order,
        is_active
      `,
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .returns<Subject[]>();
}

export async function getChapters(subjectId?: number) {
  let query = supabase
    .from("chapters")
    .select(
      `
        id,
        subject_id,
        name,
        description,
        grade_level,
        display_order,
        is_active
      `,
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (subjectId !== undefined) {
    query = query.eq("subject_id", subjectId);
  }

  return query.returns<Chapter[]>();
}

export async function getQuestions() {
  return supabase
    .from("questions")
    .select(
      `
        id,
        chapter_id,
        question_text,
        question_type,
        difficulty,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        explanation,
        exam_year,
        source,
        xp_reward,
        is_active,
        chapters (
          id,
          name,
          subjects (
            id,
            name
          )
        )
      `,
    )
    .eq("is_active", true)
    .order("id", { ascending: true })
    .returns<QuestionWithDetails[]>();
}