"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { restoreAuth } from "@/store/slices/authSlice";
import { restoreCart } from "@/store/slices/cartSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      store.dispatch(restoreAuth());
      store.dispatch(restoreCart());
      setIsHydrated(true);
    }
  }, []);

  return (
    <Provider store={store}>
      {isHydrated ? children : <div className="min-h-screen" />}
    </Provider>
  );
}
