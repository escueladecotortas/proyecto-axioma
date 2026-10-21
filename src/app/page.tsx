// Archivo: src/app/page.tsx
"use client";

import React, { useState } from "react";
import { PrologueScene } from "@/components/PrologueScene";
import { BiometricSensor } from "@/components/BiometricSensor";
import { DramaticLatency } from "@/components/telemetry/DramaticLatency";
import { TacticalVerdict } from "@/components/telemetry/TacticalVerdict";
import { PaywallGate } from "@/components/telemetry/PaywallGate";
import { useTelemetryStore } from "@/store/useTelemetryStore";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<"PROLOGUE" | "SENSOR" | "PAYWALL">("PROLOGUE");
  const stage = useTelemetryStore((s) => s.stage);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-transparent to-transparent pointer-events-none" />

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        {activeScreen === "PROLOGUE" && (
          <PrologueScene onComplete={() => setActiveScreen("SENSOR")} />
        )}

        {activeScreen === "SENSOR" && (
          <>
            {stage !== "DRAMATIC_COMPUTATION" && stage !== "COMPLETED" && (
              <BiometricSensor />
            )}

            {stage === "DRAMATIC_COMPUTATION" && (
              <DramaticLatency />
            )}

            {stage === "COMPLETED" && (
              <TacticalVerdict onUnlockDossier={() => setActiveScreen("PAYWALL")} />
            )}
          </>
        )}

        {activeScreen === "PAYWALL" && (
          <PaywallGate onBackToVerdict={() => setActiveScreen("SENSOR")} />
        )}
      </div>
    </main>
  );
}
