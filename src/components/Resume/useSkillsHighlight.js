import { useEffect, useRef, useState } from 'react';

// Tempo de destaque de cada card; acompanha a transição do ".skill" no SmallCard
export const SKILL_HIGHLIGHT_INTERVAL = 1000;
// Tempo após o mouse sair dos cards até o destaque automático voltar
export const SKILL_HIGHLIGHT_RESUME_DELAY = 1000;

const prefersReducedMotion = () => Boolean(
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
);

// Destaca os cards de skill um por vez, em loop. O destaque pausa enquanto o mouse está
// sobre algum card e só roda com a grade visível na tela, já que a aba "Resumo" fica
// montada mesmo quando oculta.
export default function useSkillsHighlight(skillsCount) {
  const skillsRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const [highlightedSkill, setHighlightedSkill] = useState(0);
  const [isSkillsVisible, setIsSkillsVisible] = useState(false);
  const [isHighlightPaused, setIsHighlightPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setIsSkillsVisible(entry.isIntersecting);
      // Fora da tela o mouse pode sair dos cards sem disparar "mouseleave"
      if (!entry.isIntersecting) {
        clearTimeout(resumeTimeoutRef.current);
        setIsHighlightPaused(false);
      }
    });
    observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, []);

  const isHighlightRunning = isSkillsVisible && !isHighlightPaused;

  useEffect(() => {
    if (!isHighlightRunning) return undefined;
    const intervalId = setInterval(
      () => setHighlightedSkill((index) => (index + 1) % skillsCount),
      SKILL_HIGHLIGHT_INTERVAL,
    );
    return () => clearInterval(intervalId);
  }, [isHighlightRunning, skillsCount]);

  useEffect(() => () => clearTimeout(resumeTimeoutRef.current), []);

  const pauseHighlight = () => {
    clearTimeout(resumeTimeoutRef.current);
    setIsHighlightPaused(true);
  };

  const resumeHighlightLater = () => {
    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(
      () => setIsHighlightPaused(false),
      SKILL_HIGHLIGHT_RESUME_DELAY,
    );
  };

  return {
    skillsRef,
    isHighlightRunning,
    highlightedSkill,
    pauseHighlight,
    resumeHighlightLater,
  };
}
