"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Layout239() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="mb-12 text-center md:mb-18 lg:mb-20">
            <div className="w-full max-w-lg">
              <p className="mb-3 font-semibold md:mb-4">Support</p>
              <h2 className="heading-h2 mb-5 font-bold md:mb-6">
                Follow Your Favorite Artists and Stay Connected
              </h2>
              <p className="text-medium">
                Stay in the loop by subscribing to your favorite artists'
                channels. Engage with their latest mixes and updates to support
                their journey.
              </p>
            </div>
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
              <h3 className="heading-h4 mb-5 font-bold md:mb-6">
                Join Upcoming Events and Experience Live Music
              </h3>
              <p>Attend their events to show your support.</p>
            </div>
            <div className="flex w-full flex-col items-center text-center">
              <div className="mb-6 md:mb-8">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image"
                  className="rounded-image"
                />
              </div>
              <h3 className="heading-h4 mb-5 font-bold md:mb-6">
                Connect on Social Media for Exclusive Content
              </h3>
              <p>Follow them on social platforms for updates.</p>
            </div>
            <div className="flex w-full flex-col items-center text-center">
              <div className="mb-6 md:mb-8">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image"
                  className="rounded-image"
                />
              </div>
              <h3 className="heading-h4 mb-5 font-bold md:mb-6">
                Discover New Mixes and Share the Vibe
              </h3>
              <p>Explore their latest mixes and share with friends.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
            <Button variant="secondary">Learn More</Button>
            <Button
              iconRight={<ChevronRight className="text-scheme-text" />}
              variant="link"
              size="link"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
