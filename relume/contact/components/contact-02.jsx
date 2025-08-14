"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export function Contact2() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg">
        <div className="mx-auto mb-8 w-full max-w-lg text-center md:mb-10 lg:mb-12">
          <p className="mb-3 font-semibold md:mb-4">Connect</p>
          <h2 className="heading-h2 mb-5 font-bold md:mb-6">Get in Touch</h2>
          <p className="text-medium">We'd love to hear from you!</p>
        </div>
        <form className="grid grid-cols-1 grid-rows-[auto_auto] gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="grid w-full items-center">
              <Label htmlFor="firstName" className="mb-2">
                First Name
              </Label>
              <Input type="text" id="firstName" />
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="lastName" className="mb-2">
                Last Name
              </Label>
              <Input type="text" id="lastName" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid w-full items-center">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input type="email" id="email" />
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="phone" className="mb-2">
                Phone Number
              </Label>
              <Input type="text" id="phone" />
            </div>
          </div>
          <div className="grid w-full items-center">
            <Label className="mb-2">Select a Topic</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose one..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first-choice">First Choice</SelectItem>
                <SelectItem value="second-choice">Second Choice</SelectItem>
                <SelectItem value="third-choice">Third Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center py-3 md:py-4">
            <Label className="mb-3 md:mb-4">Tell us about yourself</Label>
            <RadioGroup className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Event Inquiry" id="#first_choice" />
                <Label htmlFor="#first_choice">Event Inquiry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="First choice" id="#second_choice" />
                <Label htmlFor="#second_choice">General Feedback</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="First choice" id="#third_choice" />
                <Label htmlFor="#third_choice">Partnership Opportunity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="First choice" id="#fourth_choice" />
                <Label htmlFor="#fourth_choice">Technical Support</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="First choice" id="#fifth_choice" />
                <Label htmlFor="#fifth_choice">Other Inquiry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="First choice" id="#other" />
                <Label htmlFor="#other">Details</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid w-full items-center">
            <Label htmlFor="message" className="mb-2">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Write your message..."
              className="min-h-[11.25rem] overflow-auto"
            />
          </div>
          <div className="text-small mb-3 flex items-center space-x-2 md:mb-4">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="cursor-pointer">
              I agree to Terms
            </Label>
          </div>
          <div className="text-center">
            <Button title="Submit">Submit</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
