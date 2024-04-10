import { ChangeEvent, FormEvent, useContext } from "react";
import styled from "styled-components";
import React from "react";
import { Event, GuestsContext } from "../_app";

const SidePanels = styled.span`
  z-index: 1;
  width: 30vw;
  padding: 10px;
  background: gray;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
`;

const FormWrapper = styled.form`
  display: grid;
`;

export default function EventForm({
  setHidden,
  hidden,
  currentEvent,
  setCurrentEvent,
  method,
}: {
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
  currentEvent: Event;
  setCurrentEvent: React.Dispatch<React.SetStateAction<Event>>;
  method: string;
}) {


  const { setEvents } = useContext(GuestsContext);
  const defaultEvent: Event = {
    name: "",
    location: "",
    start_date: "",
    end_date: "",
    notes: "",
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
  
      setCurrentEvent((values) => ({ ...values, [name]: value }));
    
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentEvent.name.trim() || !currentEvent.location.trim()) {
      let errorMessage = "";
      if (!currentEvent.name.trim()) {
        errorMessage += "Please enter an event name.\n";
      }
      if (!currentEvent.location.trim()) {
        errorMessage += "Please enter a location.\n";
      }
      alert(errorMessage);
      return;
    }
    console.log(currentEvent);
    let API;
    if (method === "POST") {
      API = `http://127.0.0.1:5000/events`;
    } else {
      API = `http://127.0.0.1:5000/events/${currentEvent.id}`;
    }
    try {
      const response = await fetch(API, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentEvent),
      });

      if (!response.ok) {
        throw new Error(`Failed to update. Status: ${response.status}`);
      }

      const result = await response.json();
      setEvents(result.events);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }

    if (method === "POST") {
      setCurrentEvent(defaultEvent);
    }
    setHidden(!hidden);
  };

  const hideSideBar = () => {
    setHidden(!hidden);
    setCurrentEvent(defaultEvent);
  };

  return (
    <SidePanels>
      <button onClick={() => hideSideBar()}>X</button>
      <FormWrapper onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            value={currentEvent.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="location">
          Location:
          <input
            type="text"
            name="location"
            value={currentEvent.location}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="start_date">
          Start date:
          <input
            type="date"
            name="start_date"
            // value={formatDate(currentEvent.start_date)}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="end_date">
          End date:
          <input
            type="date"
            name="end_date"
            // value={formatDate(currentEvent.end_date)}
            onChange={handleChange}
          />
        </label>
        <input type="submit" />
      </FormWrapper>
    </SidePanels>
  );
}
