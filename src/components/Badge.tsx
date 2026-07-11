export default function Badge({ badge }: { badge: string }) {
  const colors: Record<string, string> = {
    "DISPONIBLE": "bg-green-100 text-green-800",
    "AGOTADO": "bg-red-100 text-red-800",
    "PROXIMAMENTE": "bg-gray-200 text-gray-700",
  };
  const cls = colors[badge] || "bg-blue-100 text-blue-800";
  return <span className={"inline-block px-2 py-1 text-xs rounded " + cls}>{badge}</span>;
}
