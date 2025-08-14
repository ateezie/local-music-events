"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Header71() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <div className="w-full max-w-lg">
              <h1 className="heading-h1 mb-5 font-bold md:mb-6">
                Discover the Hottest Dance Music Events in Saint Louis
              </h1>
              <p className="text-medium">
                Stay updated with the latest events, artists, and venues in your
                area.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
                <Button title="View">View</Button>
                <Button title="Explore" variant="secondary">
                  Explore
                </Button>
              </div>
            </div>
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
              className="size-full rounded-image object-cover"
              alt="Relume placeholder image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
