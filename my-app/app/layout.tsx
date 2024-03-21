"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { createContext } from "react";
import Guest from "./guest/page";
import Header from "./header";

const inter = Inter({ subsets: ["latin"] });


export type Guest = {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  age: number;
  amountDue: number;
  RSVP: "YES" | "NO" | "MAYBE" | "PENDING";
  id?: number;
  notes: string;
  event_id:number;
  event_name:string|null
};
export type Event = {
name:string;
location:string;
start_date:string;
end_date:string;
notes:string
};
export type GlobalContent = {
  guests: Array<Guest>;
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  events: Array<Event>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};

export const GuestsContext = createContext<GlobalContent>({
  guests: [],
  setGuests: () => {},
  events: [],
  setEvents: () => {},
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [guests, setGuests] = useState<Array<Guest>>([]);
  const [events, setEvents] = useState<Array<Event>>([]);

  const contextValue: GlobalContent = {
    guests,
    setGuests,
    events,
    setEvents
  };

  const fetchGuestData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/guests", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setGuests(result.guests);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchEventData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/events", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      setEvents(result.events);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchGuestData();
    fetchEventData()
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
      <GuestsContext.Provider value={contextValue}>
        <Header/>
        {children}
    </GuestsContext.Provider>
        </body>
    </html>
  );
}
