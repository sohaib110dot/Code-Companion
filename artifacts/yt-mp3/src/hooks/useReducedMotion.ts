export function useReducedMotion() {
  if (typeof window === "undefined") return true;
  
  const isMobile = window.innerWidth < 768;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  return isMobile || prefersReduced;
}
