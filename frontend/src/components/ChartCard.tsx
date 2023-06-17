"use client";

import { cx } from "classix";
import { ErrorBoundary } from "./ErrorBoundary";

type Props = {
  label?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * This card component is used to wrap charts.
 */
export function ChartCard({ label, children, className }: Props) {
  return (
    <ErrorBoundary>
      <div className={cx("rounded p-4 shadow-md", className)}>
        {label && <h2 className="mb-2">{label}</h2>}
        {children}
      </div>
    </ErrorBoundary>
  );
}
