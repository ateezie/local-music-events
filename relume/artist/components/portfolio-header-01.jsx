"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

export function PortfolioHeader1() {
  return (
    <section className="px-[5%]">
      <div className="mx-auto max-w-lg py-16 text-center md:py-24 lg:py-28">
        <div>
          <h1 className="heading-h1 mb-5 font-bold md:mb-6">
            DJ Stellar Beats
          </h1>
          <p className="text-medium">
            A rising star in the dance music scene, blending electrifying beats
            with captivating performances.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 md:mt-6">
            <Badge>
              <a href="#">Electronic Artist</a>
            </Badge>
            <Badge>
              <a href="#">Live Performer</a>
            </Badge>
            <Badge>
              <a href="#">Mix Master</a>
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
