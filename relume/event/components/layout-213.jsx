"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight, RelumeIcon } from "relume-icons";

export function Layout213() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-x-20">
          <div className="order-2 md:order-1">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full rounded-image object-cover"
              alt="Relume placeholder image"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="mb-5 md:mb-6">
              <RelumeIcon className="size-20 text-scheme-text" />
            </div>
            <h2 className="heading-h2 mb-5 font-bold md:mb-6">
              Choose Your Ticket Package for the Event
            </h2>
            <p className="text-medium">
              Explore our diverse ticket options designed to fit every budget.
              Whether you're a casual attendee or a dedicated fan, we have the
              perfect package for you!
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button title="Buy" variant="secondary">
                Buy
              </Button>
              <Button
                title="Learn More"
                variant="link"
                size="link"
                iconRight={<ChevronRight className="text-scheme-text" />}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
