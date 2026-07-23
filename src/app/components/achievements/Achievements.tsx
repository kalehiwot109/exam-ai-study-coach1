import {
  BookOpen,
  Check,
  Flame,
  Lock,
  TrendingUp,
  Trophy,
} from "lucide-react";

interface Milestone {
  label: string;
  unlocked: boolean;
}

const streakMilestones: Milestone[] = [
  { label: "3 Days", unlocked: true },
  { label: "7 Days", unlocked: true },
  { label: "30 Days", unlocked: false },
];

const practiceMilestones: Milestone[] = [
  { label: "First Question", unlocked: true },
  { label: "100 Questions", unlocked: true },
  { label: "500 Questions", unlocked: true },
  { label: "2,000 Questions", unlocked: false },
];

interface YearScore {
  year: number;
  score: number;
}

interface SubjectImprovement {
  subject: string;
  scores: YearScore[];
}

const subjectImprovements: SubjectImprovement[] = [
  {
    subject: "Physics",
    scores: [
      { year: 2023, score: 58 },
      { year: 2024, score: 74 },
    ],
  },
];

function calculateImprovement(scores: YearScore[]) {
  if (scores.length < 2) {
    return 0;
  }

  const previousScore = scores[scores.length - 2].score;
  const latestScore = scores[scores.length - 1].score;

  return latestScore - previousScore;
}

function getImprovementMilestone(improvement: number) {
  if (improvement >= 20) {
    return {
      title: "Big Leap",
      description:
        "You improved your score by at least 20 percentage points.",
      unlocked: true,
    };
  }

  if (improvement >= 10) {
    return {
      title: "On the Rise",
      description:
        "You improved your score by at least 10 percentage points.",
      unlocked: true,
    };
  }

  return {
    title: "Keep Growing",
    description:
      "Improve by at least 10 percentage points to unlock your next milestone.",
    unlocked: false,
  };
}

export function Achievements() {
  const unlockedStreakAchievements = streakMilestones.filter(
    (milestone) => milestone.unlocked,
  ).length;

  const unlockedPracticeAchievements =
    practiceMilestones.filter(
      (milestone) => milestone.unlocked,
    ).length;

  const unlockedImprovementAchievements =
    subjectImprovements.filter((subject) => {
      const improvement = calculateImprovement(subject.scores);
      return improvement >= 10;
    }).length;

  const totalUnlocked =
    unlockedStreakAchievements +
    unlockedPracticeAchievements +
    unlockedImprovementAchievements;

  return (
    <main className="p-4 lg:p-8 max-w-6xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Achievements
        </h1>

        <p className="text-sm text-gray-500">
          Celebrate your progress and see the next milestone you
          are working toward.
        </p>
      </div>

      {/* Achievement Summary */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
            <Trophy
              className="w-7 h-7 text-yellow-600"
              strokeWidth={1.75}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Achievements Unlocked
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-1">
              {totalUnlocked}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Keep practicing and improving your exam scores to
              unlock more milestones.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Study Streak */}
        <AchievementProgressCard
          icon={Flame}
          iconBackground="bg-orange-50"
          iconColor="text-orange-600"
          title="Study Streak"
          mainValue="17 Days"
          description="Study consistently to build a strong daily habit."
          current={17}
          target={30}
          progressLabel="17 / 30 days"
          nextMilestone="30-Day Streak"
          milestones={streakMilestones}
        />

        {/* Practice Questions */}
        <AchievementProgressCard
          icon={BookOpen}
          iconBackground="bg-blue-50"
          iconColor="text-blue-600"
          title="Practice Questions"
          mainValue="1,248 Questions"
          description="Build confidence by completing more entrance-exam questions."
          current={1248}
          target={2000}
          progressLabel="1,248 / 2,000 questions"
          nextMilestone="Question Champion"
          milestones={practiceMilestones}
        />
      </div>

      {/* Year-over-Year Improvement */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mt-5">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp
              className="w-5 h-5 text-green-600"
              strokeWidth={1.75}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Score Growth Milestones
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Complete the same subject from different exam
              years to unlock score-improvement milestones.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {subjectImprovements.map((subject) => (
            <SubjectImprovementCard
              key={subject.subject}
              subject={subject}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

interface AchievementProgressCardProps {
  icon: React.ElementType;
  iconBackground: string;
  iconColor: string;
  title: string;
  mainValue: string;
  description: string;
  current: number;
  target: number;
  progressLabel: string;
  nextMilestone: string;
  milestones: Milestone[];
}

function AchievementProgressCard({
  icon: Icon,
  iconBackground,
  iconColor,
  title,
  mainValue,
  description,
  current,
  target,
  progressLabel,
  nextMilestone,
  milestones,
}: AchievementProgressCardProps) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBackground}`}
        >
          <Icon
            className={`w-5 h-5 ${iconColor}`}
            strokeWidth={1.75}
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>

      <p className="text-3xl font-bold text-gray-900">
        {mainValue}
      </p>

      <div className="mt-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Unlocked
        </p>

        <div className="flex flex-wrap gap-2">
          {milestones
            .filter((milestone) => milestone.unlocked)
            .map((milestone) => (
              <span
                key={milestone.label}
                className="flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold"
              >
                <Check
                  className="w-3.5 h-3.5"
                  strokeWidth={2.5}
                />
                {milestone.label}
              </span>
            ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Next Milestone
            </p>

            <p className="text-sm font-semibold text-gray-900 mt-1">
              {nextMilestone}
            </p>
          </div>

          <Lock
            className="w-4 h-4 text-gray-400"
            strokeWidth={1.75}
          />
        </div>

        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs font-semibold text-gray-500 mt-2">
          {progressLabel}
        </p>
      </div>
    </section>
  );
}

function SubjectImprovementCard({
  subject,
}: {
  subject: SubjectImprovement;
}) {
  const improvement = calculateImprovement(subject.scores);
  const milestone = getImprovementMilestone(improvement);

  const previousScore =
    subject.scores[subject.scores.length - 2];
  const latestScore = subject.scores[subject.scores.length - 1];

  return (
    <article
      className={`border rounded-xl p-5 ${
        milestone.unlocked
          ? "border-green-200 bg-green-50/40"
          : "border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Subject
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-1">
            {subject.subject}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <ScoreBox
            year={previousScore.year}
            score={previousScore.score}
          />

          <span className="text-gray-400 font-semibold">→</span>

          <ScoreBox
            year={latestScore.year}
            score={latestScore.score}
          />
        </div>

        <div className="md:text-right">
          <p
            className={`text-2xl font-bold ${
              improvement > 0
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {improvement > 0 ? "+" : ""}
            {improvement}%
          </p>

          <p className="text-xs text-gray-500">
            score improvement
          </p>
        </div>
      </div>

      <div
        className={`flex items-start gap-3 mt-5 rounded-xl p-4 ${
          milestone.unlocked
            ? "bg-white border border-green-100"
            : "bg-gray-50"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            milestone.unlocked ? "bg-green-100" : "bg-gray-200"
          }`}
        >
          {milestone.unlocked ? (
            <Trophy
              className="w-4 h-4 text-green-700"
              strokeWidth={1.75}
            />
          ) : (
            <Lock
              className="w-4 h-4 text-gray-500"
              strokeWidth={1.75}
            />
          )}
        </div>

        <div>
          <p className="text-sm font-bold text-gray-900">
            {milestone.unlocked
              ? `${milestone.title} Unlocked`
              : milestone.title}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {milestone.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function ScoreBox({
  year,
  score,
}: {
  year: number;
  score: number;
}) {
  return (
    <div className="border border-gray-200 bg-white rounded-xl px-4 py-3 text-center min-w-24">
      <p className="text-xs font-semibold text-gray-400">
        {year}
      </p>

      <p className="text-lg font-bold text-gray-900 mt-1">
        {score}%
      </p>
    </div>
  );
}