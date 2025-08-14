"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Header65() {
  return (
    <section className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="relative z-10 container max-w-lg text-center">
        <p className="mb-3 font-semibold text-white md:mb-4">Connect</p>
        <h1 className="heading-h1 mb-5 font-bold text-white md:mb-6">
          Get in Touch
        </h1>
        <p className="text-medium text-white">
          We’d love to hear from you! Reach out with any questions or feedback.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
          <Button title="Submit">Submit</Button>
          <Button title="Inquire" variant="secondary-alt">
            Inquire
          </Button>
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
