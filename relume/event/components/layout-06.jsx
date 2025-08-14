"use client";

import React from "react";

export function Layout6() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-flow-row md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div>
            <h1 className="heading-h3 mb-5 font-bold md:mb-6">
              Discover the electrifying talent performing at our upcoming dance
              music event!
            </h1>
            <p className="text-medium mb-6 md:mb-8">
              Get ready to experience unforgettable performances from top
              artists in the dance music scene. Check out their latest tracks
              and mixes to get hyped for the event!
            </p>
            <div className="grid grid-cols-1 gap-6 py-2 sm:grid-cols-2">
              <div>
                <h6 className="heading-h6 mb-3 font-bold md:mb-4">
                  Featured Artists
                </h6>
                <p>
                  Listen to their tracks on YouTube and SoundCloud to feel the
                  vibe.
                </p>
              </div>
              <div>
                <h6 className="heading-h6 mb-3 font-bold md:mb-4">
                  Mixes Available
                </h6>
                <p>
                  Explore exclusive mixes on Mixcloud and get ready to dance!
                </p>
              </div>
            </div>
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full rounded-image object-cover"
              alt="Relume placeholder image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
