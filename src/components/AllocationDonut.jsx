import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';

const SEGMENT_COLORS = ['#D4AF37', '#10B981', '#6B7280', '#8A94A6', '#E8CD73'];

/**
 * @param {{
 *   allocation: { category: string, percentage: number, value: number, holdings?: string[] }[]
 * }} props
 */
export default function AllocationDonut({ allocation }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const data = useMemo(
    () => allocation.map((a) => ({ name: a.category, value: a.percentage, raw: a })),
    [allocation]
  );

  const active = activeIndex !== null ? allocation[activeIndex] : null;

  function renderActiveShape(props) {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        {/* Detached, expanded ring for the tapped segment */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={4}
        />
      </g>
    );
  }

  return (
    <div>
      <h3 className="font-display text-lg text-platinum">Asset allocation</h3>

      <div className="relative mx-auto mt-2 h-64 w-64 sm:h-72 sm:w-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={78}
              outerRadius={104}
              paddingAngle={3}
              stroke="none"
              cornerRadius={3}
              activeIndex={activeIndex ?? undefined}
              activeShape={renderActiveShape}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
              onClick={(_, index) =>
                setActiveIndex((prev) => (prev === index ? null : index))
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                  className="cursor-pointer outline-none"
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label — swaps between total view and the tapped segment's detail */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.category}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="px-6"
              >
                <p className="text-xs text-platinum-faint">{active.category}</p>
                <p className="tnum mt-1 font-display text-2xl text-platinum">
                  {active.percentage.toFixed(1)}%
                </p>
                <p className="tnum mt-0.5 text-xs text-platinum-muted">
                  ${active.value.toLocaleString('en-US')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="total"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs text-platinum-faint">Diversification</p>
                <p className="font-display text-lg text-platinum">
                  {allocation.length} classes
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {allocation.map((a, i) => (
          <button
            key={a.category}
            onClick={() => setActiveIndex((prev) => (prev === i ? null : i))}
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors hover:bg-white/[0.03]"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
            />
            <span className="truncate text-xs text-platinum-muted">{a.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
