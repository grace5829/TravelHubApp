"use client";
import { useState } from "react";
import { createContext } from "react";
import Form from "./form";


export type Guest = {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  amountDue: number;
  RSVP:'yes'|'no'|'maybe'|'pending'
};
export type GlobalContent = {
  guests: Array<Guest> | null;
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>> | null;
};

export const GuestsContext = createContext<GlobalContent>({
  guests: null,
  setGuests: () => {},
});

export default function Home() {
  const [guests, setGuests] = useState<Array<Guest>>([
    {
      firstName: "Person",
      lastName: "1",
      gender: "female",
      age: 27,
      amountDue: 100,
      RSVP:'pending'
    },
    {
      firstName: "Person",
      lastName: "2",
      gender: "male",
      age: 23,
      amountDue: 0,
      RSVP:'pending'
    },
  ]);
  const contextValue: GlobalContent = {
    guests,
    setGuests,
  };
  return (
    <GuestsContext.Provider value={contextValue}>
      <Form/>
    </GuestsContext.Provider>
  );
}
