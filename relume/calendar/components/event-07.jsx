"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Event7() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <h4 className="font-semibold">Events</h4>
            <h1 className="heading-h2 mt-3 font-bold md:mt-4">Calendar</h1>
            <p className="text-medium mt-5 md:mt-6">
              Discover the hottest dance music events in St. Louis!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          <div className="flex flex-col items-start">
            <a
              href="#"
              className="relative mb-5 block aspect-[3/2] w-full md:mb-6"
            >
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 1"
                className="absolute size-full rounded-image object-cover"
              />
              <div className="text-small absolute top-4 right-4 flex min-w-28 flex-col items-center bg-scheme-foreground px-1 py-3 text-scheme-text">
                <span>Fri</span>
                <span className="heading-h4 font-bold">09</span>
                <span>Feb 2024</span>
              </div>
            </a>
            <Badge className="mb-3 md:mb-4">House</Badge>
            <a href="#">
              <h2 className="heading-h5 font-bold">DJ Night Extravaganza</h2>
            </a>
            <p className="mb-2">Club</p>
            <p>Join us for a night of unforgettable beats and dancing!</p>
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
          <div className="flex flex-col items-start">
            <a
              href="#"
              className="relative mb-5 block aspect-[3/2] w-full md:mb-6"
            >
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 1"
                className="absolute size-full rounded-image object-cover"
              />
              <div className="text-small absolute top-4 right-4 flex min-w-28 flex-col items-center bg-scheme-foreground px-1 py-3 text-scheme-text">
                <span>Sat</span>
                <span className="heading-h4 font-bold">10</span>
                <span>Feb 2024</span>
              </div>
            </a>
            <Badge className="mb-3 md:mb-4">Techno</Badge>
            <a href="#">
              <h2 className="heading-h5 font-bold">Rave Under Stars</h2>
            </a>
            <p className="mb-2">Park</p>
            <p>
              Experience an epic evening filled with vibrant music and energy!
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
          <div className="flex flex-col items-start">
            <a
              href="#"
              className="relative mb-5 block aspect-[3/2] w-full md:mb-6"
            >
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 1"
                className="absolute size-full rounded-image object-cover"
              />
              <div className="text-small absolute top-4 right-4 flex min-w-28 flex-col items-center bg-scheme-foreground px-1 py-3 text-scheme-text">
                <span>Sun</span>
                <span className="heading-h4 font-bold">11</span>
                <span>Feb 2024</span>
              </div>
            </a>
            <Badge className="mb-3 md:mb-4">EDM</Badge>
            <a href="#">
              <h2 className="heading-h5 font-bold">Sunset Beats Festival</h2>
            </a>
            <p className="mb-2">Arena</p>
            <p>Dance to the sounds of top DJs as the sun sets!</p>
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
