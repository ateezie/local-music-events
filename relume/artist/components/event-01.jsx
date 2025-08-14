"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export function Event1() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Events</p>
            <h1 className="heading-h2 mb-5 font-bold md:mb-6">Upcoming</h1>
            <p className="text-medium">
              Catch the latest performances and dance music events featuring
              your favorite artists in Saint Louis.
            </p>
          </div>
        </div>
        <Tabs defaultValue="view-all" className="flex flex-col justify-start">
          <TabsList className="mb-12 ml-[-5vw] scrollbar-none flex w-screen items-center overflow-auto pl-[5vw] md:ml-0 md:w-full md:overflow-hidden md:pl-0">
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
              Concerts
            </TabsTrigger>
            <TabsTrigger
              value="category-two"
              className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
            >
              Festivals
            </TabsTrigger>
            <TabsTrigger
              value="category-three"
              className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
            >
              Clubs
            </TabsTrigger>
            <TabsTrigger
              value="category-four"
              className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
            >
              Special Events
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="view-all"
            className="data-[state=active]:animate-tabs"
          >
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Fri</span>
                <span className="heading-h4 font-bold">09</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Dance Party Night</h2>
                  </a>
                  <Badge>Sold out</Badge>
                </div>
                <p className="text-small mb-3 md:mb-4">Venue</p>
                <p>
                  Join us at the hottest venue in town for an unforgettable
                  night of music.
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sat</span>
                <span className="heading-h4 font-bold">10</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Live DJ Set</h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Club</p>
                <p>
                  Experience an electrifying night as our DJ spins the latest
                  tracks live!
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sun</span>
                <span className="heading-h4 font-bold">11</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">
                      Chill Vibes Session
                    </h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Lounge</p>
                <p>
                  Relax and unwind with smooth beats at our cozy lounge event
                  this Sunday.
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
          <TabsContent
            value="category-one"
            className="data-[state=active]:animate-tabs"
          >
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Fri</span>
                <span className="heading-h4 font-bold">09</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Dance Party Night</h2>
                  </a>
                  <Badge>Sold out</Badge>
                </div>
                <p className="text-small mb-3 md:mb-4">Venue</p>
                <p>
                  Join us at the hottest venue in town for an unforgettable
                  night of music.
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sat</span>
                <span className="heading-h4 font-bold">10</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Live DJ Set</h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Club</p>
                <p>
                  Experience an electrifying night as our DJ spins the latest
                  tracks live!
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sun</span>
                <span className="heading-h4 font-bold">11</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">
                      Chill Vibes Session
                    </h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Lounge</p>
                <p>
                  Relax and unwind with smooth beats at our cozy lounge event
                  this Sunday.
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
          <TabsContent
            value="category-two"
            className="data-[state=active]:animate-tabs"
          >
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Fri</span>
                <span className="heading-h4 font-bold">09</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Dance Party Night</h2>
                  </a>
                  <Badge>Sold out</Badge>
                </div>
                <p className="text-small mb-3 md:mb-4">Venue</p>
                <p>
                  Join us at the hottest venue in town for an unforgettable
                  night of music.
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sat</span>
                <span className="heading-h4 font-bold">10</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Live DJ Set</h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Club</p>
                <p>
                  Experience an electrifying night as our DJ spins the latest
                  tracks live!
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sun</span>
                <span className="heading-h4 font-bold">11</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">
                      Chill Vibes Session
                    </h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Lounge</p>
                <p>
                  Relax and unwind with smooth beats at our cozy lounge event
                  this Sunday.
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
          <TabsContent
            value="category-three"
            className="data-[state=active]:animate-tabs"
          >
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Fri</span>
                <span className="heading-h4 font-bold">09</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Dance Party Night</h2>
                  </a>
                  <Badge>Sold out</Badge>
                </div>
                <p className="text-small mb-3 md:mb-4">Venue</p>
                <p>
                  Join us at the hottest venue in town for an unforgettable
                  night of music.
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sat</span>
                <span className="heading-h4 font-bold">10</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Live DJ Set</h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Club</p>
                <p>
                  Experience an electrifying night as our DJ spins the latest
                  tracks live!
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sun</span>
                <span className="heading-h4 font-bold">11</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">
                      Chill Vibes Session
                    </h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Lounge</p>
                <p>
                  Relax and unwind with smooth beats at our cozy lounge event
                  this Sunday.
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
          <TabsContent
            value="category-four"
            className="data-[state=active]:animate-tabs"
          >
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Fri</span>
                <span className="heading-h4 font-bold">09</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Dance Party Night</h2>
                  </a>
                  <Badge>Sold out</Badge>
                </div>
                <p className="text-small mb-3 md:mb-4">Venue</p>
                <p>
                  Join us at the hottest venue in town for an unforgettable
                  night of music.
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sat</span>
                <span className="heading-h4 font-bold">10</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">Live DJ Set</h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Club</p>
                <p>
                  Experience an electrifying night as our DJ spins the latest
                  tracks live!
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
            <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-scheme-border py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
              <Card className="text-regular flex min-w-28 flex-col items-center px-1 py-3">
                <span>Sun</span>
                <span className="heading-h4 font-bold">11</span>
                <span>Feb 2024</span>
              </Card>
              <div className="flex w-full flex-col items-start justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                  <a href="#">
                    <h2 className="heading-h5 font-bold">
                      Chill Vibes Session
                    </h2>
                  </a>
                </div>
                <p className="text-small mb-3 md:mb-4">Lounge</p>
                <p>
                  Relax and unwind with smooth beats at our cozy lounge event
                  this Sunday.
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
    </section>
  );
}
