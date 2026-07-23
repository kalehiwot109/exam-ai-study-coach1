import {
  BookOpen,
  Camera,
  Check,
  Clock,
  Edit3,
  Mail,
  Settings,
  Target,
  Trophy,
  UserCircle,
} from "lucide-react";

import type { OnboardingData } from "../onboarding/Onboarding";
import type { SignUpData } from "../auth/SignUp";
interface ProfileProps {
  onboardingData: OnboardingData;
  user: SignUpData | null;
}
export function Profile({
  onboardingData,
  user,
}: ProfileProps) {
  return (
    <main className="p-4 lg:p-8 max-w-5xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Profile
        </h1>
        <p className="text-sm text-gray-500">
          Manage your personal information and study goals.
        </p>
      </div>

      <div className="space-y-5">
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center">
                <UserCircle
                  className="w-14 h-14 text-blue-600"
                  strokeWidth={1.5}
                />
              </div>

              <button
                type="button"
                aria-label="Change profile picture"
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user?.fullName ?? "Student"}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" strokeWidth={1.75} />
                {user?.email ?? "No email available"}
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Grade 12 student preparing for the Ethiopian
                University Entrance Examination.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              <Edit3 className="w-4 h-4" strokeWidth={2} />
              Edit Profile
            </button>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Target
                className="w-5 h-5 text-blue-600"
                strokeWidth={1.75}
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Study Goals
              </h2>
              <p className="text-sm text-gray-500">
                Your current entrance-exam preparation
                preferences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ProfileField
              icon={BookOpen}
              label="Exam"
              value={onboardingData.exam}
            />

            <ProfileField
              icon={Target}
              label="Target Score"
              value={onboardingData.targetScore.toString()}
            />

            <ProfileField
              icon={Clock}
              label="Daily Study Goal"
              value={`${onboardingData.dailyStudyMinutes} Minutes`}
            />
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Selected Subjects
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Subjects included in your personalized study plan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {onboardingData.subjects.map((subject) => (
              <div
                key={subject}
                className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                <Check className="w-4 h-4" strokeWidth={2.5} />
                {subject}
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ShortcutCard
            icon={Trophy}
            title="Achievements"
            description="View the milestones and badges you have earned."
            buttonLabel="View Achievements"
          />

          <ShortcutCard
            icon={Settings}
            title="Settings"
            description="Manage notifications, appearance, privacy, and account preferences."
            buttonLabel="Open Settings"
          />
        </section>
      </div>
    </main>
  );
}

interface ProfileFieldProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: ProfileFieldProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon
          className="w-4 h-4 text-gray-400"
          strokeWidth={1.75}
        />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </p>
      </div>

      <p className="text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

interface ShortcutCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonLabel: string;
}

function ShortcutCard({
  icon: Icon,
  title,
  description,
  buttonLabel,
}: ShortcutCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
        <Icon
          className="w-5 h-5 text-gray-600"
          strokeWidth={1.75}
        />
      </div>

      <h2 className="text-base font-semibold text-gray-900">
        {title}
      </h2>

      <p className="text-sm text-gray-500 leading-relaxed mt-2 mb-5">
        {description}
      </p>

      <button
        type="button"
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
      >
        {buttonLabel} →
      </button>
    </div>
  );
}