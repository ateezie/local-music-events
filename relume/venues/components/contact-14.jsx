"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { Call, ChevronRight, LocationOn, Mail } from "relume-icons";

export function Contact14() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Connect</p>
          <h2 className="heading-h2 mb-5 font-bold md:mb-6">Get in Touch</h2>
          <p className="text-medium">
            Reach out to your favorite venues for inquiries.
          </p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-[0.5fr_1fr] md:gap-x-20 md:gap-y-16">
          <div className="grid auto-cols-fr grid-cols-1 gap-x-4 gap-y-10">
            <div>
              <div className="mb-3 md:mb-4">
                <Mail className="size-8 text-scheme-text" />
              </div>
              <h3 className="heading-h6 mb-2 font-bold">Email</h3>
              <p className="mb-2">info@venues.com</p>
              <a className="underline" href="#">
                hello@relume.io
              </a>
            </div>
            <div>
              <div className="mb-3 md:mb-4">
                <Call className="size-8 text-scheme-text" />
              </div>
              <h3 className="heading-h6 mb-2 font-bold">Phone</h3>
              <p className="mb-2">Call us anytime!</p>
              <a className="underline" href="#">
                +1 (555) 000-0000
              </a>
            </div>
            <div>
              <div className="mb-3 md:mb-4">
                <LocationOn className="size-8 text-scheme-text" />
              </div>
              <h3 className="heading-h6 mb-2 font-bold">Office</h3>
              <p className="mb-2">123 Sample St, Saint Louis, MO 63101</p>
              <div className="mt-5 md:mt-6">
                <Button
                  title="Get Directions"
                  variant="link"
                  size="link"
                  iconRight={<ChevronRight className="text-scheme-text" />}
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
          <a href="#" className="justify-self-end md:w-[321.6px] lg:w-auto">
            <img
              src="https://relume-assets.s3.us-east-1.amazonaws.com/placeholder-map-image.svg"
              alt="Relume placeholder map image"
              className="size-full h-[400px] object-cover md:h-[516px]"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
