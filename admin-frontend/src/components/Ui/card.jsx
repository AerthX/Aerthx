export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-md p-4 bg-white dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
