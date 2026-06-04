import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DEFAULT_BG = "#fffdf8";

type PageThemeContextValue = {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  resetBackground: () => void;
};

const PageThemeContext = createContext<PageThemeContextValue | null>(null);

export function PageThemeProvider({ children }: { children: ReactNode }) {
  const [backgroundColor, setBg] = useState(DEFAULT_BG);

  const setBackgroundColor = useCallback((color: string) => {
    setBg(color);
  }, []);

  const resetBackground = useCallback(() => {
    setBg(DEFAULT_BG);
  }, []);

  const value = useMemo(
    () => ({ backgroundColor, setBackgroundColor, resetBackground }),
    [backgroundColor, setBackgroundColor, resetBackground]
  );

  const isDefault = backgroundColor === DEFAULT_BG;

  return (
    <PageThemeContext.Provider value={value}>
      <div
        className={`min-h-screen transition-[background-color] duration-[1500ms] ease-in-out ${
          isDefault ? "animate-gradient-bg" : ""
        }`}
        style={{ backgroundColor }}
      >
        {children}
      </div>
    </PageThemeContext.Provider>
  );
}

export function usePageTheme() {
  const ctx = useContext(PageThemeContext);
  if (!ctx) throw new Error("usePageTheme must be used within PageThemeProvider");
  return ctx;
}
