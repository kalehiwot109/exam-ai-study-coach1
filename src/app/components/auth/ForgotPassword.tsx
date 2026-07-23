import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({
  onBackToLogin,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Check your email
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            If an account exists for <strong>{email}</strong>,
            we'll send you a password reset link.
          </p>

          <button
            onClick={onBackToLogin}
            className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <button
          onClick={onBackToLogin}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Enter your email and we'll send you a password reset
          link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </main>
  );
}