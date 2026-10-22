// Archivo: src/app/page.tsx
"use client";

import React, { useState } from "react";
import { PrologueScene } from "@/components/PrologueScene";
import { BiometricSensor } from "@/components/telemetry/BiometricSensor";
import { DramaticLatency } from "@/components/telemetry/DramaticLatency";
import { TacticalVerdict } from "@/components/telemetry/TacticalVerdict";
import { PaywallGate } from "@/components/telemetry/PaywallGate";
import { useTelemetryStore } from "@/store/useTelemetryStore";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<"PROLOGUE" | "SENSOR" | "PAYWALL">("PROLOGUE");
  const stage = useTelemetryStore((s) => s.stage);

  const isSensorActive = activeScreen === "SENSOR" && stage !== "DRAMATIC_COMPUTATION" && stage !== "COMPLETED";

  return (
    <main className={`min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans ${isSensorActive ? "p-0" : "p-4"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-transparent to-transparent pointer-events-none" />

      <div className={`z-10 w-full flex flex-col items-center ${isSensorActive ? "max-w-full h-full" : "max-w-4xl"}`}>
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
