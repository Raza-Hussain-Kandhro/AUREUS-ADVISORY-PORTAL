/**
 * Converts an array of [x, y] points into a smooth SVG path `d` string using
 * Catmull-Rom-to-cubic-Bezier conversion. This is what gives the performance
 * chart its soft, continuous curve rather than sharp polyline joints.
 *
 * @param {[number, number][]} points
 * @param {number} tension 0 (straight) – 1 (loose curve), default 0.85
 */
export function smoothPath(points, tension = 0.85) {
  if (points.length < 2) return '';
  const d = [`M ${points[0][0]},${points[0][1]}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const cp1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const cp2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const cp2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;

    d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`);
  }

  return d.join(' ');
}

/**
 * Maps raw {date, value} series data into pixel-space points for an SVG of
 * the given width/height, with vertical padding so the curve never touches
 * the frame edges.
 */
export function toChartPoints(series, width, height, padding = 16) {
  const values = series.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const usableHeight = height - padding * 2;
  const stepX = series.length > 1 ? width / (series.length - 1) : width;

  return series.map((d, i) => {
    const x = i * stepX;
    const y = padding + usableHeight - ((d.value - min) / range) * usableHeight;
    return [x, y];
  });
}
