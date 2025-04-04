"use client"
import Image from "next/image";
import * as React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SlArrowDown } from "react-icons/sl";


export default function Home() {
  const buttonClick = () => {
    alert("Button Pressed");
  }
  const [environment, setEnvironment] = React.useState("Development")

  return (
    <div className="flex flex-col justify-items-center min-h-screen p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mb-4"> 
        <p className="text-5xl mb-4">Example Project</p>
        <p className="text-lg mb-2">An example project showcasing BoG Analytics API + npm package</p>
        <p className="text-lg">The npm package can be used to log events client-side for:</p>
      </div>
       
      <div className="mb-4">
        <p className="text-xl font-medium mb-4">Click Events</p>
        <div className="flex gap-6">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xl font-medium mb-4">Input Events</p>
        <Input className="w-50" placeholder="Input"/>
      </div>

      <div className="mb-4">
        <p className="text-xl font-medium mb-4">Visit Events</p>
        <p className="text-md mb-4">(Occurred when you visited this webpage)</p>
      </div>

      <div className="mb-8">
        <p className="text-xl font-medium mb-4">Custom Events</p>
        <Button>Custom Event Button</Button>
      </div>

      <div className="mb-4">
        <p className="text-2xl mb-4">Change Logging Environment</p>
        <p className="text-md mb-4">Change the environment in which events are being logged (e.g., development, production)</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{environment} <SlArrowDown /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup value={environment} onValueChange={setEnvironment}>
              <DropdownMenuRadioItem value="Development">Development</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Staging">Staging</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Production">Production</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
