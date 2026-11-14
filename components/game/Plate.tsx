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

  useEffect(() => {
    let dead = false;
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
    };
  }, [id, alt]);

  if (!plate?.href) {
    return <p className="caption">The NASA photograph for this gate did not load. The control beside it still stands.</p>;
  }

  return (
    <figure className="plate">
      {/* Remote NASA frames are chosen at runtime. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={plate.href} alt={alt} />
      <figcaption>
        NASA{plate.nasaId ? ` / ${plate.nasaId}` : ""}. {plate.title}. Unaltered. {plate.source}.
      </figcaption>
    </figure>
  );
}
