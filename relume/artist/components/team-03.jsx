"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { DribbbleLogo, LinkedinLogo, XLogo } from "relume-icons";

export function Team3() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Collaborators</p>
          <h2 className="heading-h2 mb-5 font-bold md:mb-6">Our Team</h2>
          <p className="text-medium">
            Meet the talented individuals behind the music.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4">
          <div className="flex flex-col items-start">
            <div className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-20 min-h-20 min-w-20 rounded-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-large font-semibold">Alex Johnson</h5>
              <h6 className="text-medium">Music Producer</h6>
            </div>
            <p>Crafting beats that make you move on the dance floor.</p>
            <div className="mt-6 flex gap-3.5">
              <a href="#">
                <LinkedinLogo className="size-6 text-scheme-text" />
              </a>
              <a href="#">
                <XLogo className="size-6 p-0.5 text-scheme-text" />
              </a>
              <a href="#">
                <DribbbleLogo className="size-6 text-scheme-text" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-20 min-h-20 min-w-20 rounded-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-large font-semibold">Sarah Lee</h5>
              <h6 className="text-medium">Event Manager</h6>
            </div>
            <p>
              Bringing unforgettable experiences to the Saint Louis dance scene.
            </p>
            <div className="mt-6 flex gap-3.5">
              <a href="#">
                <LinkedinLogo className="size-6 text-scheme-text" />
              </a>
              <a href="#">
                <XLogo className="size-6 p-0.5 text-scheme-text" />
              </a>
              <a href="#">
                <DribbbleLogo className="size-6 text-scheme-text" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-20 min-h-20 min-w-20 rounded-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-large font-semibold">Mike Brown</h5>
              <h6 className="text-medium">Social Media</h6>
            </div>
            <p>Connecting fans with the latest dance music happenings.</p>
            <div className="mt-6 flex gap-3.5">
              <a href="#">
                <LinkedinLogo className="size-6 text-scheme-text" />
              </a>
              <a href="#">
                <XLogo className="size-6 p-0.5 text-scheme-text" />
              </a>
              <a href="#">
                <DribbbleLogo className="size-6 text-scheme-text" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-20 min-h-20 min-w-20 rounded-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-large font-semibold">Emily Davis</h5>
              <h6 className="text-medium">Graphic Designer</h6>
            </div>
            <p>
              Creating vibrant visuals that capture the energy of our events.
            </p>
            <div className="mt-6 flex gap-3.5">
              <a href="#">
                <LinkedinLogo className="size-6 text-scheme-text" />
              </a>
              <a href="#">
                <XLogo className="size-6 p-0.5 text-scheme-text" />
              </a>
              <a href="#">
                <DribbbleLogo className="size-6 text-scheme-text" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-20 min-h-20 min-w-20 rounded-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-large font-semibold">Chris Wong</h5>
              <h6 className="text-medium">Sound Engineer</h6>
            </div>
            <p>Ensuring every performance sounds perfect for our audience.</p>
            <div className="mt-6 flex gap-3.5">
              <a href="#">
                <LinkedinLogo className="size-6 text-scheme-text" />
              </a>
              <a href="#">
                <XLogo className="size-6 p-0.5 text-scheme-text" />
              </a>
              <a href="#">
                <DribbbleLogo className="size-6 text-scheme-text" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-20 min-h-20 min-w-20 rounded-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-large font-semibold">Laura Smith</h5>
              <h6 className="text-medium">Marketing Specialist</h6>
            </div>
            <p>Promoting our artists and events to reach more fans.</p>
            <div className="mt-6 flex gap-3.5">
              <a href="#">
                <LinkedinLogo className="size-6 text-scheme-text" />
              </a>
              <a href="#">
                <XLogo className="size-6 p-0.5 text-scheme-text" />
              </a>
              <a href="#">
                <DribbbleLogo className="size-6 text-scheme-text" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-20 min-h-20 min-w-20 rounded-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-large font-semibold">We're hiring!</h5>
              <h6 className="text-medium">Join Us</h6>
            </div>
            <p>Be a part of our growing team in the dance music scene.</p>
            <div className="mt-6 flex gap-3.5">
              <a href="#">
                <LinkedinLogo className="size-6 text-scheme-text" />
              </a>
              <a href="#">
                <XLogo className="size-6 p-0.5 text-scheme-text" />
              </a>
              <a href="#">
                <DribbbleLogo className="size-6 text-scheme-text" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-20 min-h-20 min-w-20 rounded-full object-cover"
              />
            </div>
            <div className="mb-3 md:mb-4">
              <h5 className="text-large font-semibold">Open Positions</h5>
              <h6 className="text-medium">Apply Now</h6>
            </div>
            <p>Explore exciting opportunities to contribute to our mission.</p>
            <div className="mt-6 flex gap-3.5">
              <a href="#">
                <LinkedinLogo className="size-6 text-scheme-text" />
              </a>
              <a href="#">
                <XLogo className="size-6 p-0.5 text-scheme-text" />
              </a>
              <a href="#">
                <DribbbleLogo className="size-6 text-scheme-text" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 w-full max-w-md md:mt-20 lg:mt-24">
          <h4 className="heading-h4 mb-3 font-bold md:mb-4">We're hiring!</h4>
          <p className="text-medium">
            Join our dynamic team and make an impact!
          </p>
          <div className="mt-6 md:mt-8">
            <Button variant="secondary">Open positions</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
