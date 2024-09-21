import { Shell } from "@/components/ui/shell";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <Shell>
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin w-14 h-14" />
      </div>
    </Shell>
  );
}
