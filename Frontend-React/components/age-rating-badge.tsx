// components/age-rating-badge.tsx
import { cn } from "@/lib/utils"

export default function AgeRatingBadge({ rating }: { rating: string }) {
  const isNumber = !isNaN(Number(rating))
  const label = isNumber ? `+${rating}` : rating

  return (
    <span
      className={cn(
        "inline-block align-middle border border-white/30 text-white/90 font-semibold text-xs leading-tight rounded-sm px-1.5 py-0.5",
        "bg-white/10"
      )}
    >
      {label}
    </span>
  )
}
