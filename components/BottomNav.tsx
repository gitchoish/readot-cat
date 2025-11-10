"use client";

import Link from "next/link";

export default function BottomNav({ active }: { active: string }) {
  const items = [
    { id: "home", label: "Home", href: "/" , icon: "⌂"},
    { id: "log", label: "Log", href: "/log", icon: "≡" },
    { id: "books", label: "Books", href: "/books", icon: "冊" },
    { id: "cal", label: "Cal", href: "/calendar", icon: "🗓" },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <Link key={item.id} href={item.href} className="bottom-nav-link">
          <div
            className={
              "nav-btn" + (active === item.id ? " nav-btn--active" : "")
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
