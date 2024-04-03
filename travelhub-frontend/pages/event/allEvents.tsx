import styled from "styled-components";
import { useContext, useState } from "react";
import Link from "next/link";
import { GuestsContext } from "../_app";
import EventForm from "./eventForm";
import { useRouter } from "next/router";

const TableWrapper = styled.div`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const EachEvent = styled(Link)`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
  color: black;
  text-decoration: none;
  margin: 8px;
  padding: 6px;
  background: #f7f4f2;

  &:hover {
    background-color: #5fbbe3;
  }
`;
const EachEventInfo = styled.span`
  padding: 2px;
  display: flex;
  justify-content: center;
`;

export default function AllEvents() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const startDate = new Date(year, month, day);
  const endDate = new Date(year, month, day);

  const { events, setEvents } = useContext(GuestsContext);
  const [eventForm, seteventForm] = useState(false);
  const [method, setMethod] = useState("POST");
  const [currentEvent, setCurrentEvent] = useState({
    name: "",
    location: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  const addEvent = () =>{
    setMethod("POST")
    seteventForm(!eventForm)
  }

  return (
    <div>
      <div>

         {eventForm?
      <EventForm 
      setHidden={seteventForm}
      hidden={eventForm}
      currentEvent={currentEvent}
      setCurrentEvent={setCurrentEvent}
      method={method}
      /> : 
      <button onClick={() => addEvent() }> Add Event</button>
    }
    </div>
      {events ? (
        <TableWrapper>
          {events.map((event) => (
            <EachEvent
              key={event.location + event.name}
              href={{
                pathname: `/${event.name.toLowerCase()}`,
                query: { id: event.id },
              }}
            >
              <EachEventInfo>
                <h3>{event.name} </h3>
              </EachEventInfo>
              <EachEventInfo>Start:{`${event.start_date.slice(0, 16)}`}</EachEventInfo>
              <EachEventInfo>End:{`${event.end_date.slice(0, 16)}`}</EachEventInfo>
              <EachEventInfo>Location:{event.location} </EachEventInfo>
              <EachEventInfo>Notes:{event.notes} </EachEventInfo>
            </EachEvent>
          ))}
        </TableWrapper>
      ) : null}
   
    </div>
  );
}
