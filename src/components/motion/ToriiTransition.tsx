"use client";

import { ReactNode } from "react";

export function ToriiTransition({ children }: { children: ReactNode }) {
  // Simplified: removed AnimatePresence mode="wait" which was blocking 
  // route transitions for 600ms+ while exit animations played out.
  // The vermilion gate lines were a nice touch but added significant
  // perceived latency on every navigation.
  return <>{children}</>;
}
