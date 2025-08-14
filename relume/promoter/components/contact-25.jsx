"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Contact25() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 flex max-w-lg flex-col justify-center text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Venues</p>
          <h2 className="heading-h2 mb-5 font-bold md:mb-6">Locations</h2>
          <p className="text-medium">
            Explore the best venues in St. Louis for dance music.
          </p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 items-center gap-x-12 gap-y-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-center justify-start text-center">
            <div className="mb-6 w-full md:mb-8">
              <a href="#" className="justify-self-end">
                <img
                  src="https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-map-image.svg"
                  alt="Relume placeholder map image"
                  className="h-[320px] w-full object-cover md:h-[384px]"
                />
              </a>
            </div>
            <h3 className="heading-h4 mb-3 font-bold lg:mb-4">The Pageant</h3>
            <p className="text-center">6161 Delmar Blvd, St. Louis, MO 63112</p>
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
          <div className="flex flex-col items-center justify-start text-center">
            <div className="mb-6 w-full md:mb-8">
              <a href="#" className="justify-self-end">
                <img
                  src="https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-map-image.svg"
                  alt="Relume placeholder map image"
                  className="h-[320px] w-full object-cover md:h-[384px]"
                />
              </a>
            </div>
            <h3 className="heading-h4 mb-3 font-bold lg:mb-4">
              Old Rock House
            </h3>
            <p className="text-center">1200 S 7th St, St. Louis, MO 63104</p>
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
