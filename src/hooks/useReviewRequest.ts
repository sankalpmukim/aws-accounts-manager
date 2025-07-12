import { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { REVIEW_STORAGE_KEY, type ReviewRequestData } from "~features/storage";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function useReviewRequest(): boolean {
  const [shouldShowReview, setShouldShowReview] = useState(false);
  const [loadTimeHasPassed, setLoadTimeHasPassed] = useState(false);
  const [reviewData, setReviewData] = useStorage<ReviewRequestData>(
    REVIEW_STORAGE_KEY,
    {
      firstInstallDate: null,
      lastReviewPromptDate: null,
      reviewPreference: "pending",
    },
  );

  // Wait for storage to hydrate before executing review logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadTimeHasPassed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only execute review logic after load time has passed
    if (!loadTimeHasPassed) {
      return;
    }

    const checkReviewRequest = () => {
      const now = new Date().getTime();

      // Initialize first install date if not set
      if (!reviewData.firstInstallDate) {
        setReviewData((prev) => ({
          ...prev,
          firstInstallDate: new Date().toISOString(),
        }));
        return;
      }

      // Don't show if user chose "never"
      if (reviewData.reviewPreference === "never") {
        setShouldShowReview(false);
        return;
      }

      const firstInstallTime = new Date(reviewData.firstInstallDate).getTime();
      const hasUsedForOneWeek = now - firstInstallTime >= ONE_WEEK_MS;

      // Don't show if user hasn't used for at least one week
      if (!hasUsedForOneWeek) {
        setShouldShowReview(false);
        return;
      }

      // If user chose "later", check if a week has passed since last prompt
      if (
        reviewData.reviewPreference === "later" &&
        reviewData.lastReviewPromptDate
      ) {
        const lastPromptTime = new Date(
          reviewData.lastReviewPromptDate,
        ).getTime();
        const weekSinceLastPrompt = now - lastPromptTime >= ONE_WEEK_MS;

        if (!weekSinceLastPrompt) {
          setShouldShowReview(false);
          return;
        }
      }

      // Show review request
      setShouldShowReview(true);
    };

    checkReviewRequest();
  }, [reviewData, loadTimeHasPassed]);

  return shouldShowReview;
}
