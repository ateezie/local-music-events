"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { ChevronRight, LocationOn, Schedule } from "relume-icons";

export function Career21() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid auto-cols-fr gap-12 lg:grid-cols-[0.75fr_1fr] lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">Promoters</p>
            <h2 className="heading-h2 mb-5 font-bold md:mb-6">
              Featured Promoters
            </h2>
            <p className="text-medium">
              Discover the top promoters in Saint Louis bringing you the best
              dance music events.
            </p>
          </div>
          <Tabs defaultValue="view-all" className="flex flex-col justify-start">
            <TabsList className="mb-12 ml-[-5vw] scrollbar-none flex w-screen items-center overflow-auto pl-[5vw] md:ml-0 md:block md:w-full md:overflow-hidden md:pl-0">
              <TabsTrigger
                value="view-all"
                className="rounded-button px-4 py-2"
              >
                View all
              </TabsTrigger>
              <TabsTrigger
                value="department-one"
                className="rounded-button px-4 py-2"
              >
                Local Talent
              </TabsTrigger>
              <TabsTrigger
                value="department-two"
                className="rounded-button px-4 py-2"
              >
                International Acts
              </TabsTrigger>
              <TabsTrigger
                value="department-three"
                className="rounded-button px-4 py-2"
              >
                Genre Mix
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="view-all"
              className="data-[state=active]:animate-tabs"
            >
              <div className="flex flex-col gap-6 md:gap-8">
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">
                          Event Organizer
                        </h3>
                      </a>
                      <Badge>Local</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Join our community of passionate promoters and elevate your
                    event experience.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Downtown</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Full Time</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">Event Planner</h3>
                      </a>
                      <Badge>Events</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Help shape the dance music scene by organizing unforgettable
                    events.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">U City</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Part Time</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">
                          Marketing Manager
                        </h3>
                      </a>
                      <Badge>Marketing</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Drive awareness and engagement for our events through
                    innovative marketing strategies.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Central</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Contract Work</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            <TabsContent
              value="department-one"
              className="data-[state=active]:animate-tabs"
            >
              <div className="flex flex-col gap-6 md:gap-8">
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">
                          Event Organizer
                        </h3>
                      </a>
                      <Badge>Local</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Join our community of passionate promoters and elevate your
                    event experience.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Downtown</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Full Time</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">Event Planner</h3>
                      </a>
                      <Badge>Events</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Help shape the dance music scene by organizing unforgettable
                    events.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">U City</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Part Time</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">
                          Marketing Manager
                        </h3>
                      </a>
                      <Badge>Marketing</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Drive awareness and engagement for our events through
                    innovative marketing strategies.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Central</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Contract Work</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            <TabsContent
              value="department-two"
              className="data-[state=active]:animate-tabs"
            >
              <div className="flex flex-col gap-6 md:gap-8">
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">
                          Event Organizer
                        </h3>
                      </a>
                      <Badge>Local</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Join our community of passionate promoters and elevate your
                    event experience.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Downtown</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Full Time</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">Event Planner</h3>
                      </a>
                      <Badge>Events</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Help shape the dance music scene by organizing unforgettable
                    events.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">U City</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Part Time</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">
                          Marketing Manager
                        </h3>
                      </a>
                      <Badge>Marketing</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Drive awareness and engagement for our events through
                    innovative marketing strategies.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Central</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Contract Work</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            <TabsContent
              value="department-three"
              className="data-[state=active]:animate-tabs"
            >
              <div className="flex flex-col gap-6 md:gap-8">
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">
                          Event Organizer
                        </h3>
                      </a>
                      <Badge>Local</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Join our community of passionate promoters and elevate your
                    event experience.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Downtown</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Full Time</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">Event Planner</h3>
                      </a>
                      <Badge>Events</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Help shape the dance music scene by organizing unforgettable
                    events.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">U City</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Part Time</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap justify-between gap-4 md:mb-8">
                    <div className="flex items-center gap-4">
                      <a href="#">
                        <h3 className="heading-h5 font-bold">
                          Marketing Manager
                        </h3>
                      </a>
                      <Badge>Marketing</Badge>
                    </div>
                    <Button
                      title="Apply Now"
                      variant="link"
                      size="link"
                      iconRight={<ChevronRight className="text-scheme-text" />}
                      asChild={true}
                    >
                      <a href="#">Apply Now</a>
                    </Button>
                  </div>
                  <p className="mb-5 md:mb-6">
                    Drive awareness and engagement for our events through
                    innovative marketing strategies.
                  </p>
                  <div className="flex flex-wrap gap-y-3">
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <LocationOn className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Central</span>
                    </div>
                    <div className="mr-6 flex items-center">
                      <div className="mr-3 flex-none">
                        <Schedule className="flex size-6 flex-col items-center justify-center text-scheme-text" />
                      </div>
                      <span className="text-medium">Contract Work</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
