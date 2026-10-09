import { useMemo } from "react";
import type { QRCode } from "qrcode";
import { QrLevel, ModuleShape, FinderShape, GradientType } from "@/lib/store/qr-store";

interface CustomQrRendererProps {
  qr: QRCode | null;
  fg1: string;
  fg2: string;
  bg: string;
  size: number;
  gradientType: GradientType;
  moduleShape: ModuleShape;
  finderShape: FinderShape;
  frame?: "none" | "scan-me-bottom";
  logoUrl: string | null;
}

export function CustomQrRenderer({
  qr,
  fg1,
  fg2,
  bg,
  size,
  gradientType,
  moduleShape,
  finderShape,
  frame = "none",
  logoUrl,
}: CustomQrRendererProps) {
  const baseMargin = 4;
  const frameBottomMargin = frame === "scan-me-bottom" ? 10 : 0;
  const frameTopMargin = frame === "scan-me-bottom" ? 2 : 0;
  const frameSideMargin = frame === "scan-me-bottom" ? 2 : 0;

  const marginX = baseMargin + frameSideMargin;
  const marginTop = baseMargin + frameTopMargin;
  const marginBottom = baseMargin + frameBottomMargin;

  if (!qr) return null;

  const length = qr.modules.size;
  // Size represents the full requested dimension
  // We need to scale cells so everything fits within 'size' considering asymmetrical margins
  const totalCellsX = length + 2 * marginX;
  const totalCellsY = length + marginTop + marginBottom;

  const cellSize = Math.min(size / totalCellsX, size / totalCellsY);

  // Real output size will be exact to preserve square cells
  const realWidth = cellSize * totalCellsX;
  const realHeight = cellSize * totalCellsY;

  // Determine if a module is part of the 3 finder patterns
  const isFinder = (x: number, y: number) => {
    const s = length;
    const fw = 7;
    return (
      (x < fw && y < fw) || // Top-left
      (x > s - fw - 1 && y < fw) || // Top-right
      (x < fw && y > s - fw - 1) // Bottom-left
    );
  };

  const getPath = () => {
    let modulePath = "";
    let finderPath = "";

    const data = qr.modules.data;
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        if (data[row * length + col]) {
          const x = col * cellSize;
          const y = row * cellSize;

          if (isFinder(col, row)) {
            // Finder patterns drawn separately below for custom shapes
            // Or we just collect normal rects if standard
          } else {
            // Check logo clearance
            // Assuming logo covers middle 30% of QR
            const centerStart = length * 0.35;
            const centerEnd = length * 0.65;
            if (logoUrl && col > centerStart && col < centerEnd && row > centerStart && row < centerEnd) {
               // Skip module if logo is present and it falls into logo area
               continue;
            }

            if (moduleShape === "square") {
              modulePath += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}Z `;
            } else if (moduleShape === "dots") {
              const r = cellSize * 0.45;
              const cx = x + cellSize / 2;
              const cy = y + cellSize / 2;
              modulePath += `M${cx + r},${cy}a${r},${r} 0 1,1 -${r * 2},0a${r},${r} 0 1,1 ${r * 2},0 `;
            } else if (moduleShape === "rounded") {
              const r = cellSize * 0.3;
              modulePath += `M${x + r},${y} h${cellSize - 2 * r} a${r},${r} 0 0,1 ${r},${r} v${cellSize - 2 * r} a${r},${r} 0 0,1 -${r},${r} h-${cellSize - 2 * r} a${r},${r} 0 0,1 -${r},-${r} v-${cellSize - 2 * r} a${r},${r} 0 0,1 ${r},-${r} Z `;
            }
          }
        }
      }
    }
    return modulePath;
  };

  const modulePath = getPath();
  const fillUrl = gradientType === "none" ? fg1 : `url(#fg-gradient)`;

  // Finder rendering helper
  const renderFinder = (xOff: number, yOff: number) => {
    const fsize = cellSize * 7;
    const x = xOff * cellSize;
    const y = yOff * cellSize;
    const w = fsize;

    if (finderShape === "square") {
      return (
        <path
          d={`M${x},${y}h${w}v${w}h-${w}Z M${x + cellSize},${y + cellSize}h${w - 2 * cellSize}v${w - 2 * cellSize}h-${w - 2 * cellSize}Z`}
          fillRule="evenodd"
          fill={fillUrl}
        />
      );
    } else if (finderShape === "dots") {
      // Outer square made of dots? No, usually it's just rounded
      // Let's implement rounded for finder
      const rOuter = cellSize * 1.5;
      const rInner = cellSize * 0.5;

      const outerPath = `M${x + rOuter},${y} h${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 ${rOuter},${rOuter} v${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 -${rOuter},${rOuter} h-${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 -${rOuter},-${rOuter} v-${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 ${rOuter},-${rOuter} Z`;

      const iw = w - 2 * cellSize;
      const ix = x + cellSize;
      const iy = y + cellSize;
      const innerPath = `M${ix + rInner},${iy} h${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},${rInner} v${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},${rInner} h-${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},-${rInner} v-${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},-${rInner} Z`;

      // We also need the center block
      const cw = 3 * cellSize;
      const cx = x + 2 * cellSize;
      const cy = y + 2 * cellSize;
      const centerPath = finderShape === "dots" ?
        `M${cx + cw/2},${cy + cw/2} m -${cw/2}, 0 a ${cw/2},${cw/2} 0 1,0 ${cw},0 a ${cw/2},${cw/2} 0 1,0 -${cw},0` :
        `M${cx + rInner},${cy} h${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},${rInner} v${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},${rInner} h-${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},-${rInner} v-${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},-${rInner} Z`;

      return (
        <path d={`${outerPath} ${innerPath} ${centerPath}`} fillRule="evenodd" fill={fillUrl} />
      );
    } else if (finderShape === "rounded") {
      const rOuter = cellSize * 2;
      const rInner = cellSize * 1;

      const outerPath = `M${x + rOuter},${y} h${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 ${rOuter},${rOuter} v${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 -${rOuter},${rOuter} h-${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 -${rOuter},-${rOuter} v-${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 ${rOuter},-${rOuter} Z`;

      const iw = w - 2 * cellSize;
      const ix = x + cellSize;
      const iy = y + cellSize;
      const innerPath = `M${ix + rInner},${iy} h${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},${rInner} v${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},${rInner} h-${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},-${rInner} v-${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},-${rInner} Z`;

      const cw = 3 * cellSize;
      const cx = x + 2 * cellSize;
      const cy = y + 2 * cellSize;
      const centerPath = `M${cx + rInner},${cy} h${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},${rInner} v${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},${rInner} h-${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},-${rInner} v-${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},-${rInner} Z`;

      return (
        <path d={`${outerPath} ${innerPath} ${centerPath}`} fillRule="evenodd" fill={fillUrl} />
      );
    }
  }

  const innerSize = length * cellSize;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={realWidth}
      height={realHeight}
      viewBox={`-${marginX * cellSize} -${marginTop * cellSize} ${realWidth} ${realHeight}`}
      fill="none"
      shapeRendering="crispEdges"
      className="w-full h-auto max-w-full"
      style={{ backgroundColor: bg, maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        {gradientType === "linear" && (
          <linearGradient id="fg-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={fg1} />
            <stop offset="100%" stopColor={fg2} />
          </linearGradient>
        )}
        {gradientType === "radial" && (
          <radialGradient id="fg-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={fg1} />
            <stop offset="100%" stopColor={fg2} />
          </radialGradient>
        )}
      </defs>

      <rect x={-marginX * cellSize} y={-marginTop * cellSize} width={realWidth} height={realHeight} fill={bg} />

      {frame === "scan-me-bottom" && (
        <g>
           <rect
             x={(-marginX + 1) * cellSize}
             y={(-marginTop + 1) * cellSize}
             width={realWidth - 2 * cellSize}
             height={realHeight - 2 * cellSize}
             fill="none"
             stroke={fillUrl}
             strokeWidth={cellSize * 0.5}
             rx={cellSize * 2}
           />
           <rect
             x={(-marginX + 1) * cellSize}
             y={length * cellSize + baseMargin * cellSize}
             width={realWidth - 2 * cellSize}
             height={(frameBottomMargin - baseMargin - 1) * cellSize}
             fill={fillUrl}
             rx={cellSize * 2}
           />
           <text
             x={realWidth / 2 - marginX * cellSize}
             y={length * cellSize + baseMargin * cellSize + ((frameBottomMargin - baseMargin - 1) * cellSize) / 2}
             fill={bg}
             fontSize={cellSize * 3}
             fontWeight="bold"
             fontFamily="sans-serif"
             textAnchor="middle"
             dominantBaseline="middle"
           >
             SCAN ME
           </text>
        </g>
      )}

      <path d={modulePath} fill={fillUrl} />

      {renderFinder(0, 0)}
      {renderFinder(length - 7, 0)}
      {renderFinder(0, length - 7)}

      {logoUrl && (
        <image
          href={logoUrl}
          x={(innerSize * 0.35)}
          y={(innerSize * 0.35)}
          width={(innerSize * 0.3)}
          height={(innerSize * 0.3)}
          preserveAspectRatio="xMidYMid slice"
        />
      )}
    </svg>
  );
}
