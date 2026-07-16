"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

const sections = [
  {
    id: "web-development",
    label: "Web Development",
  },
  {
    id: "software-testing",
    label: "Software Testing",
  },
];

export default function Navbar() {
  const [active, setActive] = useState("web-development");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.35,
      },
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          <span className="text-emerald-400">&lt;/&gt;</span> Portfolio
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`transition ${
                active === section.id
                  ? "text-emerald-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {section.label}
            </a>
          ))}

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Live Project
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* Mobile Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? (
            <X className="text-white" />
          ) : (
            <Menu className="text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-slate-800 bg-slate-900 transition-all duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-6">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setOpen(false)}
              className={`py-3 ${
                active === section.id ? "text-emerald-400" : "text-slate-300"
              }`}
            >
              {section.label}
            </a>
          ))}

          <Link
            href="/admin"
            className="mt-4 rounded-lg bg-emerald-500 px-4 py-3 text-center font-semibold text-slate-950"
          >
            Live Project
          </Link>
        </div>
      </div>
    </nav>
  );
}
