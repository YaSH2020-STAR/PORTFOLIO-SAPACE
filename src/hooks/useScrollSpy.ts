import { useState, useEffect } from 'react';

const SECTION_IDS = ['home', 'about', 'projects', 'research', 'product', 'leadership', 'odyssey', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export function useScrollSpy(offset = 0.2): SectionId | null {
  const [activeId, setActiveId] = useState<SectionId | null>('home');

  useEffect(() => {
    const el = document.getElementById('portfolio-scroll-root');
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute('data-section') as SectionId | null;
          if (id) setActiveId(id);
        }
      },
      { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    SECTION_IDS.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [offset]);

  return activeId;
}

export function scrollToSection(id: SectionId) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export { SECTION_IDS };
