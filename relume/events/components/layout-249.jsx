"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Layout249() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Discover</p>
            <h2 className="heading-h2 mb-5 font-bold md:mb-6">
              Find Your Next Dance Music Event Easily
            </h2>
            <p className="text-medium">
              Our platform simplifies the process of discovering dance music
              events in Saint Louis. With just a few clicks, you can explore,
              purchase tickets, and set reminders for your favorite shows.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          <div className="flex w-full flex-col">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h4 mb-5 font-bold md:mb-6">
              How to Search for Events
            </h3>
            <p>
              Use our search feature to filter events by date, genre, and
              location.
            </p>
          </div>
          <div className="flex w-full flex-col">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h4 mb-5 font-bold md:mb-6">
              Purchasing Tickets Made Simple
            </h3>
            <p>
              Easily buy tickets directly through our website with secure
              payment options.
            </p>
          </div>
          <div className="flex w-full flex-col">
            <div className="mb-6 md:mb-8">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image"
                className="rounded-image"
              />
            </div>
            <h3 className="heading-h4 mb-5 font-bold md:mb-6">
              Stay Updated with Event Reminders
            </h3>
            <p>Set reminders for events so you never miss out.</p>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-4 md:mt-14 lg:mt-16">
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
