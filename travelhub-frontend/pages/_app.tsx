import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { createContext } from "react";
import Header from "./components/header";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import Event from "./events";


const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color:#111111;
    color:#f0e2d3;

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
  id?: number;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  notes: string;
};
export type Expense = {
  id?: number;
  name: string;
  description: string;
  total: number;
  event_id: number;
  event_name: string;
};
export type GlobalContent = {
  guests: Array<Guest>;
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  events: Array<Event>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  expenses: Array<Expense>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
};

export const EventInfoContext = createContext<GlobalContent>({
  guests: [],
  setGuests: () => {},
  events: [],
  setEvents: () => {},
  expenses: [],
  setExpenses: () => {},
});
export default function App({ Component, pageProps }: AppProps) {
  const [guests, setGuests] = useState<Array<Guest>>([]);
  const [events, setEvents] = useState<Array<Event>>([]);
  const [expenses, setExpenses] = useState<Array<Expense>>([]);

  const contextValue: GlobalContent = {
    guests,
    setGuests,
    events,
    setEvents,
    expenses, 
    setExpenses
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
  const fetchExpenseData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/expenses", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      setExpenses(result.expenses);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };


  useEffect(() => {
    fetchGuestData();
    fetchEventData();
    fetchExpenseData()
  }, []);

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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0" />      {/* <ThemeProvider theme={theme}> */}
        <GlobalStyle />
        <EventInfoContext.Provider value={contextValue}>
          <Header/>
        <Component {...pageProps} />
          </EventInfoContext.Provider>
      {/* </ThemeProvider> */}
    </div>
  );
}
