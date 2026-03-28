import { format } from "date-fns";

export function formatDate(iso: string | number | Date): string {
  if (!iso) return "N/A";
  try {
    return format(new Date(iso), "dd MMM yyyy");
  } catch (err) {
    return String(iso);
  }
}

export function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function stageToLabel(stage: string | number): string {
  const map: Record<string, string> = {
    0: "Farm Harvest",
    1: "Processing",
    2: "Lab Testing",
    3: "Certified",
    4: "Brand Packaged",
    5: "Retail Ready",
    "FarmHarvest": "Farm Harvest",
    "Processing": "Processing",
    "LabTesting": "Lab Testing",
    "Certified": "Certified",
    "BrandPackaged": "Brand Packaged",
    "RetailReady": "Retail Ready",
  };
  return map[String(stage)] || String(stage);
}

export function stageToColor(stage: string | number): string {
  const map: Record<string, string> = {
    0: "bg-emerald-100 text-emerald-800",
    1: "bg-blue-100 text-blue-800",
    2: "bg-purple-100 text-purple-800",
    3: "bg-accent-light text-accent-dark font-semibold",
    4: "bg-indigo-100 text-indigo-800",
    5: "bg-primary text-white",
  };
  
  // Also mapping string variants in case stage is passed as string key
  if (typeof stage === "string" && !isNaN(Number(stage))) {
    return map[stage] || "bg-gray-100 text-gray-800";
  }
  
  const strMap: Record<string, string> = {
    "FarmHarvest": map[0],
    "Processing": map[1],
    "LabTesting": map[2],
    "Certified": map[3],
    "BrandPackaged": map[4],
    "RetailReady": map[5]
  };
  
  return strMap[String(stage)] || map[String(stage)] || "bg-gray-100 text-gray-800";
}

export function trustScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}
