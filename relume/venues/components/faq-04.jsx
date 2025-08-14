"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";
import { Add } from "relume-icons";

export function Faq4() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg">
        <div className="md:mb-18 mb-12 text-center lg:mb-20">
          <h2 className="heading-h2 mb-5 font-bold md:mb-6">FAQs</h2>
          <p className="text-medium">
            Find answers to your questions about our venues and their offerings.
          </p>
        </div>
        <Accordion
          type="multiple"
          className="grid items-start justify-stretch gap-4"
        >
          <Card>
            <AccordionItem value="item-0" className="border-none px-5 md:px-6">
              <AccordionTrigger
                icon={
                  <Add className="text-scheme-text size-7 shrink-0 transition-transform duration-300 md:size-8" />
                }
                className="text-medium md:py-5 [&[data-state=open]>svg]:rotate-45"
              >
                What are the parking options?
              </AccordionTrigger>
              <AccordionContent className="md:pb-6">
                Most venues offer on-site parking, but availability can vary.
                Street parking is also an option, though it may require a short
                walk. Check individual venue websites for specific details.
              </AccordionContent>
            </AccordionItem>
          </Card>
          <Card>
            <AccordionItem value="item-1" className="border-none px-5 md:px-6">
              <AccordionTrigger
                icon={
                  <Add className="text-scheme-text size-7 shrink-0 transition-transform duration-300 md:size-8" />
                }
                className="text-medium md:py-5 [&[data-state=open]>svg]:rotate-45"
              >
                Are there age restrictions?
              </AccordionTrigger>
              <AccordionContent className="md:pb-6">
                Age restrictions depend on the venue and event type. Many venues
                are 21+ only, while some may allow all ages. Always verify the
                age policy on the event page before attending.
              </AccordionContent>
            </AccordionItem>
          </Card>
          <Card>
            <AccordionItem value="item-2" className="border-none px-5 md:px-6">
              <AccordionTrigger
                icon={
                  <Add className="text-scheme-text size-7 shrink-0 transition-transform duration-300 md:size-8" />
                }
                className="text-medium md:py-5 [&[data-state=open]>svg]:rotate-45"
              >
                What amenities are available?
              </AccordionTrigger>
              <AccordionContent className="md:pb-6">
                Amenities can include bars, food vendors, and restrooms. Some
                venues also provide seating areas and coat checks. Check the
                venue's website for a complete list of amenities.
              </AccordionContent>
            </AccordionItem>
          </Card>
          <Card>
            <AccordionItem value="item-3" className="border-none px-5 md:px-6">
              <AccordionTrigger
                icon={
                  <Add className="text-scheme-text size-7 shrink-0 transition-transform duration-300 md:size-8" />
                }
                className="text-medium md:py-5 [&[data-state=open]>svg]:rotate-45"
              >
                Is there security onsite?
              </AccordionTrigger>
              <AccordionContent className="md:pb-6">
                Yes, all venues have security personnel present during events.
                They are there to ensure a safe and enjoyable experience for
                everyone. Please follow their instructions for a smooth entry.
              </AccordionContent>
            </AccordionItem>
          </Card>
          <Card>
            <AccordionItem value="item-4" className="border-none px-5 md:px-6">
              <AccordionTrigger
                icon={
                  <Add className="text-scheme-text size-7 shrink-0 transition-transform duration-300 md:size-8" />
                }
                className="text-medium md:py-5 [&[data-state=open]>svg]:rotate-45"
              >
                Can I bring drinks?
              </AccordionTrigger>
              <AccordionContent className="md:pb-6">
                Outside drinks are typically not allowed in venues. Most venues
                offer a variety of beverages for purchase. Check the specific
                venue’s policy for any exceptions.
              </AccordionContent>
            </AccordionItem>
          </Card>
        </Accordion>
        <div className="md:mt-18 mx-auto mt-12 max-w-md text-center lg:mt-20">
          <h4 className="heading-h4 mb-3 font-bold md:mb-4">
            Still have questions?
          </h4>
          <p className="text-medium">We're here to help!</p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
