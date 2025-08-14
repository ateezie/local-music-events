"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";
import { CalendarToday, ChevronRight, LocationOn } from "relume-icons";

export function Event18() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <h4 className="font-semibold">Upcoming</h4>
          <h1 className="heading-h2 mt-3 font-bold md:mt-4">Events</h1>
          <p className="text-medium mt-5 md:mt-6">
            Discover the hottest dance music events in Saint Louis!
          </p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          <Card className="flex flex-col items-start">
            <a href="#" className="relative block aspect-[3/2] w-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
                className="absolute size-full object-cover"
              />
              <Badge className="absolute top-4 right-4">Dance</Badge>
            </a>
            <div className="flex flex-col items-start p-6">
              <div className="text-small mb-3 flex flex-wrap gap-4 md:mb-4">
                <div className="flex items-center gap-2">
                  <CalendarToday className="size-6 flex-none text-scheme-text" />
                  Fri 09 Feb 2024
                </div>
                <div className="flex items-center gap-2">
                  <LocationOn className="size-6 flex-none text-scheme-text" />
                  <span>Venue1</span>
                </div>
              </div>
              <a href="#" className="mb-2">
                <h2 className="heading-h5 font-bold">DJ Night Extravaganza</h2>
              </a>
              <p>
                Join us for an unforgettable night with top DJs spinning the
                latest hits!
              </p>
              <Button
                title="View event"
                variant="link"
                size="link"
                iconRight={<ChevronRight className="text-scheme-text" />}
                className="mt-5 md:mt-6"
              >
                View event
              </Button>
            </div>
          </Card>
          <Card className="flex flex-col items-start">
            <a href="#" className="relative block aspect-[3/2] w-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
                className="absolute size-full object-cover"
              />
              <Badge className="absolute top-4 right-4">House</Badge>
            </a>
            <div className="flex flex-col items-start p-6">
              <div className="text-small mb-3 flex flex-wrap gap-4 md:mb-4">
                <div className="flex items-center gap-2">
                  <CalendarToday className="size-6 flex-none text-scheme-text" />
                  Sat 10 Feb 2024
                </div>
                <div className="flex items-center gap-2">
                  <LocationOn className="size-6 flex-none text-scheme-text" />
                  <span>Venue2</span>
                </div>
              </div>
              <a href="#" className="mb-2">
                <h2 className="heading-h5 font-bold">Electro Beats Festival</h2>
              </a>
              <p>
                Experience a full day of electrifying performances and vibrant
                atmosphere!
              </p>
              <Button
                title="View event"
                variant="link"
                size="link"
                iconRight={<ChevronRight className="text-scheme-text" />}
                className="mt-5 md:mt-6"
              >
                View event
              </Button>
            </div>
          </Card>
          <Card className="flex flex-col items-start">
            <a href="#" className="relative block aspect-[3/2] w-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image 1"
                className="absolute size-full object-cover"
              />
              <Badge className="absolute top-4 right-4">Techno</Badge>
            </a>
            <div className="flex flex-col items-start p-6">
              <div className="text-small mb-3 flex flex-wrap gap-4 md:mb-4">
                <div className="flex items-center gap-2">
                  <CalendarToday className="size-6 flex-none text-scheme-text" />
                  Sun 11 Feb 2024
                </div>
                <div className="flex items-center gap-2">
                  <LocationOn className="size-6 flex-none text-scheme-text" />
                  <span>Venue3</span>
                </div>
              </div>
              <a href="#" className="mb-2">
                <h2 className="heading-h5 font-bold">Sunset Groove Party</h2>
              </a>
              <p>Dance into the sunset with amazing vibes and great company!</p>
              <Button
                title="View event"
                variant="link"
                size="link"
                iconRight={<ChevronRight className="text-scheme-text" />}
                className="mt-5 md:mt-6"
              >
                View event
              </Button>
            </div>
          </Card>
        </div>
        <div className="mt-12 flex justify-center md:mt-18 lg:mt-20">
          <Button variant="secondary" title="View all">
            View all
          </Button>
        </div>
      </div>
    </section>
  );
}
