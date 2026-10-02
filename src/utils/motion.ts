// Feedback never owns visibility, focus, or application state.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const running = new Map<HTMLElement, Animation>()

export function stopFeedback(element: HTMLElement) {
  running.get(element)?.cancel()
  running.delete(element)
}

export function enterFeedback(element: HTMLElement, lift = true) {
  stopFeedback(element)
  if (reducedMotion.matches || document.hidden || element.hidden || !element.animate) return
  const bounds = element.getBoundingClientRect()
  if (bounds.bottom < 0 || bounds.top > innerHeight || bounds.height === 0) return
  const animation = element.animate(
    lift
      ? [{ opacity: 0.65, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }]
      : [{ opacity: 0.55 }, { opacity: 1 }],
    { duration: 180, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' }
  )
  running.set(element, animation)
  const release = () => { if (running.get(element) === animation) running.delete(element) }
  animation.addEventListener('finish', release, { once: true })
  animation.addEventListener('cancel', release, { once: true })
}

const stopAll = () => {
  running.forEach((animation) => animation.cancel())
  running.clear()
}
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) stopAll() })
document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll() })
window.addEventListener('pagehide', stopAll)
