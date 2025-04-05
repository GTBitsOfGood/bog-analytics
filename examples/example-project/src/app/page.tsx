"use client"
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
import { AnalyticsLogger, AnalyticsViewer, EventEnvironment } from 'bog-analytics';

export default function Home() {
  // Setting up loggers for each environment
  const [environment, setEnvironment] = React.useState("Development")
  const developmentLogger = new AnalyticsLogger({ environment: EventEnvironment.DEVELOPMENT });
  const stagingLogger = new AnalyticsLogger({ environment: EventEnvironment.STAGING });
  const productionLogger = new AnalyticsLogger({ environment: EventEnvironment.PRODUCTION });
  
  developmentLogger.authenticate(process.env.NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string);
  stagingLogger.authenticate(process.env.NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string);
  productionLogger.authenticate(process.env.NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string);

  let logger = developmentLogger

  // Setting up viewers for each environment
  const developmentViewer = new AnalyticsViewer({ environment: EventEnvironment.DEVELOPMENT });
  const stagingViewer = new AnalyticsViewer({ environment: EventEnvironment.STAGING });
  const productionViewer = new AnalyticsViewer({ environment: EventEnvironment.PRODUCTION });

  developmentViewer.authenticate(process.env.NEXT_PUBLIC_BOG_ANALYTICS_SERVER_API_KEY as string);
  stagingViewer.authenticate(process.env.NEXT_PUBLIC_BOG_ANALYTICS_SERVER_API_KEY as string);
  productionViewer.authenticate(process.env.NEXT_PUBLIC_BOG_ANALYTICS_SERVER_API_KEY as string);

  let viewer = developmentViewer

  // switch logger and viewer based on environment
  React.useEffect(() => {
      if (environment === "Production") {
        logger = productionLogger
        viewer = productionViewer
      } else if (environment === "Staging") {
        logger = stagingLogger
        viewer = stagingViewer
      } else if (environment === "Development") {
        logger = developmentLogger
        viewer = developmentViewer
      }
      console.log('Environment: ', environment)
  }, [environment]);

  const handleButton1 = () => {
    logger.logClickEvent({
      objectId: 'button-1',
      userId: (Math.random() + 1).toString(36).substring(7), // random uuid
    })
    console.log('Button 1 pressed')
  }

  const handleButton2 = () => {
    logger.logClickEvent({
      objectId: 'button-2',
      userId: (Math.random() + 1).toString(36).substring(7), // random uuid
    })
    console.log('Button 2 pressed')
  }

  const handleButton3 = () => {
    logger.logClickEvent({
      objectId: 'button-3',
      userId: (Math.random() + 1).toString(36).substring(7), // random uuid
    })
    console.log('Button 3 pressed')
  }

  let [inputValue, setInputValue] = React.useState("")
  const handleInputSubmit = () => {
    logger.logInputEvent({
      objectId: 'button-3',
      userId: (Math.random() + 1).toString(36).substring(7), // random uuid
      textValue: inputValue,
    })
    setInputValue("")
    console.log('Input Submitted')
  }

  const handleCustomEventButton = async() => {
    await logger.logCustomEvent("custom event category", "custom event subcategory", {prop1: "properties of custom event"})
    console.log('Custom Event Button Pressed')
  }

  const handleViewerButton = async() => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    console.log("Getting Logged Events..")
    let clickEvents = await viewer.getAllClickEvents('Bits of Good Example Project', fiveMinutesAgo)
    let inputEvents = await viewer.getAllInputEvents('Bits of Good Example Project', fiveMinutesAgo)
    let visitEvents = await viewer.getAllVisitEvents('Bits of Good Example Project', fiveMinutesAgo)
    let customEvents = await viewer.getAllCustomEvents('Bits of Good Example Project', 
      "custom event category", "custom event subcategory", fiveMinutesAgo)

    console.log("Click Events", clickEvents)
    console.log("Input Events", inputEvents)
    console.log("Visit Events", visitEvents)
    console.log("Custom Events", customEvents)
  }

  function getBrowserName(userAgent: string) {
    // The order matters here, and this may report false positives for unlisted browsers.
    if (userAgent.includes("Firefox")) {
        return "Mozilla Firefox";
    } else if (userAgent.includes("SamsungBrowser")) {
        return "Samsung Internet";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        return "Opera";
    } else if (userAgent.includes("Edge")) {
        return "Microsoft Edge (Legacy)";
    } else if (userAgent.includes("Edg")) {
        return "Microsoft Edge (Chromium)";
    } else if (userAgent.includes("Chrome")) {
        return "Google Chrome or Chromium";
    } else if (userAgent.includes("Safari")) {
        return "Apple Safari";
    } else {
        return "unknown";
    }
  }

  // logs visit input
  React.useEffect(() => {
    logger.logVisitEvent({
      userId: getBrowserName(navigator.userAgent),
      pageUrl: '/'
    });
  }, [])
  
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
          <Button onClick={handleButton1}>Button 1</Button>
          <Button onClick={handleButton2}>Button 2</Button>
          <Button onClick={handleButton3}>Button 3</Button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-xl font-medium mb-4">Input Events</p>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text" placeholder="Input" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
          <Button onClick={handleInputSubmit}>Submit</Button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xl font-medium mb-4">Visit Events</p>
        <p className="text-md mb-4">(Occurred when you visited this webpage)</p>
      </div>

      <div className="mb-8">
        <p className="text-xl font-medium mb-4">Custom Events</p>
        <Button onClick={handleCustomEventButton}>Click to Log Custom Event</Button>
      </div>

      <div className="mb-8">
        <p className="text-2xl mb-4">Change Logging Environment</p>
        <p className="text-md mb-4">Change the environment in which events are being logged (e.g., development, production)</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{environment} <SlArrowDown /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup value={environment} onValueChange={(e) => setEnvironment(e)}>
              <DropdownMenuRadioItem value="Development">Development</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Staging">Staging</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Production">Production</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <Button onClick={handleViewerButton}>Print Logged Events (from last 5 mins) in Console</Button>
      </div>
    </div>
  );
}
