export function TypingIndicator() {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md bg-white/95 px-3 py-2.5 ring-1 ring-gray-200 shadow-sm"
      aria-label="Dave's AI is typing"
    >
      <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-sky-500 [animation-delay:-0.3s]" />
      <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
      <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-pink-500" />
    </div>
  )
}
