import { ChangeEvent, FormEvent, useContext, useState } from "react";
import styled from "styled-components";
import { Guest, GuestsContext } from "../page";
import React from "react";
const SidePanels = styled.span`
  z-index: 1;
  width: 30vw;
  padding: 10px;
  background: red;
  position: fixed;
  height: 100vh;
  right: 0;
  top: 0;
`;

const FormWrapper = styled.form`
  display: grid;
`;

export default function SidePanel({
  setHidden,
  hidden,
  currentGuest,
  setCurrentGuest
}: {
    setHidden: React.Dispatch<React.SetStateAction<boolean>>;
    hidden: boolean;
    currentGuest:Guest|null;
    setCurrentGuest:React.Dispatch<React.SetStateAction<Guest | null>>
}) {

  console.log("setAddGuest:", setHidden);
  console.log("addGuest:", hidden);
  const { guests, setGuests } = useContext(GuestsContext);
  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrentGuest((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentGuest),
      });

      if (!response.ok) {
        throw new Error(`Failed to update. Status: ${response.status}`);
      }

      const result = await response.json();
      setGuests(result.guests);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
    setHidden(!hidden);
  };
  return (
    <SidePanels>
      <FormWrapper onSubmit={handleSubmit}>
        <label htmlFor="firstName">
          First Name:
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={currentGuest?.firstName}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="lastName">
          Last Name:
          <input
            type="text"
            id="firstName"
            name="lastName"
            value={currentGuest?.lastName}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="age">
          Age:
          <input
            type="number"
            id="age"
            name="age"
            value={currentGuest?.age}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="amountDue">
          Amount Due:
          <input
            type="number"
            id="amountDue"
            name="amountDue"
            value={currentGuest?.amountDue}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="notes">
          Notes:
          <input
            type="text"
            id="notes"
            name="notes"
            value={currentGuest?.notes}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="gender">
          Gender:
          <select id="gender" name="gender" onChange={handleChange}>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </select>
        </label>
        <label htmlFor="RSVP">
          RSVP:
          <select id="RSVP" name="RSVP" onChange={handleChange}>
            <option value="PENDING">Pending</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
            <option value="MAYBE">Maybe</option>
          </select>
        </label>

        <input type="submit" />
      </FormWrapper>
    </SidePanels>
  );
}