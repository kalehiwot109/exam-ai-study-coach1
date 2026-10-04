import { supabase } from "../lib/supabase";
import type { ProfileRow } from "../types/profile";
import type { OnboardingData } from "../app/components/onboarding/Onboarding";

export async function getProfile(userId: string) {
  return supabase
    .from("profiles")
    .select(
      "exam, target_score, daily_study_minutes, selected_subjects",
    )
    .eq("id", userId)
    .single<ProfileRow>();
}

export async function saveOnboardingData(
  userId: string,
  onboardingData: OnboardingData,
) {
  return supabase
    .from("profiles")
    .update({
      exam: onboardingData.exam,
      target_score: onboardingData.targetScore,
      daily_study_minutes:
        onboardingData.dailyStudyMinutes,
      selected_subjects: onboardingData.subjects,
    })
    .eq("id", userId);
}

export function profileToOnboardingData(
  profile: ProfileRow,
): OnboardingData | null {
  const profileIsComplete =
    Boolean(profile.exam) &&
    profile.target_score !== null &&
    profile.daily_study_minutes !== null &&
    Array.isArray(profile.selected_subjects) &&
    profile.selected_subjects.length > 0;

  if (!profileIsComplete) {
    return null;
  }

  return {
    exam: profile.exam as string,
    targetScore: profile.target_score as number,
    dailyStudyMinutes:
      profile.daily_study_minutes as number,
    subjects: profile.selected_subjects as string[],
  };
}