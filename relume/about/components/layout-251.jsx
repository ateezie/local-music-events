"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Layout251() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start gap-5 md:mb-18 md:grid-cols-2 md:gap-x-12 lg:mb-20 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">Vibe</p>
            <h2 className="heading-h2 font-bold">
              Discover the Pulse of Saint Louis Dance Music
            </h2>
          </div>
          <div>
            <p className="text-medium">
              At 'What's The Move?', we curate the best dance music events in
              Saint Louis, ensuring you never miss a beat. Our platform connects
              you with the hottest parties and underground shows, tailored to
              your taste. Join a community that celebrates the rhythm and energy
              of dance music.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 lg:gap-x-12">
          <div>
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h4 mb-5 font-bold md:mb-6">
              Curated Events for Every Dance Music Lover
            </h3>
            <p>We handpick events to match your vibe.</p>
          </div>
          <div>
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h4 mb-5 font-bold md:mb-6">
              Exclusive DJ Insights and Behind-the-Scenes Access
            </h3>
            <p>Get insider knowledge directly from the artists.</p>
          </div>
          <div>
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h4 mb-5 font-bold md:mb-6">
              Engage with Our Thriving Dance Music Community
            </h3>
            <p>Connect with fellow fans and share experiences.</p>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-4 md:mt-18 lg:mt-20">
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
    </section>
  );
}
