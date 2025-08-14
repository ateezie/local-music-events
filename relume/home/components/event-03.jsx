"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export function Event3() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto flex w-full max-w-lg flex-col">
          <div className="mb-12 text-center md:mb-18 lg:mb-20">
            <h4 className="font-semibold">Vibe</h4>
            <h1 className="heading-h2 mt-3 font-bold md:mt-4">Events</h1>
            <p className="text-medium mt-5 md:mt-6">
              Discover the hottest upcoming dance music events happening in
              Saint Louis this February!
            </p>
          </div>
          <Tabs defaultValue="view-all" className="flex flex-col justify-start">
            <TabsList className="mb-12 scrollbar-none flex w-full items-center overflow-auto md:justify-center md:overflow-hidden">
              <TabsTrigger
                value="view-all"
                className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
              >
                View all
              </TabsTrigger>
              <TabsTrigger
                value="category-one"
                className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
              >
                House Beats
              </TabsTrigger>
              <TabsTrigger
                value="category-two"
                className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
              >
                Techno Nights
              </TabsTrigger>
              <TabsTrigger
                value="category-three"
                className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
              >
                Live DJs
              </TabsTrigger>
              <TabsTrigger
                value="category-four"
                className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
              >
                Festival Fun
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="view-all"
              className="data-[state=active]:animate-tabs"
            >
              <div className="grid grid-cols-1 items-center gap-8 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:py-8">
                <div className="relative aspect-[3/2] w-full shrink-0 md:aspect-square md:w-36">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 1"
                    className="absolute size-full object-cover"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">DJ Night Fever</h2>
                    </a>
                    <Badge>Sold out</Badge>
                  </div>
                  <div className="text-small mb-3 flex items-center md:mb-4">
                    <span>Fri 09 Feb 2024</span>
                    <span className="text-regular mx-2">•</span>
                    <span>Downtown</span>
                  </div>
                  <p>
                    Join us for an unforgettable night with top DJs and vibrant
                    dance music!
                  </p>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center justify-center"
                  >
                    Save my spot
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-8 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:py-8">
                <div className="relative aspect-[3/2] w-full shrink-0 md:aspect-square md:w-36">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 1"
                    className="absolute size-full object-cover"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">Rave Under Stars</h2>
                    </a>
                  </div>
                  <div className="text-small mb-3 flex items-center md:mb-4">
                    <span>Sat 10 Feb 2024</span>
                    <span className="text-regular mx-2">•</span>
                    <span>U City</span>
                  </div>
                  <p>
                    Experience a night filled with electrifying beats and an
                    amazing crowd!
                  </p>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center justify-center"
                  >
                    Save my spot
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-8 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:py-8">
                <div className="relative aspect-[3/2] w-full shrink-0 md:aspect-square md:w-36">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 1"
                    className="absolute size-full object-cover"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Sunday Chill Vibes
                      </h2>
                    </a>
                  </div>
                  <div className="text-small mb-3 flex items-center md:mb-4">
                    <span>Sun 11 Feb 2024</span>
                    <span className="text-regular mx-2">•</span>
                    <span>Soulard</span>
                  </div>
                  <p>
                    Wind down your weekend with smooth tunes and great company!
                  </p>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center justify-center"
                  >
                    Save my spot
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
