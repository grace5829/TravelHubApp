import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { createContext } from "react";
import Header from "./header";
import { ThemeProvider, createGlobalStyle, styled } from "styled-components";
import Event from "./events";
import Guest from "./guest";


const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    }
`;
export type Guest = {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  age: number;
  amountDue: number;
  RSVP: "YES" | "NO" | "MAYBE" | "PENDING";
  id?: number;
  notes: string;
  event_id: number;
  event_name: string;
};
export type Event = {
  id: number;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  notes: string;
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
export default function App({ Component, pageProps }: AppProps) {
  const [guests, setGuests] = useState<Array<Guest>>([]);
  const [events, setEvents] = useState<Array<Event>>([]);

  const contextValue: GlobalContent = {
    guests,
    setGuests,
    events,
    setEvents,
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
    fetchEventData();
  }, [guests]);

    const theme = {
    colors: {
      primary: "#007bff",
      secondary: "#6c757d",
      background: "#f8f9fa",
      text: "#343a40",
    },
    typography: {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
    },
    spacing: {
      small: "8px",
      medium: "16px",
      large: "24px",
    },
  };
  return (
    <div>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <GuestsContext.Provider value={contextValue}>
          <Header/>
        <Component {...pageProps} />
          </GuestsContext.Provider>
      </ThemeProvider>
    </div>
  );
}
