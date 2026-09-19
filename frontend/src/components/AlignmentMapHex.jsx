import { DOMAIN_LABELS, DOMAIN_ORDER } from '../constants/domains';
import { domainScoresToDisplayPct } from '../utils/domainScores';

const MAP_NODES = [
  { pillar: 'IDENTITY', label: 'Identity', sub: 'Who you are', angle: -90 },
  { pillar: 'PURPOSE', label: 'Purpose', sub: 'What you are for', angle: -30 },
  { pillar: 'EXECUTION', label: 'Execution', sub: 'How you follow through', angle: 30 },
  { pillar: 'HABITS', label: 'Habits', sub: 'What you do daily', angle: 90 },
  { pillar: 'ENVIRONMENT', label: 'Environment', sub: 'What surrounds you', angle: 150 },
  { pillar: 'MINDSET', label: 'Mindset', sub: 'How you think', angle: 210 },
];

function hasPillarScores(result) {
  return Boolean(result?.pillarScores && Object.keys(result.pillarScores).length);
}

function pctFor(result, pillar) {
  if (!hasPillarScores(result)) return null;
  return domainScoresToDisplayPct(result.pillarScores, pillar);
}

function strainPillar(result) {
  if (result?.primaryDomain) return result.primaryDomain;
  if (!result?.primaryStrainLabel) return null;
  return DOMAIN_ORDER.find((p) => DOMAIN_LABELS[p] === result.primaryStrainLabel) || null;
}

export default function AlignmentMapHex({ result = null, className = 'w-full h-auto max-w-xl mx-auto text-alignment-accent' }) {
  const cx = 210;
  const cy = 210;
  const rHex = 118;
  const rNode = 132;
  const rLine = 108;
  const rad = (deg) => (deg * Math.PI) / 180;
  const pt = (deg, radius) => ({
    x: cx + radius * Math.cos(rad(deg)),
    y: cy + radius * Math.sin(rad(deg)),
  });
  const hexPoints = MAP_NODES.map((_, i) => {
    const p = pt(-90 + i * 60, rHex);
    return `${p.x},${p.y}`;
  }).join(' ');
  const strain = strainPillar(result);
  const scored = hasPillarScores(result);
  const score = result?.score != null ? Math.round(Number(result.score)) : null;

  return (
    <svg
      viewBox="-28 -20 476 460"
      className={className}
      role="img"
      aria-label={
        score != null
          ? `Alignment map. Score ${score} out of 100. Primary strain ${result?.primaryStrainLabel || strain || ''}.`
          : 'Six domains arranged around Alignment OS.'
      }
    >
      <polygon
        points={hexPoints}
        className="fill-alignment-accent/[0.04] stroke-alignment-accent/[0.12]"
        strokeWidth="1"
      />
      {MAP_NODES.map((d) => {
        const p = pt(d.angle, rLine);
        return (
          <line
            key={`spoke-${d.pillar}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            className="stroke-alignment-accent/15"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        );
      })}
      <circle cx={cx} cy={cy} r="52" className="fill-white stroke-alignment-accent/[0.12]" strokeWidth="1" />
      {score != null ? (
        <>
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            className="fill-alignment-accent font-display"
            style={{ fontFamily: 'Georgia, ui-serif, serif', fontSize: 28 }}
          >
            {score}
          </text>
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            className="fill-alignment-accent/50"
            style={{ fontSize: 9, letterSpacing: '0.16em' }}
          >
            SCORE
          </text>
        </>
      ) : (
        <>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            className="fill-alignment-accent font-display italic"
            style={{ fontFamily: 'Georgia, ui-serif, serif', fontSize: 15 }}
          >
            Alignment
          </text>
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            className="fill-alignment-accent"
            style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}
          >
            OS
          </text>
        </>
      )}
      {MAP_NODES.map((d) => {
        const outer = pt(d.angle, rNode);
        const pct = pctFor(result, d.pillar);
        const fillOpacity = pct == null ? 0.12 : 0.12 + (pct / 100) * 0.72;
        const isStrain = strain === d.pillar;
        return (
          <g key={d.pillar}>
            {isStrain && (
              <circle cx={outer.x} cy={outer.y} r="22" fill="none" stroke="#6E7158" strokeWidth="1.5" />
            )}
            {scored ? (
              <circle cx={outer.x} cy={outer.y} r="16" fill="#6E7158" fillOpacity={fillOpacity} stroke="#6E7158" strokeOpacity="0.35" strokeWidth="1" />
            ) : (
              <>
                <circle cx={outer.x} cy={outer.y} r="16" className="fill-white stroke-alignment-accent/20" strokeWidth="1" />
                <circle cx={outer.x} cy={outer.y} r="5" className="fill-alignment-accent/45" />
              </>
            )}
          </g>
        );
      })}
      {MAP_NODES.map((d) => {
        const outer = pt(d.angle, rNode);
        const pct = pctFor(result, d.pillar);
        const isLeft = d.angle === 150 || d.angle === 210;
        const isRight = d.angle === -30 || d.angle === 30;
        const isTop = d.angle === -90;
        let x = outer.x - 58;
        let y = outer.y - 30;
        let align = 'text-center';
        if (isTop) {
          y = outer.y - 52;
        } else if (d.angle === 90) {
          y = outer.y + 20;
        } else if (isRight) {
          x = outer.x + 22;
          y = outer.y - 16;
          align = 'text-left';
        } else if (isLeft) {
          x = outer.x - 138;
          y = outer.y - 16;
          align = 'text-right';
        }
        return (
          <foreignObject key={`fo-${d.pillar}`} x={x} y={y} width="116" height="48">
            <div className={`${align} leading-tight px-1`}>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-alignment-accent">{d.label}</p>
              <p className="mt-0.5 text-[8px] text-alignment-accent/80">{pct != null ? `${pct}%` : d.sub}</p>
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
}
