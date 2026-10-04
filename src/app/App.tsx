import { useEffect, useState } from "react";
import {
  Sidebar,
  type Page,
} from "./components/dashboard/Sidebar";
import { Header } from "./components/dashboard/Header";
import {
  Onboarding,
  type OnboardingData,
} from "./components/onboarding/Onboarding";
import { useAuth } from "../hooks/useAuth";
import { Achievements } from "./components/achievements/Achievements";
import { MetricCard } from "./components/dashboard/MetricCard";
import { AnalyticsChart } from "./components/dashboard/AnalyticsChart";
import { RecentActivity } from "./components/dashboard/RecentActivity";
import { RevenueChart } from "./components/dashboard/RevenueChart";
import { Practice } from "./components/practice/Practice";
import { QuestionBank } from "./components/questionbank/QuestionBank";
import { Analytics } from "./components/analytics/Analytics";
import { Profile } from "./components/profile/Profile";
import { StudyCoach } from "./components/studycoach/StudyCoach";
import { Settings } from "./components/settings/Settings";
import { Login, type LoginData } from "./components/auth/Login";
import { SignUp } from "./components/auth/SignUp";
import { ForgotPassword } from "./components/auth/ForgotPassword";

import {
  BookOpen,
  Clock,
  Award,
  Flame,
  TrendingUp,
  Play,
  Zap,
} from "lucide-react";

const metrics = [
  {
    title: "Study Streak",
    value: "17 Days",
    change: "+3 days",
    trend: "up" as const,
    icon: Flame,
    color: "blue" as const,
  },
  {
    title: "Questions Solved",
    value: "1,248",
    change: "+34 today",
    trend: "up" as const,
    icon: BookOpen,
    color: "green" as const,
  },
  {
    title: "Today's Progress",
    value: "68%",
    change: "Mission completion",
    trend: "up" as const,
    icon: Award,
    color: "purple" as const,
  },
  {
    title: "Overall Accuracy",
    value: "82%",
    change: "+2.1%",
    trend: "up" as const,
    icon: Clock,
    color: "orange" as const,
  },
];
export type Theme = "system" | "light" | "dark";
type AuthScreen =
  | "onboarding"
  | "signup"
  | "login"
  | "forgot"
  | "app";

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(
      "studystreak-theme",
    );

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      return savedTheme;
    }

    return "system";
  });

  const {
    currentUser,
    onboardingData,
    loading: authLoading,
    createAccount,
    login,
    logout,
    completeOnboarding,
  } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [authScreen, setAuthScreen] = useState<AuthScreen>(() => {
    const hasStartedStudyStreak =
      localStorage.getItem("studystreak-has-started") === "true";

    return hasStartedStudyStreak ? "login" : "onboarding";
  });

  const [activePage, setActivePage] = useState<Page>(
    "mission-control",
  );

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    function applyTheme() {
      const shouldUseDarkMode =
        theme === "dark" ||
        (theme === "system" && systemTheme.matches);

      root.classList.toggle("dark", shouldUseDarkMode);
    }

    applyTheme();
    localStorage.setItem("studystreak-theme", theme);

    systemTheme.addEventListener("change", applyTheme);

    return () => {
      systemTheme.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (currentUser) {
      setAuthScreen("app");
      return;
    }

    if (authScreen === "app") {
      setAuthScreen("login");
    }
  }, [authLoading, currentUser, authScreen]);

  async function handleLogout() {
    const { error } = await logout();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    setAuthScreen("login");
  }

  function handleNavigate(page: Page) {
    setActivePage(page);
    setSidebarOpen(false);
  }
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading StudyStreak...</p>
      </div>
    );
  }
  
  if (authScreen === "onboarding") {
    return (
      <Onboarding
        onComplete={() => {
          localStorage.setItem(
            "studystreak-has-started",
            "true",
          );
  
          setAuthScreen("signup");
        }}
      />
    );
  }

  if (authScreen === "signup") {
    return (
      <SignUp
        onSignUp={async (data) => {
          const { data: signUpResult, error } = await createAccount(
            data.email,
            data.password,
            data.fullName,
          );

          if (error) {
            alert(error.message);
            return;
          }
  
          if (signUpResult.session) {
            await logout();
          }

          alert("Account created successfully. Please log in.");
          setAuthScreen("login");
        }}
        onGoToLogin={() => setAuthScreen("login")}
      />
    );
  }

  if (authScreen === "login") {
    return (
      <Login
        error={loginError}
        onLogin={async (data: LoginData) => {
          setLoginError("");
  
          const { error } = await login(
            data.email,
            data.password,
          );
  
          if (error) {
            setLoginError(error.message);
            return;
          }
  
        }}
        onGoToSignUp={() => {
          setLoginError("");
          setAuthScreen("signup");
        }}
        onGoToForgotPassword={() => {
          setLoginError("");
          setAuthScreen("forgot");
        }}
      />
    );
  }

  if (authScreen === "forgot") {
    return (
      <ForgotPassword
        onBackToLogin={() => setAuthScreen("login")}
      />
    );
  }

  if (!onboardingData) {
    return (
      <Onboarding
        onComplete={async (data) => {
          const { error } = await completeOnboarding(data);

          if (error) {
            console.error(
              "Failed to save onboarding data:",
              error.message,
            );
            return;
          }

          setAuthScreen("app");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <div className="lg:pl-64">
        {/* Hide header during Practice to keep it distraction-free */}
        {activePage !== "practice" && (
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onLogout={handleLogout}
            userName={currentUser?.fullName ?? "Student"}
            userEmail={currentUser?.email ?? ""}
          />
        )}

        {activePage === "mission-control" && (
          <main className="p-4 lg:p-8 max-w-7xl">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Mission Control
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back, {currentUser?.fullName ?? "Student"}.
                Here's your plan for today.
              </p>
            </div>

            {/* Today's Mission Hero Card */}
            <div
              className="w-full mb-6 rounded-2xl overflow-hidden border border-blue-100"
              style={{
                background:
                  "linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #3b82f6 100%)",
              }}
            >
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                      Good Afternoon
                    </p>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                      {currentUser?.fullName?.split(" ")[0] ??
                        "Student"}{" "}
                      👋
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 self-start sm:self-auto">
                    <Flame className="w-5 h-5 text-orange-300" />
                    <span className="text-white font-semibold text-sm">
                      17 Day Streak
                    </span>
                  </div>
                </div>

                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-4">
                  Today's Mission
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      icon: BookOpen,
                      label: "Subject",
                      value: "Physics",
                    },
                    {
                      icon: Zap,
                      label: "Task",
                      value: "Complete 20 Questions",
                    },
                    {
                      icon: Clock,
                      label: "Est. Study Time",
                      value: "35 Minutes",
                    },
                    {
                      icon: TrendingUp,
                      label: "Score Improvement",
                      value: "+2.3%",
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-white/10 rounded-xl p-4 border border-white/15"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          className="w-4 h-4 text-blue-200"
                          strokeWidth={1.75}
                        />
                        <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">
                          {label}
                        </p>
                      </div>
                      <p className="text-white text-lg font-bold">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActivePage("practice")}
                  className="flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 active:scale-95 transition-all duration-150"
                >
                  <Play className="w-5 h-5 fill-blue-700" />
                  Start Mission
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            {/* Subject Performance + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <AnalyticsChart />
              <RevenueChart />
            </div>

            {/* Study Coach + Question Bank */}
            <RecentActivity />
          </main>
        )}

        {activePage === "practice" && (
          <Practice
            onExit={() => setActivePage("mission-control")}
          />
        )}

        {activePage === "question-bank" && <QuestionBank />}
        {activePage === "analytics" && <Analytics />}
        {activePage === "study-coach" && <StudyCoach />}
        {activePage === "achievements" && <Achievements />}
        {activePage === "profile" && (
          <Profile
            onboardingData={onboardingData}
            userName={currentUser?.fullName ?? "Student"}
            userEmail={currentUser?.email ?? ""}
          />
        )}
        {activePage === "settings" && (
          <Settings
            onboardingData={onboardingData}
            onUpdateOnboardingData={(data) => {
              void completeOnboarding(data).then(({ error }) => {
                if (error) {
                  console.error(
                    "Failed to update study preferences:",
                    error.message,
                  );
                }
              });
            }}
            theme={theme}
            onThemeChange={setTheme}
          />
        )}

        {activePage !== "mission-control" &&
          activePage !== "practice" &&
          activePage !== "question-bank" &&
          activePage !== "analytics" &&
          activePage !== "study-coach" &&
          activePage !== "achievements" &&
          activePage !== "profile" &&
          activePage !== "settings" && (
            <main className="p-4 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                  {activePage.replace(/-/g, " ")}
                </p>
                <p className="text-sm text-gray-400">
                  Coming soon.
                </p>
              </div>
            </main>
          )}
      </div>
    </div>
  );
}