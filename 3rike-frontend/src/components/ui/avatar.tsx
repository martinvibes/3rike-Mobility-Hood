// Initials-based avatar. Picks a color deterministically from a hash of the
// name so the same user always gets the same color across the app. Used on the
// dashboard header, profile page, and anywhere else we need a user chip.

type Props = {
  name?: string | null;
  size?: number;
  className?: string;
};

// Earthy palette that reads well next to the app's green primary without
// fighting it.
const COLORS = [
  "#01C259", // brand green
  "#1B8036", // dark green
  "#9747FF", // purple
  "#1969FE", // blue
  "#EE9C2E", // amber
  "#F1B058", // sand
  "#0F766E", // teal
  "#0066FF", // sky blue
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase();
  }
  return ((words[0]?.[0] ?? "") + (words[words.length - 1]?.[0] ?? ""))
    .toUpperCase();
}

export default function Avatar({ name, size = 40, className = "" }: Props) {
  const safeName = (name ?? "").trim() || "User";
  const color = COLORS[hash(safeName) % COLORS.length] ?? COLORS[0]!;
  const initials = initialsOf(safeName);
  // Scale font to roughly 45% of the size so initials sit nicely.
  const fontSize = Math.round(size * 0.42);

  return (
    <div
      role="img"
      aria-label={safeName}
      className={`shrink-0 rounded-full flex items-center justify-center font-semibold text-white select-none ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: `${fontSize}px`,
      }}
    >
      {initials}
    </div>
  );
}
