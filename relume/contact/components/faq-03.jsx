"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import React from "react";

export function Faq3() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[.75fr,1fr] lg:gap-x-20">
        <div>
          <h2 className="heading-h2 mb-5 font-bold md:mb-6">FAQs</h2>
          <p className="text-medium">
            Find answers to your questions about our events and services right
            here.
          </p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0">
            <AccordionTrigger className="text-medium md:py-5">
              How can I submit events?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              You can submit your events through our online form. Just provide
              the necessary details, and we'll review it. Make sure to include
              the date, location, and lineup!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-medium md:py-5">
              What types of events?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              We feature a variety of dance music events, including concerts,
              festivals, and club nights. Whether you're into house, techno, or
              EDM, we've got something for you. Check our events calendar for
              the latest updates!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-medium md:py-5">
              How do I buy tickets?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Tickets can be purchased directly through the event links on our
              website. We partner with various ticketing platforms to ensure a
              smooth buying experience. Don’t forget to check for any early bird
              specials!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-medium md:py-5">
              Can I get updates?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Absolutely! You can subscribe to our newsletter for the latest
              news and event announcements. Follow us on social media for
              real-time updates and exclusive content. Stay in the loop with
              What's The Move!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-medium md:py-5">
              Who can I contact?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              For any inquiries, you can reach out to our support team via the
              contact form. We aim to respond within 24 hours. Your feedback and
              questions are important to us!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
