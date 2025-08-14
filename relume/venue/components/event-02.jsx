"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export function Event2() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Events</p>
          <h1 className="heading-h2 mb-5 font-bold md:mb-6">Upcoming</h1>
          <p className="text-medium">
            Join us for electrifying dance music events at our venue this
            February!
          </p>
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
              Live DJ
            </TabsTrigger>
            <TabsTrigger
              value="category-two"
              className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
            >
              Special Guests
            </TabsTrigger>
            <TabsTrigger
              value="category-three"
              className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
            >
              Themed Nights
            </TabsTrigger>
            <TabsTrigger
              value="category-four"
              className="rounded-button px-4 py-2 data-[state=inactive]:border-transparent"
            >
              After Parties
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="view-all"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex flex-col gap-6 md:gap-8">
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Fri</span>
                  <span className="heading-h4 font-bold">09</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">DJ Night Fever</h2>
                    </a>
                    <Badge>Sold out</Badge>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sat</span>
                  <span className="heading-h4 font-bold">10</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Electro Dance Party
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sun</span>
                  <span className="heading-h4 font-bold">11</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Chill Vibes Night
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
            </div>
          </TabsContent>
          <TabsContent
            value="category-one"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex flex-col gap-6 md:gap-8">
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Fri</span>
                  <span className="heading-h4 font-bold">09</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">DJ Night Fever</h2>
                    </a>
                    <Badge>Sold out</Badge>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sat</span>
                  <span className="heading-h4 font-bold">10</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Electro Dance Party
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sun</span>
                  <span className="heading-h4 font-bold">11</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Chill Vibes Night
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
            </div>
          </TabsContent>
          <TabsContent
            value="category-two"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex flex-col gap-6 md:gap-8">
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Fri</span>
                  <span className="heading-h4 font-bold">09</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">DJ Night Fever</h2>
                    </a>
                    <Badge>Sold out</Badge>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sat</span>
                  <span className="heading-h4 font-bold">10</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Electro Dance Party
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sun</span>
                  <span className="heading-h4 font-bold">11</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Chill Vibes Night
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
            </div>
          </TabsContent>
          <TabsContent
            value="category-three"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex flex-col gap-6 md:gap-8">
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Fri</span>
                  <span className="heading-h4 font-bold">09</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">DJ Night Fever</h2>
                    </a>
                    <Badge>Sold out</Badge>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sat</span>
                  <span className="heading-h4 font-bold">10</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Electro Dance Party
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sun</span>
                  <span className="heading-h4 font-bold">11</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Chill Vibes Night
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
            </div>
          </TabsContent>
          <TabsContent
            value="category-four"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex flex-col gap-6 md:gap-8">
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Fri</span>
                  <span className="heading-h4 font-bold">09</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">DJ Night Fever</h2>
                    </a>
                    <Badge>Sold out</Badge>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sat</span>
                  <span className="heading-h4 font-bold">10</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Electro Dance Party
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
              <Card className="grid grid-cols-1 items-center gap-6 p-6 sm:px-8 md:grid-cols-[max-content_max-content_1fr_max-content] md:py-8">
                <div className="text-regular flex min-w-24 flex-col items-center">
                  <span>Sun</span>
                  <span className="heading-h4 font-bold">11</span>
                  <span>Feb 2024</span>
                </div>
                <div className="h-px w-full bg-scheme-border md:h-full md:w-px" />
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <a href="#">
                      <h2 className="heading-h5 font-bold">
                        Chill Vibes Night
                      </h2>
                    </a>
                  </div>
                  <p className="text-small mb-3 md:mb-4">Venue</p>
                  <p>Downtown Dance Hall, 123 Beat St, St. Louis, MO</p>
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
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
