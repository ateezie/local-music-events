"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Cta3() {
  return (
    <section className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="relative z-10 container">
        <div className="w-full max-w-lg">
          <h2 className="heading-h2 mb-5 font-bold text-white md:mb-6">
            Host Your Event Here!
          </h2>
          <p className="text-medium text-white">
            Ready to make your event unforgettable? Contact us to book the venue
            today!
          </p>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
            <Button title="Inquire">Inquire</Button>
            <Button title="Book" variant="secondary-alt">
              Book
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
          className="size-full object-cover"
          alt="Relume placeholder image"
        />
        <div className="absolute inset-0 bg-neutral-darkest/50" />
      </div>
    </section>
  );
}
