"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Header44() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="w-full max-w-lg">
          <p className="mb-3 font-semibold md:mb-4">Vibes</p>
          <h1 className="heading-h1 mb-5 font-bold md:mb-6">
            Dance Music Events
          </h1>
          <p className="text-medium">
            Experience the pulse of Saint Louis with electrifying dance music
            events that ignite your spirit.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
            <Button title="Explore">Explore</Button>
            <Button title="Join" variant="secondary">
              Join
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
