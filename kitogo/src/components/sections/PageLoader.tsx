'use client';

import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (hidden) return null;

  return (
    <div className="page-loader">
      <div className="page-loader-mark">
        <span className="page-loader-dot" />
        KITOGO
      </div>
    </div>
  );
}
