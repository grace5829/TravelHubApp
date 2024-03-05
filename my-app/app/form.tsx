import { ChangeEvent, FormEvent, useContext, useState } from "react";
import styled from "styled-components";
import { Guest, GuestsContext } from "./page";

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: 170px 170px 170px 170px;
  row-gap: 10px;
  padding: 10px;
`;


export default function Form() {
  const { guests, setGuests } = useContext(GuestsContext);

  const [newGuest, setNewGuest] = useState<Guest>({
    firstName: "",
    lastName: "",
    gender: "female",
    age: 0,
    amountDue: 0,
    RSVP: "pending",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setNewGuest((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (setGuests) setGuests((values) => [...values, newGuest]);
  };

  return (
    <div>
      <FormWrapper >
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">
            First Name:
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={newGuest.firstName}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="lastName">
            Last Name:
            <input
              type="text"
              id="firstName"
              name="lastName"
              value={newGuest.lastName}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="age">
            Age:
            <input
              type="number"
              id="age"
              name="age"
              value={newGuest.age}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="amountDue">
            Amount Due:
            <input
              type="number"
              id="amountDue"
              name="amountDue"
              value={newGuest.amountDue}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="gender">
            Gender:
            <select id="gender" name="gender" onChange={handleChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </label>
          <label htmlFor="RSVP">
            RSVP:
            <select id="RSVP" name="RSVP" onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="maybe">Maybe</option>
            </select>
          </label>
        </form>
        <input type="submit" />
      </FormWrapper>

    </div>
  );
}