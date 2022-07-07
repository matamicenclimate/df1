import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Simple menu tab component.
 */
export function Tab({ to, children }: { to: string; children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <li className={`self-center ${pathname === to ? 'active' : ''}`}>
      <Link to={to}>
        <p className="hover:font-bold">{children}</p>
      </Link>
    </li>
  );
}
