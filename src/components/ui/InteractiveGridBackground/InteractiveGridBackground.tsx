import { HTMLMotionProps, motion } from "framer-motion";
import { HTMLAttributes, useRef, memo } from "react";

import styles from "./InteractiveGridBackground.module.scss";
import classNames from "@/utils/classNames/classNames";

import useMousePosition from "@/hooks/useMousePosition";
import { useResponsive } from "@/hooks/useResponsive";

interface InteractiveGridBackgroundProps
  extends Omit<
    HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">,
    "children"
  > {
  /**
   * Line width of the grid lines
   *
   * @default 2
   */
  lineWidth?: number;
  /**
   * Size of each square
   *
   * @default 100
   */
  gridSize?: number;
  /**
   * Color of the grid lines
   *
   * @default #1480ff
   */
  gridColor?: string;
  /**
   * Size of the mask
   *
   * @default 500
   */
  maskSize?: number;
}

const InteractiveGridBackground = ({
  lineWidth = 2,
  gridSize = 100,
  gridColor = "#1480ff",
  maskSize = 500,
  className = "",
  ...props
}: InteractiveGridBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, , isDesktop] = useResponsive();
  const { x, y } = useMousePosition(ref);

  const isVisible = !isDesktop;

  return (
    <motion.div
      ref={ref}
      className={classNames(styles.mask, {}, [className])}
      style={{
        opacity: 1,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg width="${gridSize}" height="${gridSize}" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="${gridSize}" y2="0" stroke="${gridColor}" stroke-width="${lineWidth}" />
            <line x1="0" y1="0" x2="0" y2="${gridSize}" stroke="${gridColor}" stroke-width="${lineWidth}" />
          </svg>
        `)}")`,
        backgroundPosition: `-${lineWidth}px -${lineWidth}px`,
        WebkitMask: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,0.2) ${maskSize}px)`, // Radial mask effect
        WebkitMaskSize: "100%",
      }}
      animate={{
        opacity: isVisible ? 1 : 0.5,
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      {...props}
    ></motion.div>
  );
};

export default memo(InteractiveGridBackground);
