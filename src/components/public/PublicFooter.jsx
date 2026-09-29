import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/[0.06] px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base text-platinum">Aureus Capital Management</p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-platinum-faint">
            Private investment advisory for individuals and families. Aureus Capital Management
            is a fictional firm built for this project — not a real investment advisor.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-platinum-faint">
          <Link to="/about" className="hover:text-platinum-muted">About</Link>
          <Link to="/services" className="hover:text-platinum-muted">Services</Link>
          <Link to="/contact" className="hover:text-platinum-muted">Contact</Link>
          <Link to="/login" className="hover:text-platinum-muted">Client login</Link>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-6xl text-[11px] text-platinum-faint">
        © {new Date().getFullYear()} Aureus Capital Management. Demo project — not a licensed
        investment advisor. Nothing on this site is investment advice.
      </p>
    </footer>
  );
}
