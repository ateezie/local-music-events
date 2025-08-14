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
              Explore the Best Dance Music Events in Saint Louis
            </h2>
          </div>
          <div>
            <p className="text-medium">
              Dive into a vibrant world of dance music events tailored just for
              you. Our platform helps you discover the hottest parties and gigs
              happening in Saint Louis. Stay updated and never miss out on an
              unforgettable night!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 lg:gap-x-12">
          <div>
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Connect with Your Favorite DJs and Artists
            </h3>
            <p>Get to know the talent behind the decks and their music.</p>
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
          <div>
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Join a Thriving Community of Dance Music Lovers
            </h3>
            <p>
              Become part of a passionate network that shares your love for
              dance music.
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
          <div>
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-12 text-scheme-text" />
            </div>
            <h3 className="heading-h5 mb-3 font-bold md:mb-4">
              Stay Informed with the Latest Dance Music News
            </h3>
            <p>Get exclusive updates on events, new releases, and more.</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button
                iconRight={<ChevronRight className="text-scheme-text" />}
                variant="link"
                size="link"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
