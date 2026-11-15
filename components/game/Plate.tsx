"use client";

import { useEffect, useState } from "react";

type PlateData = {
  source: string;
  href: string | null;
  title: string;
  nasaId: string;
};

export function Plate({ id, alt }: { id: string; alt: string }) {
  const [plate, setPlate] = useState<PlateData | null>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let dead = false;
    const timer = window.setTimeout(() => {
      if (!dead) setPlate((current) => current ?? { source: "snapshot", href: null, title: alt, nasaId: "" });
    }, 8000);
    fetch(`/api/plate?id=${id}`)
      .then((response) => response.json())
      .then((data: PlateData) => {
        if (!dead) setPlate(data);
      })
      .catch(() => {
        if (!dead) setPlate({ source: "snapshot", href: null, title: alt, nasaId: "" });
      });
    return () => {
      dead = true;
      window.clearTimeout(timer);
    };
  }, [id, alt]);

  if (!plate) {
    return <p className="caption">Loading the NASA photograph…</p>;
  }

  if (!plate.href || broken) {
    return <p className="caption">The NASA photograph for this gate did not load. The control beside it still stands.</p>;
  }

  return (
    <figure className="plate">
      {/* Remote NASA frames are chosen at runtime. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={plate.href} alt={alt} onError={() => setBroken(true)} />
      <figcaption>
        NASA{plate.nasaId ? ` / ${plate.nasaId}` : ""}. {plate.title}. Unaltered. {plate.source}.
      </figcaption>
    </figure>
  );
}
