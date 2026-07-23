import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export interface LoginData {
  email: string;
  password: string;
}

interface LoginProps {
  onLogin: (data: LoginData) => void;
  onGoToSignUp: () => void;
  onGoToForgotPassword: () => void;
  error?: string;
}

export function Login({
  onLogin,
  onGoToSignUp,
  onGoToForgotPassword,
  error,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    onLogin({
      email: email.trim(),
      password,
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LockKeyhole className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Log in to continue your StudyStreak journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={onGoToForgotPassword}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-12 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors active:scale-[0.98]"
            >
              Log In
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onGoToSignUp}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}