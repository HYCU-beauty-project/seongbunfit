import { getIngredientColor } from "@/lib/ingredientVisual";

interface Props {
  ingredientId: string;
  size?: number;
}

export default function IngredientTag({ ingredientId, size = 28 }: Props) {
  const color = getIngredientColor(ingredientId);
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ height: size, width: size, backgroundColor: `${color}1a` }}
      aria-hidden
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5c3.5 4.5 6 7.8 6 11.2a6 6 0 1 1-12 0c0-3.4 2.5-6.7 6-11.2Z" />
      </svg>
    </span>
  );
}
