import { ChevronRight } from "lucide-react";
import { useNavigate } from "../NavContext";

export interface Crumb {
  label: string;
  page?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const { navigate } = useNavigate();

  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
      {items.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={10} />}
          {crumb.page ? (
            <button
              onClick={() => crumb.page && navigate(crumb.page)}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
