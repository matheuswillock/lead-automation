import { Search } from "lucide-react";

export default function IconPlatform() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <Search className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold">Lead Generator</span>
    </div>
  );
}