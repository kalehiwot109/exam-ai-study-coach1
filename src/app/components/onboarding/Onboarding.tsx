import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
];

export interface OnboardingData {
  exam: string;
  subjects: string[];
  targetScore: number;
  dailyStudyMinutes: number;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const [exam, setExam] = useState(
    "Ethiopian University Entrance Examination",
  );

  const [selectedSubjects, setSelectedSubjects] = useState<
    string[]
  >(["Mathematics", "Physics"]);

  const [targetScore, setTargetScore] = useState(650);
  const [dailyStudyMinutes, setDailyStudyMinutes] =
    useState(60);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

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

  function goNext() {
    if (currentStep < totalSteps) {
      setCurrentStep((step) => step + 1);
    }
  }

  function goBack() {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  }

  function finishOnboarding() {
    onComplete({
      exam,
      subjects: selectedSubjects,
      targetScore,
      dailyStudyMinutes,
    });
  }

  const canContinue =
    currentStep !== 3 || selectedSubjects.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-5 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>

          <span className="text-xl font-bold text-gray-900">
            StudyStreak
          </span>
        </div>
      </header>

      <div className="w-full max-w-3xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">
            Step {currentStep} of {totalSteps}
          </p>

          <p className="text-sm text-gray-500">
            {Math.round(progress)}% complete
          </p>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 lg:p-10">
          {currentStep === 1 && <WelcomeStep />}

          {currentStep === 2 && (
            <ExamStep exam={exam} onSelectExam={setExam} />
          )}

          {currentStep === 3 && (
            <SubjectsStep
              selectedSubjects={selectedSubjects}
              onToggleSubject={toggleSubject}
            />
          )}

          {currentStep === 4 && (
            <TargetScoreStep
              targetScore={targetScore}
              onChangeTargetScore={setTargetScore}
            />
          )}

          {currentStep === 5 && (
            <DailyGoalStep
              selectedMinutes={dailyStudyMinutes}
              onSelectMinutes={setDailyStudyMinutes}
            />
          )}

          {currentStep === 6 && (
            <CompletionStep
              subjectCount={selectedSubjects.length}
              targetScore={targetScore}
              dailyStudyMinutes={dailyStudyMinutes}
            />
          )}

          <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
            {currentStep > 1 && currentStep < 6 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 1 ? "Get Started" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finishOnboarding}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                Go to Mission Control
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Sparkles
          className="w-10 h-10 text-blue-600"
          strokeWidth={1.6}
        />
      </div>

      <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
        Welcome to StudyStreak
      </p>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Let’s create your study plan
      </h1>

      <p className="text-base text-gray-500 leading-relaxed max-w-xl mx-auto mt-4">
        Tell us about your exam, subjects, and goals.
        StudyStreak will use your answers to personalize your
        daily missions.
      </p>
    </div>
  );
}

interface ExamStepProps {
  exam: string;
  onSelectExam: (exam: string) => void;
}

function ExamStep({ exam, onSelectExam }: ExamStepProps) {
  const examName = "Ethiopian University Entrance Examination";

  const selected = exam === examName;

  return (
    <div>
      <StepHeading
        icon={GraduationCap}
        label="Your exam"
        title="Which exam are you preparing for?"
        description="Your study plan and question recommendations will be based on this exam."
      />

      <button
        type="button"
        onClick={() => onSelectExam(examName)}
        className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${
          selected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-200"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            selected ? "bg-blue-600" : "bg-gray-100"
          }`}
        >
          <GraduationCap
            className={`w-6 h-6 ${
              selected ? "text-white" : "text-gray-500"
            }`}
          />
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            Ethiopian University Entrance Examination
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Grade 12 national university entrance examination
          </p>
        </div>

        {selected && (
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </button>
    </div>
  );
}

interface SubjectsStepProps {
  selectedSubjects: string[];
  onToggleSubject: (subject: string) => void;
}

function SubjectsStep({
  selectedSubjects,
  onToggleSubject,
}: SubjectsStepProps) {
  return (
    <div>
      <StepHeading
        icon={BookOpen}
        label="Your subjects"
        title="Which subjects are you studying?"
        description="Choose at least one subject. You can change your selection later."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subjects.map((subject) => {
          const selected = selectedSubjects.includes(subject);

          return (
            <button
              type="button"
              key={subject}
              onClick={() => onToggleSubject(subject)}
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
                    : "border-gray-300 bg-white"
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
                  selected ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {subject}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {selectedSubjects.length} subject
        {selectedSubjects.length === 1 ? "" : "s"} selected
      </p>
    </div>
  );
}

interface TargetScoreStepProps {
  targetScore: number;
  onChangeTargetScore: (score: number) => void;
}

function TargetScoreStep({
  targetScore,
  onChangeTargetScore,
}: TargetScoreStepProps) {
  return (
    <div>
      <StepHeading
        icon={Target}
        label="Your goal"
        title="What is your target exam score?"
        description="We’ll use this target to measure your readiness and recommend the most important topics."
      />

      <div className="max-w-md mx-auto text-center">
        <label
          htmlFor="target-score"
          className="text-sm font-semibold text-gray-600"
        >
          Target score
        </label>

        <div className="relative mt-3">
          <input
            id="target-score"
            type="number"
            min={100}
            max={700}
            value={targetScore}
            onChange={(event) =>
              onChangeTargetScore(Number(event.target.value))
            }
            className="w-full border border-gray-300 rounded-2xl px-5 py-5 text-center text-4xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>

        <p className="text-sm text-gray-500 mt-4">
          You can adjust this goal later from your profile.
        </p>
      </div>
    </div>
  );
}

interface DailyGoalStepProps {
  selectedMinutes: number;
  onSelectMinutes: (minutes: number) => void;
}

function DailyGoalStep({
  selectedMinutes,
  onSelectMinutes,
}: DailyGoalStepProps) {
  return (
    <div>
      <StepHeading
        icon={Clock}
        label="Daily commitment"
        title="How long would you like to study each day?"
        description="Choose a realistic daily goal. You can enter any amount of time that fits your schedule."
      />

      <div className="max-w-md mx-auto">
        <label
          htmlFor="daily-goal"
          className="text-sm font-semibold text-gray-600"
        >
          Daily study time (minutes)
        </label>

        <input
          id="daily-goal"
          type="number"
          min={5}
          max={600}
          value={selectedMinutes}
          onChange={(e) =>
            onSelectMinutes(Number(e.target.value))
          }
          className="w-full mt-3 border border-gray-300 rounded-2xl px-5 py-5 text-center text-4xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />

        <p className="text-sm text-gray-500 mt-4 text-center">
          Example: 30, 45, 60, 90, or any number of minutes you
          prefer.
        </p>
      </div>
    </div>
  );
}

interface CompletionStepProps {
  subjectCount: number;
  targetScore: number;
  dailyStudyMinutes: number;
}

function CompletionStep({
  subjectCount,
  targetScore,
  dailyStudyMinutes,
}: CompletionStepProps) {
  return (
    <div className="text-center py-3">
      <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Check
          className="w-10 h-10 text-green-600"
          strokeWidth={2}
        />
      </div>

      <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">
        You’re all set
      </p>

      <h1 className="text-3xl font-bold text-gray-900">
        Your study plan is ready
      </h1>

      <p className="text-base text-gray-500 mt-4 max-w-lg mx-auto">
        StudyStreak will create personalized daily missions
        using your selected subjects, target score, and study
        time.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 text-left">
        <SummaryItem
          label="Subjects"
          value={`${subjectCount} selected`}
        />

        <SummaryItem
          label="Target score"
          value={targetScore.toString()}
        />

        <SummaryItem
          label="Daily goal"
          value={`${dailyStudyMinutes} minutes`}
        />
      </div>
    </div>
  );
}

interface StepHeadingProps {
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
}

function StepHeading({
  icon: Icon,
  label,
  title,
  description,
}: StepHeadingProps) {
  return (
    <div className="mb-8">
      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
        <Icon
          className="w-5 h-5 text-blue-600"
          strokeWidth={1.75}
        />
      </div>

      <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
        {label}
      </p>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
        {title}
      </h1>

      <p className="text-sm text-gray-500 leading-relaxed mt-3 max-w-xl">
        {description}
      </p>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>

      <p className="text-sm font-bold text-gray-900 mt-2">
        {value}
      </p>
    </div>
  );
}