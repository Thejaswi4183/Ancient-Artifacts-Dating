"use client";

import AuthTabs from "@/components/AuthTabs";
import PageWrapper from "@/components/PageWrapper";

export default function AuthPage() {
  return (
    <PageWrapper>
      <div className="auth-wrapper">
        <h1 className="auth-header">🏺 Ancient Artifact Age Predictor</h1>
        <p className="auth-subtext">
          Unlock history by logging in to analyze and date ancient relics.
        </p>
        <AuthTabs />
      </div>
    </PageWrapper>
  );
}
