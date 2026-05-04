import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { ChatWidget } from "./ChatWidget";

export function Layout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1 pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <ChatWidget />
    </div>
  );
}
