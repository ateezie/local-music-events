"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Event9() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-end gap-12 md:mb-18 md:grid-cols-[1fr_max-content] lg:mb-20 lg:gap-20">
          <div className="max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Events</p>
            <h1 className="heading-h2 mb-3 font-bold md:mb-4">Events</h1>
            <p className="text-medium">
              Check out the latest dance music events!
            </p>
          </div>
          <Button
            variant="secondary"
            title="View all"
            className="hidden md:flex"
          >
            View all
          </Button>
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
              <h2 className="heading-h5 font-bold">Friday Night Beats</h2>
            </a>
            <p className="mb-2">Club</p>
            <p>Join us for an unforgettable night of house music.</p>
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
              <h2 className="heading-h5 font-bold">Saturday Night Vibes</h2>
            </a>
            <p className="mb-2">Lounge</p>
            <p>Experience the best techno DJs in the city.</p>
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
              <h2 className="heading-h5 font-bold">Sunday Funday Rave</h2>
            </a>
            <p className="mb-2">Arena</p>
            <p>Dance the day away with top EDM artists.</p>
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
        <div className="mt-12 flex justify-end md:mt-14 md:hidden">
          <Button variant="secondary" title="View all">
            View all
          </Button>
        </div>
      </div>
    </section>
  );
}
