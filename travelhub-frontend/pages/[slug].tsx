import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Guest, GuestsContext } from "./_app";
import SidePanel from "./components/guestForm";
import { useRouter } from "next/router";

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
  flex-wrap: wrap;
  justify-content: center;
  color: black;
`;

export default function DynamicPage() {
  const router = useRouter();
  const { guests, setGuests } = useContext(GuestsContext);
  const [sidePanel, setSidePanel] = useState(false);
  const { slug, id } = router.query;
  const [method, setMethod] = useState("POST");
  const [event_name, setEvent_name] = useState(slug? slug.toString(): 'ERROR');
  const [filteredGuests, setFilteredGuests] = useState(guests);
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
    setMethod('PUT')
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
    if(typeof slug==='string'){
      setEvent_name( slug.toString())
    }
    filterGuests(slug, guests);
  }, [guests]);


  const addGuest=()=>{
    setMethod("POST")
    setSidePanel(!sidePanel)
  }
  return (
    <div>
      <Heading>{event_name[0].toUpperCase()+event_name.slice(1)}'s Guest List</Heading>
        {sidePanel ? (
          <SidePanel
          setHidden={setSidePanel}
          hidden={sidePanel}
          currentGuest={currentGuest}
          setCurrentGuest={setCurrentGuest}
          method={method}
          />
          ) : 
          <button onClick={() =>addGuest()}> Add Guest</button>
        }
      <TableWrapper>
        {filteredGuests.length>0
          ? filteredGuests.map((guest, index) => (
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
                <EachGuestInfo>Notes: {guest.notes}</EachGuestInfo>
                <EachGuestInfo>Event Name: {guest.event_name}</EachGuestInfo>
              </EachGuest>
            ))
          : "no guest"}
      </TableWrapper>
    </div>
  );
}
