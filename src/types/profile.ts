export interface CurrentUser {
    id: string;
    email: string;
    fullName: string;
  }
  
  export interface ProfileRow {
    exam: string | null;
    target_score: number | null;
    daily_study_minutes: number | null;
    selected_subjects: string[] | null;
  }