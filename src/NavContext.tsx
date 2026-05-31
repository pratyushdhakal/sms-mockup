import { createContext, useContext } from "react";

interface NavContextType {
  navigate: (pageId: string) => void;
  viewEntity: { type: string; id: string } | null;
  setViewEntity: (entity: { type: string; id: string } | null) => void;
}

export const NavContext = createContext<NavContextType>({
  navigate: () => {},
  viewEntity: null,
  setViewEntity: () => {},
});

export function useNavigate() {
  return useContext(NavContext);
}
