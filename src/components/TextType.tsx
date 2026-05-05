// src/components/TextType.tsx
export default function TextType({ texts, ...props }: any) {
  return <span {...props}>{texts?.[0] || ""}</span>;
}
