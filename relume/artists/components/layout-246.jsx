"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight, RelumeIcon } from "relume-icons";

export function Layout246() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start gap-5 md:mb-18 md:grid-cols-2 md:gap-x-12 lg:mb-20 lg:gap-x-20">
          <div>
            <h2 className="heading-h3 font-bold">
              Discover the Artists Shaping St. Louis' Dance Music Scene
            </h2>
          </div>
          <div>
            <p className="text-medium">
              Explore a curated list of artists who are making waves in the St.
              Louis dance music scene. From local talents to international
              stars, find out who’s performing and when. Stay updated on their
              genres, venues, and promoters to never miss a beat.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 lg:gap-x-12">
          <div>
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Upcoming Artists and Events in St. Louis
            </h3>
            <p>Check out the latest performances and get inspired.</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button
                iconRight={<ChevronRight className="text-scheme-text" />}
                variant="link"
                size="link"
              >
                View
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Past Artists Who Rocked St. Louis
            </h3>
            <p>
              Relive the unforgettable performances that have graced our stages.
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
          <div>
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Genres That Define Our Dance Music Landscape
            </h3>
            <p>Dive into the diverse sounds that keep the dance floor alive.</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button
                iconRight={<ChevronRight className="text-scheme-text" />}
                variant="link"
                size="link"
              >
                Discover
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
