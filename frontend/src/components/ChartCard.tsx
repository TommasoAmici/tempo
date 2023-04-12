type Props = {
  label?: string;
  children: React.ReactNode;
};

/**
 * This card component is used to wrap charts.
 */
export function ChartCard({ label, children }: Props) {
  return (
    <div className="rounded p-4 shadow-md">
      {label && <h2 className="mb-2">{label}</h2>}
      {children}
    </div>
  );
}
