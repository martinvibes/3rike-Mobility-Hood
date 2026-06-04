// Pulsing placeholder block. Use instead of spinners when you can match the
// rough shape of the real content — feels faster than a single centered spinner.
//
// Examples:
//   <Skeleton className="h-7 w-24" />          // single line
//   <Skeleton className="h-32 w-full rounded-2xl" />  // card

type Props = {
  className?: string;
};

export default function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`bg-gray-200/70 rounded-md animate-pulse ${className}`}
      aria-hidden
    />
  );
}
