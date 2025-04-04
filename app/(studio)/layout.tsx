import React, { ReactNode } from "react";
import "../globals.css";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
      <main>{children}</main>
  );
}
