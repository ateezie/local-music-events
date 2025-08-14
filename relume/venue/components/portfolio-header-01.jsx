"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

export function PortfolioHeader1() {
  return (
    <section className="px-[5%]">
      <div className="mx-auto max-w-lg py-16 text-center md:py-24 lg:py-28">
        <div>
          <h1 className="heading-h1 mb-5 font-bold md:mb-6">The Grand Venue</h1>
          <p className="text-medium">
            A premier destination for unforgettable dance music experiences in
            the heart of Saint Louis.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 md:mt-6">
            <Badge>
              <a href="#">Live Music</a>
            </Badge>
            <Badge>
              <a href="#">Dance Events</a>
            </Badge>
            <Badge>
              <a href="#">Nightlife Hub</a>
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
