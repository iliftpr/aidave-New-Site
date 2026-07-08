export const AGENT_OPEN_EVENT = 'ilift:openDaveAgent'

// Buffers an open request that fires before the lazy-loaded DaveAgent chunk
// has mounted its event listener (module state is a client-side singleton).
let pendingOpen = false

/** Ask the (possibly not-yet-loaded) DaveAgent widget to open. */
export function requestAgentOpen() {
  pendingOpen = true
  window.dispatchEvent(new CustomEvent(AGENT_OPEN_EVENT))
}

/** DaveAgent calls this on mount and on every open to consume a buffered click. */
export function consumePendingAgentOpen(): boolean {
  const was = pendingOpen
  pendingOpen = false
  return was
}
