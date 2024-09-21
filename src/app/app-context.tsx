"use client";

import { Option } from "@/config/options";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  categoriesOptions: Option[];
  setCategoriesOptions: (options: Option[]) => void;
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
}>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  categoriesOptions: [],
  setCategoriesOptions: () => {},
  trigger: false,
  setTrigger: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export default function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpenState] = useState<boolean>(true);
  const [categoriesOptions, setCategoriesOptions] = useState<Option[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);

  const setSidebarOpen = useCallback(
    (open: boolean) => {
      setSidebarOpenState(open);
      localStorage.setItem("sidebar-open", JSON.stringify(open));
    },
    [setSidebarOpenState]
  );

  useEffect(() => {
    const _sidebarOpen = localStorage.getItem("sidebar-open");
    setSidebarOpenState(_sidebarOpen ? JSON.parse(_sidebarOpen) : true);
  }, [setSidebarOpenState]);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        categoriesOptions,
        setCategoriesOptions,
        trigger,
        setTrigger,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
