"use client";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Guest, GuestsContext } from "../layout";
import SidePanel from "./sidePanel";

const TableWrapper = styled.span`
  margin: 10px;
  display: flex;
`;
const EachGuest = styled.div`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
  margin: 8px;
  padding: 6px;
  background: #f7f4f2;
`;
const EachGuestInfo = styled.span`
  padding: 2px;
  display: flex;
  justify-content: center;
`;
export default function AllGuest() {
  const { guests, setGuests } = useContext(GuestsContext);
  const [sidePanel, setSidePanel] = useState(false);
  const [eventNames, setEventNames] = useState<String[]>([]);
  const [currentGuest, setCurrentGuest] = useState<Guest>({
    firstName: "",
    lastName: "",
    gender: "FEMALE",
    age: 0,
    amountDue: 0,
    RSVP: "PENDING",
    notes: "",
    event_id:0,
    event_name:null
  });

  const removeGuest = async (id: number | undefined) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/guest/${id}`, {
        method: "DELETE", // Use the appropriate HTTP method
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if required
        },
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

  const edit = (guest: Guest) => {
    setSidePanel(!sidePanel);
    setCurrentGuest(guest);
  };

const findEventName= async (eventId:number|undefined) =>{
  try {
    const response = await fetch(`http://127.0.0.1:5000/guestName/${eventId}`, {
      method: "GET", // Use the appropriate HTTP method
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if required
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
return result
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
  }

}

useEffect(() => {
console.log('running')
}, [guests]);


console.log(guests)

  return (
    <div>
      <TableWrapper>
        {guests
          ? guests.map((guest, index) => (
              <EachGuest key={guest.id}>
                <button>+</button>
                <button onClick={() => removeGuest(guest.id)}>-</button>
                <button onClick={() => edit(guest)}>edit</button>
                <span>#{index}</span>
                <EachGuestInfo>
                  <h3>
                    {" "}
                    {guest.firstName} {guest.lastName}
                  </h3>
                </EachGuestInfo>
                <EachGuestInfo>{guest.gender}</EachGuestInfo>
                <EachGuestInfo>Age: {guest.age} </EachGuestInfo>
                <EachGuestInfo>RSVP: {guest.RSVP}</EachGuestInfo>
                <EachGuestInfo>Amount due: ${guest.amountDue}</EachGuestInfo>
                <EachGuestInfo>Notes: {guest.notes}</EachGuestInfo>
                <EachGuestInfo>Event Name: {guest.event_name}</EachGuestInfo>
              </EachGuest>
            ))
          : "no guest"}
      </TableWrapper>
      {sidePanel ? (
        <SidePanel
          setHidden={setSidePanel}
          hidden={sidePanel}
          currentGuest={currentGuest}
          setCurrentGuest={setCurrentGuest}
          method="PUT"
        />
      ) : null}
    </div>
  );
}
