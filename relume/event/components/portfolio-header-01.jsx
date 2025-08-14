"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

export function PortfolioHeader1() {
  return (
    <section className="px-[5%]">
      <div className="mx-auto max-w-lg py-16 text-center md:py-24 lg:py-28">
        <div>
          <h1 className="heading-h1 mb-5 font-bold md:mb-6">Dance Night Out</h1>
          <p className="text-medium">
            Join us for an unforgettable evening of music and dance in the heart
            of Saint Louis!
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 md:mt-6">
            <Badge>
              <a href="#">Live DJ</a>
            </Badge>
            <Badge>
              <a href="#">Dance Party</a>
            </Badge>
            <Badge>
              <a href="#">Nightlife Event</a>
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
