"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { PostGameButton } from "./PostGame";

/** Sticky "Post a Game" button on phones, shown after the hero and hidden over the footer. */
export function MobileFab() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("top");
    const footer = document.querySelector("footer");
    let pastHero = false;
    let atFooter = false;
    const update = () => setShow(pastHero && !atFooter);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === footer) atFooter = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-[900] transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      inert={!show}
    >
      <PostGameButton loc="fab" className="btn btn-primary w-full shadow-xl">
        <Icon name="plus" /> Post a Game
      </PostGameButton>
    </div>
  );
}
