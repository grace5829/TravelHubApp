import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { EventInfoContext, Guest } from "../_app";
import GuestForm from "./guestForm";

const TableWrapper = styled.div`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Heading = styled.h3`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const EachGuest = styled.div`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
  margin: 8px;
  padding: 6px;
  background: #f7f4f2;
  width: 23vw;
`;

const EachGuestInfo = styled.span`
  padding: 2px;
  display: flex;
  justify-content: center;
  color: black;
`;

export default function AllGuest({ config }: any) {
  const router = useRouter();
  const { guests, setGuests } = useContext(EventInfoContext);
  const [sidePanel, setSidePanel] = useState(false);
  const [method, setMethod] = useState("POST");
  const { slug, id } = router.query;
  const [event_name, setEvent_name] = useState(
    slug ? slug.toString() : "ERROR"
  );
  const [currentGuest, setCurrentGuest] = useState<Guest>({
    firstName: "",
    lastName: "",
    gender: "MALE",
    age: 0,
    amountDue: 0,
    RSVP: "PENDING",
    notes: "",
    event_id: Number(id),
    event_name: event_name,
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
    setMethod("PUT");
    setSidePanel(!sidePanel);
    setCurrentGuest(guest);
  };

  useEffect(() => {
    if (typeof slug === "string") {
      setEvent_name(slug);
    }
  }, [guests, slug]);

  const addGuest = () => {
    setMethod("POST");
    setSidePanel(!sidePanel);
  };
  return (
    <div>
      <Heading>{config.title}'s Guest List</Heading>
      {sidePanel ? (
        <GuestForm
          setHidden={setSidePanel}
          hidden={sidePanel}
          currentGuest={currentGuest}
          setCurrentGuest={setCurrentGuest}
          method={method}
        />
      ) : (
        <button onClick={() => addGuest()}> Add Guest</button>
      )}
      <TableWrapper>
        {config.filteredGuests.map((guest: Guest, index: number) => (
          <EachGuest key={guest.id}>
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
            {guest.notes ? (
              <EachGuestInfo>Notes: {guest.notes}</EachGuestInfo>
            ) : null}
            <EachGuestInfo>Event Name: {guest.event_name}</EachGuestInfo>
          </EachGuest>
        ))}
      </TableWrapper>
    </div>
  );
}
