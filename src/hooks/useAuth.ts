import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import {
  getSession,
  onAuthStateChange,
  signIn,
  signOut,
  signUp,
} from "../services/auth";

import {
  getProfile,
  profileToOnboardingData,
  saveOnboardingData,
} from "../services/profile";

import type { CurrentUser } from "../types/profile";
import type { OnboardingData } from "../app/components/onboarding/Onboarding";

function createCurrentUser(user: User): CurrentUser {
  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : "Student",
  };
}

export function useAuth() {
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [onboardingData, setOnboardingData] =
    useState<OnboardingData | null>(null);

  const [loading, setLoading] = useState(true);

  async function loadUserFromSession(session: Session) {
    setCurrentUser(createCurrentUser(session.user));

    const { data: profile, error } = await getProfile(
      session.user.id,
    );

    if (error) {
      console.error(
        "Failed to load profile:",
        error.message,
      );

      setOnboardingData(null);
      return;
    }

    setOnboardingData(
      profileToOnboardingData(profile),
    );
  }

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const {
        data: { session },
        error,
      } = await getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error(
          "Failed to restore session:",
          error.message,
        );
      }

      if (session) {
        await loadUserFromSession(session);
      } else {
        setCurrentUser(null);
        setOnboardingData(null);
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    void restoreSession();

    const {
      data: { subscription },
    } = onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      if (!session) {
        setCurrentUser(null);
        setOnboardingData(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      window.setTimeout(() => {
        void loadUserFromSession(session).finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function createAccount(
    email: string,
    password: string,
    fullName: string,
  ) {
    return signUp(email, password, fullName);
  }

  async function login(
    email: string,
    password: string,
  ) {
    return signIn(email, password);
  }

  async function logout() {
    const result = await signOut();

    if (!result.error) {
      setCurrentUser(null);
      setOnboardingData(null);
    }

    return result;
  }

  async function completeOnboarding(
    data: OnboardingData,
  ) {
    if (!currentUser) {
      return {
        error: new Error(
          "No authenticated user was found.",
        ),
      };
    }

    const result = await saveOnboardingData(
      currentUser.id,
      data,
    );

    if (!result.error) {
      setOnboardingData(data);
    }

    return result;
  }

  return {
    currentUser,
    onboardingData,
    loading,
    createAccount,
    login,
    logout,
    completeOnboarding,
  };
}