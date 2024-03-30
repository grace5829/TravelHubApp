import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Guest, GuestsContext } from "../_app";
import SidePanel from "./sidePanel";
import { useRouter } from "next/router";

const TableWrapper = styled.div`
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
  flex-wrap: wrap;
  justify-content: center;
  color: black;
`;
export default function AllGuest() {
  const router = useRouter();
  const { slug, id } = router.query;
  const { guests, setGuests } = useContext(GuestsContext);
  const [sidePanel, setSidePanel] = useState(false);
  const [newGuestId, setNewGuestId] = useState(Number(id));
//   const [newGuestEventName, setNewEventName] = useState(slug?.toString());
  const [filteredGuests, setFilteredGuests] = useState(guests);
  const [currentGuest, setCurrentGuest] = useState<Guest>({
    firstName: "",
    lastName: "",
    gender: "MALE",
    age: 0,
    amountDue: 0,
    RSVP: "PENDING",
    notes: "",
    event_id: newGuestId,
    event_name:typeof slug === 'string'? slug : "",
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

  const filterGuests = (criteria: any, guests:Guest[]) => {
    const filteredList = guests.filter((guest) => {
      return guest.event_name?.toLowerCase() === criteria;
    });
    setFilteredGuests(filteredList);
  };

  useEffect(() => {
    filterGuests(slug, guests);
  }, [guests]);

  return (
    <div>
      <TableWrapper>
        {filteredGuests.length>0
          ? filteredGuests.map((guest, index) => (
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
          event_name={slug}
          event_id={newGuestId}
        />
      ) : null}
    </div>
  );
}