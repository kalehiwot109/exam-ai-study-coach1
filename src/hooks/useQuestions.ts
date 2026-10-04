import { useCallback, useEffect, useState } from "react";

import {
  getChapters,
  getQuestions,
  getSubjects,
} from "../services/questions";

import type {
  Chapter,
  QuestionWithDetails,
  Subject,
} from "../types/questions";

export function useQuestions() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [questions, setQuestions] =
    useState<QuestionWithDetails[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQuestionBank = useCallback(async () => {
    setLoading(true);
    setError("");

    const [
      subjectsResult,
      chaptersResult,
      questionsResult,
    ] = await Promise.all([
      getSubjects(),
      getChapters(),
      getQuestions(),
    ]);

    if (subjectsResult.error) {
      setError(subjectsResult.error.message);
      setLoading(false);
      return;
    }

    if (chaptersResult.error) {
      setError(chaptersResult.error.message);
      setLoading(false);
      return;
    }

    if (questionsResult.error) {
      setError(questionsResult.error.message);
      setLoading(false);
      return;
    }

    setSubjects(subjectsResult.data ?? []);
    setChapters(chaptersResult.data ?? []);
    setQuestions(questionsResult.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadQuestionBank();
  }, [loadQuestionBank]);

  return {
    subjects,
    chapters,
    questions,
    loading,
    error,
    reload: loadQuestionBank,
  };
}