import { useState } from "react";
import type { Theme } from "../../../App";
import {
  Bell,
  Check,
  Clock,
  Download,
  Globe2,
  Lock,
  Moon,
  Save,
  Sun,
  Trash2,
  User,
  Monitor,
} from "lucide-react";
import type { OnboardingData } from "../onboarding/Onboarding";

interface SettingsProps {
  onboardingData: OnboardingData;
  onUpdateOnboardingData: (data: OnboardingData) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const availableSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
];

type LanguageOption = "English" | "Amharic";

export function Settings({
  onboardingData,
  onUpdateOnboardingData,
  theme,
  onThemeChange,
}: SettingsProps) {
  const [name, setName] = useState("Kalehiwot Amare");
  const [email, setEmail] = useState("kalehiwot@example.com");

  const [targetScore, setTargetScore] = useState(
    onboardingData.targetScore,
  );

  const [dailyStudyMinutes, setDailyStudyMinutes] = useState(
    onboardingData.dailyStudyMinutes,
  );

  const [selectedSubjects, setSelectedSubjects] = useState<
    string[]
  >(onboardingData.subjects);

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");

  const [language, setLanguage] =
    useState<LanguageOption>("English");

  const [saved, setSaved] = useState(false);

  function toggleSubject(subject: string) {
    setSelectedSubjects((currentSubjects) => {
      if (currentSubjects.includes(subject)) {
        return currentSubjects.filter(
          (item) => item !== subject,
        );
      }

      return [...currentSubjects, subject];
    });
  }

  function saveSettings() {
    onUpdateOnboardingData({
      ...onboardingData,
      targetScore,
      dailyStudyMinutes,
      subjects: selectedSubjects,
    });

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <main className="p-4 lg:p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Settings
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account, study preferences, reminder,
            and app experience.
          </p>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="space-y-5">
        <SettingsSection
          icon={User}
          title="Account"
          description="Manage your personal information."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name">
              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 focus:border-blue-500 transition-colors"
              />
            </FormField>

            <FormField label="Email Address">
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 focus:border-blue-500 transition-colors"
              />
            </FormField>
          </div>

          <button
            type="button"
            className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Change Password
          </button>
        </SettingsSection>

        <SettingsSection
          icon={Clock}
          title="Study Preferences"
          description="Update the goals used to personalize your study plan."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Target Score">
              <input
                type="number"
                min={100}
                max={700}
                value={targetScore}
                onChange={(event) =>
                  setTargetScore(Number(event.target.value))
                }
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 focus:border-blue-500 transition-colors"
              />
            </FormField>

            <FormField label="Daily Study Goal (minutes)">
              <input
                type="number"
                min={5}
                max={600}
                value={dailyStudyMinutes}
                onChange={(event) =>
                  setDailyStudyMinutes(
                    Number(event.target.value),
                  )
                }
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 focus:border-blue-500 transition-colors"
              />
            </FormField>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Subjects
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableSubjects.map((subject) => {
                const selected =
                  selectedSubjects.includes(subject);

                return (
                  <button
                    type="button"
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md border flex items-center justify-center ${
                        selected
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {selected && (
                        <Check
                          className="w-4 h-4 text-white"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>

                    <span
                      className={`text-sm font-semibold ${
                        selected
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {subject}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Bell}
          title="Daily Mission Reminder"
          description="Choose whether StudyStreak should remind you to complete your daily mission."
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Enable daily reminder
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Receive one reminder each day at your chosen
                time.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={reminderEnabled}
              onClick={() =>
                setReminderEnabled((enabled) => !enabled)
              }
              className={`relative w-12 h-7 rounded-full transition-colors ${
                reminderEnabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  reminderEnabled
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {reminderEnabled && (
            <div className="mt-4 max-w-sm">
              <FormField label="Reminder Time">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(event) =>
                    setReminderTime(event.target.value)
                  }
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 focus:border-blue-500 transition-colors"
                />
              </FormField>
            </div>
          )}
        </SettingsSection>

        <SettingsSection
          icon={Monitor}
          title="Appearance"
          description="Choose how StudyStreak should look."
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AppearanceCard
              icon={Monitor}
              label="System"
              selected={theme === "system"}
              onClick={() => onThemeChange("system")}
            />

            <AppearanceCard
              icon={Sun}
              label="Light"
              selected={theme === "light"}
              onClick={() => onThemeChange("light")}
            />

            <AppearanceCard
              icon={Moon}
              label="Dark"
              selected={theme === "dark"}
              onClick={() => onThemeChange("dark")}
            />
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            System follows your device’s appearance setting.
          </p>
        </SettingsSection>

        <SettingsSection
          icon={Globe2}
          title="Language"
          description="Choose your preferred app language."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["English", "Amharic"] as LanguageOption[]).map(
              (option) => {
                const selected = language === option;

                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setLanguage(option)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        selected
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </span>

                    {selected && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                );
              },
            )}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Amharic translation can be connected after the main
            product is complete.
          </p>
        </SettingsSection>

        <SettingsSection
          icon={Lock}
          title="Privacy & Account"
          description="Manage your study data and account."
        >
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-500" />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Export Study Data
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Download a copy of your progress and
                    activity.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 border border-red-200 bg-red-50/40 rounded-xl p-4 text-left hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-600" />

                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Delete Account
                  </p>

                  <p className="text-sm text-red-600/80 mt-1">
                    Permanently remove your account and study
                    data.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </SettingsSection>
      </div>
    </main>
  );
}

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 transition-colors">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">
          <Icon
            className="w-5 h-5 text-blue-600"
            strokeWidth={1.75}
          />
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </span>

      {children}
    </label>
  );
}

interface AppearanceCardProps {
  icon: React.ElementType;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function AppearanceCard({
  icon: Icon,
  label,
  selected,
  onClick,
}: AppearanceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 hover:border-blue-200 dark:hover:border-blue-700"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${
          selected
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400"
        }`}
      />

      <span
        className={`text-sm font-semibold ${
          selected
            ? "text-blue-700 dark:text-blue-300"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {label}
      </span>

      {selected && (
        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto" />
      )}
    </button>
  );
}