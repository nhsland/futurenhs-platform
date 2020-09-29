import { useState, useEffect, useRef, MutableRefObject } from "react";

export default function useHover<T extends HTMLElement = HTMLElement>(): [
  MutableRefObject<T>?,

  boolean?
] {
  const [value, setValue] = useState<boolean>(false);

  const ref = useRef<T>(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      const node = ref.current;

      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);

        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },

    [ref.current] // Recall only if ref changes
  );

  return [ref as MutableRefObject<T>, !!value];
}
