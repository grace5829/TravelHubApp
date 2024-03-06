import styled from "styled-components";
import { useContext, useState } from "react";
import { Guest, GuestsContext } from "../page";
import SidePanel from "./sidePanel";

const TableWrapper = styled.span`
margin: 10px;
justify-content: center;
flex-wrap: wrap;
`;
const EachGuest = styled.div`
display: grid;
grid-template-columns: 30px 200px 100px 60px 100px 100px 250px 50px 50px;
`;
const EachGuestInfo = styled.span`
border: 1.5px solid black;
display: flex;
justify-content: center;
`;
export default function Table() {
    const { guests, setGuests } = useContext(GuestsContext);
    const [sidePanel, setSidePanel] =useState(false)
    const [currentGuest, setCurrentGuest] =useState<Guest | null>(null)
    const removeGuest= async (id:number|undefined)=>{
            try {
              const response = await fetch(`http://127.0.0.1:5000/guest/${id}`, {
                method: 'DELETE',  // Use the appropriate HTTP method
                headers: {
                  'Content-Type': 'application/json',
                  // Add any additional headers if required
                },
              });
      
              if (!response.ok) {
                throw new Error('Failed to fetch data');
              }
      
              const result = await response.json();
              setGuests(result.guests);
            } catch (error:any) {
              console.error('Error fetching data:', error.message);
            }
          };
    
const edit= (guest:Guest)=>{
    setSidePanel(!sidePanel) 
    setCurrentGuest(guest)
}

    return (
        <div>

        <TableWrapper>
        <EachGuest>
          <EachGuestInfo>#</EachGuestInfo>
          <EachGuestInfo>Name</EachGuestInfo>
          <EachGuestInfo>RSVP</EachGuestInfo>
          <EachGuestInfo>Age</EachGuestInfo>
          <EachGuestInfo>Gender</EachGuestInfo>
          <EachGuestInfo>Amount Due</EachGuestInfo>
          <EachGuestInfo>Notes</EachGuestInfo>
        </EachGuest>

        {guests.length>0? guests.map((guest, index) => (
          <EachGuest key={guest.id}>
            <EachGuestInfo>{index}</EachGuestInfo>
            <EachGuestInfo>
              {guest.firstName} {guest.lastName}
            </EachGuestInfo>
            <EachGuestInfo>{guest.RSVP}</EachGuestInfo>
            <EachGuestInfo>{guest.age} </EachGuestInfo>
            <EachGuestInfo>{guest.gender}</EachGuestInfo>
            <EachGuestInfo>${guest.amountDue}</EachGuestInfo>
            <EachGuestInfo>{guest.notes}</EachGuestInfo>
            <button onClick={()=>removeGuest(guest.id)}>-</button>
            <button onClick={()=>edit(guest)}>edit</button>
          </EachGuest>
        )) : 'no guest'}
      </TableWrapper>
      {sidePanel? <SidePanel setHidden={setSidePanel} hidden={sidePanel} currentGuest={currentGuest} setCurrentGuest={setCurrentGuest}/> : <div> false</div>}
      </div>

    );
  }
  