// Large line chart for the stock page (simple axes, pure SVG)
type Pt = { x: number; y: number };

function scale(values: number[], w: number, h: number, padX = 40, padY = 20): Pt[] {
  if (!values || values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = w - padX - 10;
  const innerH = h - padY - 10;
  const dx = values.length > 1 ? innerW / (values.length - 1) : 0;
  return values.map((v, i) => ({
    x: padX + i * dx,
    y: padY + (innerH - ((v - min) / span) * innerH),
  }));
}

export default function BigChart({
  values,
  width = 980,
  height = 340,
  color = "#2f9e44",
}: { values: number[]; width?: number; height?: number; color?: string }) {
  const pts = scale(values, width, height);
  if (pts.length < 2) return <div style={{ height }} />;

  const line = `M ${pts[0].x} ${pts[0].y}` + pts.map(p => ` L ${p.x} ${p.y}`).join("");
  const y0 = height - 10;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="0" y="0" width={width} height={height} rx="10" fill="#f8f8f8" />
      <line x1="40" y1={y0} x2={width - 10} y2={y0} stroke="#ddd" />
      <line x1="40" y1="10" x2="40" y2={y0} stroke="#ddd" />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} />
    </svg>
  );
}
