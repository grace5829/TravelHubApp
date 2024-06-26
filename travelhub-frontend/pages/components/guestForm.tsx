import { ChangeEvent, FormEvent, useContext } from "react";
import styled from "styled-components";
import React from "react";
import { Guest, EventInfoContext } from "../_app";

const GuestForms = styled.span`
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

export default function GuestForm({
  setHidden,
  hidden,
  currentGuest,
  setCurrentGuest,
  method,
}: {
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
  currentGuest: Guest;
  setCurrentGuest: React.Dispatch<React.SetStateAction<Guest>>;
  method: string;
}) {
  const { guests, setGuests, events } = useContext(EventInfoContext);
  const defaultGuest: Guest = {
    firstName: "",
    lastName: "",
    gender: "FEMALE",
    age: 0,
    amountDue: 0,
    RSVP: "PENDING",
    notes: "",
    event_id: currentGuest.event_id,
    event_name: currentGuest.event_name,
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "event_id") {
      setCurrentGuest((values) => ({ ...values, [name]: Number(value) }));
    } else {
      setCurrentGuest((values) => ({ ...values, [name]: value }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentGuest.firstName.trim() || !currentGuest.lastName.trim()) {
      let errorMessage = "";
      if (!currentGuest.firstName.trim()) {
        errorMessage += "Please enter a first name.\n";
      }
      if (!currentGuest.lastName.trim()) {
        errorMessage += "Please enter a last name.\n";
      }
      alert(errorMessage);
      return;
    }

    let API;
    if (method === "POST") {
      API = `http://127.0.0.1:5000/guests`;
    } else {
      API = `http://127.0.0.1:5000/guests/${currentGuest.id}`;
    }
    try {
      const response = await fetch(API, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentGuest),
      });

      if (!response.ok) {
        throw new Error(`Failed to update. Status: ${response.status}`);
      }

      const result = await response.json();
      let updatedList;

      if (method === "POST") {
        updatedList = [...guests, result];
      } else {
        updatedList = guests.map((guest) =>
          guest.id === result.id ? result : guest
        );
      }
      setGuests(updatedList);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }

    setCurrentGuest(defaultGuest);
    setHidden(!hidden);
  };

  const hideSideBar = () => {
    setHidden(!hidden);
    setCurrentGuest(defaultGuest);
  };

  return (
    <GuestForms>
      <button onClick={() => hideSideBar()}>X</button>
      <FormWrapper onSubmit={handleSubmit}>
        <label htmlFor="firstName">
          First Name:
          <input
            type="text"
            name="firstName"
            value={currentGuest?.firstName}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="lastName">
          Last Name:
          <input
            type="text"
            name="lastName"
            value={currentGuest?.lastName}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="age">
          Age:
          <input
            type="number"
            name="age"
            value={currentGuest?.age}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="amountDue">
          Amount Due:
          <input
            type="number"
            name="amountDue"
            value={currentGuest?.amountDue}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="notes">
          Notes:
          <input
            type="text"
            name="notes"
            value={currentGuest?.notes}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="gender">
          Gender:
          <select
            name="gender"
            onChange={handleChange}
            defaultValue={currentGuest.gender.toUpperCase()}
          >
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </select>
        </label>
        <label htmlFor="RSVP">
          RSVP:
          <select
            name="RSVP"
            onChange={handleChange}
            value={currentGuest.RSVP.toUpperCase()}
          >
            <option value="PENDING">Pending</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
            <option value="MAYBE">Maybe</option>
          </select>
        </label>
        <label htmlFor="event_id">
          EVENT_ID:
          <select
            name="event_id"
            onChange={handleChange}
            value={currentGuest.event_id}
          >
            {events.map((event) => (
              <option value={event.id} key={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </label>

        <input type="submit" />
      </FormWrapper>
    </GuestForms>
  );
}
