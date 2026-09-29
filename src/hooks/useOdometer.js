import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';

/**
 * Rolls a number from 0 (or its previous value) up to `target`, using an
 * eased deceleration — deliberate and mechanical, never bouncy.
 *
 * @param {number} target
 * @param {{ duration?: number, decimals?: number, delay?: number }} options
 */
export function useOdometer(target, { duration = 1.8, decimals = 0, delay = 0 } = {}) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState('0');
  const prevTarget = useRef(0);

  useEffect(() => {
    const controls = animate(motionValue, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // "mechanism" easing — fast start, long soft settle
      onUpdate(value) {
        setDisplay(
          value.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        );
      },
    });
    prevTarget.current = target;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}
