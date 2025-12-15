import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">{children}</main>
      <footer className="border-t border-border bg-muted/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            华夏历史 · 探索五千年文明
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            © 2025 华夏历史知识系统
          </p>
        </div>
      </footer>
    </div>
  );
};
