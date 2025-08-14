"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Header50() {
  return (
    <section className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="relative z-10 container">
        <div className="w-full max-w-lg">
          <p className="mb-3 font-semibold text-white md:mb-4">Vibes</p>
          <h1 className="heading-h1 mb-5 font-bold text-white md:mb-6">
            Meet the Artists
          </h1>
          <p className="text-medium text-white">
            Discover the talent lighting up St. Louis with electrifying
            performances and unforgettable experiences.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
            <Button title="Explore">Explore</Button>
            <Button title="Learn More" variant="secondary-alt">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
          className="size-full object-cover"
          alt="Relume placeholder image"
        />
        <div className="absolute inset-0 bg-neutral-darkest/50" />
      </div>
    </section>
  );
}
