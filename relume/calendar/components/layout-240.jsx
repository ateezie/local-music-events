"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Layout240() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <h2 className="heading-h3 font-bold">
            Discover Your Next Dance Music Event with Our Calendar
          </h2>
        </div>
        <div className="grid grid-cols-1 items-start justify-center gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          <div className="flex w-full flex-col items-center text-center">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Find Events by Venue, Genre, and Artists Easily
            </h3>
            <p>
              Our calendar makes it simple to explore upcoming dance music
              events tailored to your tastes.
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
          <div className="flex w-full flex-col items-center text-center">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Filter Events to Match Your Unique Music Preferences
            </h3>
            <p>
              Use our filtering options to narrow down events by your favorite
              genres and artists.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button
                iconRight={<ChevronRight className="text-scheme-text" />}
                variant="link"
                size="link"
              >
                Filter
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col items-center text-center">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Stay Updated with Real-Time Event Notifications
            </h3>
            <p>Sign up for alerts to never miss out on your favorite shows.</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button
                iconRight={<ChevronRight className="text-scheme-text" />}
                variant="link"
                size="link"
              >
                Notify
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
