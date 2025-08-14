"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight, RelumeIcon } from "relume-icons";

export function Layout238() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 text-center md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg">
            <h2 className="heading-h3 font-bold">
              Discover the Best Dance Music Venues in Saint Louis
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-5 font-bold md:mb-6">
              Experience Unique Vibes at Our Featured Locations
            </h3>
            <p>
              Our top-rated venues offer an unforgettable atmosphere for every
              dance music lover.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button
                iconRight={<ChevronRight className="text-scheme-text" />}
                variant="link"
                size="link"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-5 font-bold md:mb-6">
              Immerse Yourself in Unique Atmospheres Tailored for Music Lovers
            </h3>
            <p>
              Each venue boasts a distinctive character that enhances your music
              experience.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button
                iconRight={<ChevronRight className="text-scheme-text" />}
                variant="link"
                size="link"
              >
                Sign Up
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-5 font-bold md:mb-6">
              Enjoy Accessibility to All Our Featured Venues
            </h3>
            <p>
              Our venues are conveniently located, making it easy for everyone
              to join the fun.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button
                iconRight={<ChevronRight className="text-scheme-text" />}
                variant="link"
                size="link"
              >
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
