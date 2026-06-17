import { AppRoot } from "@/containers/AppRoot";
import type { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return <AppRoot>{children}</AppRoot>;
}
