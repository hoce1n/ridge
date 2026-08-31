import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[], offset = 96) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
          return;
        }
        const above = elements.filter(
          (el) => el.getBoundingClientRect().top - offset < 0,
        );
        const last = above[above.length - 1];
        if (last) setActiveId(last.id);
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}
