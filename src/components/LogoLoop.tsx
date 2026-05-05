// src/components/LogoLoop.tsx
export default function LogoLoop({ logos, speed, direction, logoHeight, gap, hoverSpeed, scaleOnHover, fadeOut, "aria-label": ariaLabel, ...props }: any) {
  return (
    <div className="flex gap-4 overflow-hidden" aria-label={ariaLabel} {...props}>
      {logos?.map((logo: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2">
          {logo.node}
          <span>{logo.title}</span>
        </div>
      ))}
    </div>
  );
}
