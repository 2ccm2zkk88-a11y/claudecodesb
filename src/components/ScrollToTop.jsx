import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Jumps to top on route change so navigating between pages doesn't
// preserve the previous page's scroll position.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
