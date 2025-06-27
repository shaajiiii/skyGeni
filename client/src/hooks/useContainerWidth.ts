import { useState, useEffect, useRef } from "react";

export const useContainerWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
};
