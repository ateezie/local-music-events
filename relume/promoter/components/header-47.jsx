"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Header47() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col gap-5 md:flex-row md:gap-12 lg:gap-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Vibrant</p>
            <h1 className="heading-h1 font-bold">Your Dance Partner</h1>
          </div>
          <div className="w-full max-w-lg">
            <p className="text-medium">
              Meet our dedicated promoter, committed to bringing the best dance
              music events to Saint Louis. With a passion for connecting artists
              and fans, they curate unforgettable experiences that keep the
              energy alive.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button title="Learn More">Learn More</Button>
              <Button title="Contact" variant="secondary">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
