export function FavoriteToggle({ isFavorite, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite}
      className={`rounded-full border-2 px-3 py-1 text-sm font-semibold ${
        isFavorite
          ? 'border-gold bg-gold text-teal'
          : 'border-teal text-teal hover:bg-lavender'
      }`}
    >
      {isFavorite ? '♥ Saved' : '♡ Save'}
    </button>
  )
}