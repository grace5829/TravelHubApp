"use client";
import { useEffect, useState } from "react";
import { createContext } from "react";
import Form from "./guest/form";
import Guest from "./guest/page";


export type Guest = {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  age: number;
  amountDue: number;
  RSVP:'YES'|'NO'|'MAYBE'|'PENDING';
  id?:number,
  notes:string,
};
export type GlobalContent = {
  guests: Array<Guest> ;
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
};



export const GuestsContext = createContext<GlobalContent>({
  guests: [],
  setGuests: () => {},
});


export default function Home() {
  const [guests, setGuests] = useState<Array<Guest> >([]);
  const [data, setData] = useState(null);

  const contextValue: GlobalContent = {
    guests,
    setGuests,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/guests', {
          method: 'GET',  // Use the appropriate HTTP method
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setGuests(result.guests);
      } catch (error:any) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, []); 


  return (
    <GuestsContext.Provider value={contextValue}>
      <Guest/>
    </GuestsContext.Provider>
  );
}
