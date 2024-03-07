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
};
export type GlobalContent = {
  guests: Array<Guest>;
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
};

export const GuestsContext = createContext<GlobalContent>({
  guests: [],
  setGuests: () => {},
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [guests, setGuests] = useState<Array<Guest>>([]);

  const contextValue: GlobalContent = {
    guests,
    setGuests,
  };

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
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
