"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Contact28() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mr-auto mb-12 flex max-w-lg flex-col justify-start text-left md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Venues</p>
          <h2 className="heading-h2 mb-5 font-bold md:mb-6">Locations</h2>
          <p className="text-medium">
            Discover the best dance music venues in St. Louis
          </p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 items-center gap-x-12 gap-y-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-start justify-start text-left">
            <div className="mb-6 aspect-[3/2] md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                className="h-full w-full rounded-image object-cover"
                alt="Relume placeholder image"
              />
            </div>
            <h3 className="heading-h4 mb-3 font-bold lg:mb-4">The Loft</h3>
            <p className="text-center">123 Main St, St. Louis MO 63101 USA</p>
            <div className="mt-5 md:mt-6">
              <Button
                title="Get Directions"
                variant="link"
                size="link"
                iconRight={<ChevronRight className="text-scheme-text" />}
              >
                Get Directions
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start text-left">
            <div className="mb-6 aspect-[3/2] md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                className="h-full w-full rounded-image object-cover"
                alt="Relume placeholder image"
              />
            </div>
            <h3 className="heading-h4 mb-3 font-bold lg:mb-4">The Pageant</h3>
            <p className="text-center">
              6161 Delmar Blvd, St. Louis MO 63112 USA
            </p>
            <div className="mt-5 md:mt-6">
              <Button
                title="Get Directions"
                variant="link"
                size="link"
                iconRight={<ChevronRight className="text-scheme-text" />}
              >
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
