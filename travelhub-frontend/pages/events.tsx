import styled from "styled-components";
import { useContext, useState } from "react";
import Link from "next/link";
import { EventInfoContext, Event } from "./_app";
import EventForm from "./components/eventForm";

const TableWrapper = styled.div`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  `;
  const ButtonWrapper = styled.span`
  display: flex;
  float: right;
  cursor: wait;
  z-index:1;
  
`;
const EachEvent = styled(Link)`
  border-radius: 5px;
  text-decoration: none;
  color: #f0e2d3;
  margin: 8px;
  padding: 5px 10px;
  background: #324a5f;

  // &:hover ${ButtonWrapper}{
  &:hover {
    background-color: #5fbbe3;
      // display: none;
        // background: #324a5f;
      
  
  }
`;
const EachEventInfo = styled.span`
  padding: 2px;
  display: flex;
  justify-content: center;
`;


const ButtonsWrapper = styled.span`
position:absolute;
`;

export default function Events() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const startDate = new Date(year, month, day);
  const endDate = new Date(year, month, day);

  const { events, setEvents } = useContext(EventInfoContext);
  const [eventForm, setEventForm] = useState(false);
  const [method, setMethod] = useState("POST");
  const [currentEvent, setCurrentEvent] = useState<Event>({
    notes: "",
    location: "",
    start_date: "",
    end_date: "",
    name: "",
  });

  const addEvent = () => {
    setMethod("POST");
    setEventForm(!eventForm);
  };
  const edit = (event: Event, evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setMethod("PUT");
    setEventForm(!eventForm);
    setCurrentEvent(event);
  };

  const removeEvent = async (
    evt: React.MouseEvent<HTMLButtonElement>,
    id: number | undefined
  ) => {
    evt.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/event/${id}`, {
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
      setEvents(result.events);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };
  return (
    <div>
      <div>
        {eventForm ? (
          <EventForm
            setHidden={setEventForm}
            hidden={eventForm}
            currentEvent={currentEvent}
            setCurrentEvent={setCurrentEvent}
            method={method}
          />
        ) : (
          <button onClick={() => addEvent()}> Add Event</button>
        )}
      </div>
      {events ? (
        <TableWrapper>
          {events.map((event) => (
            <EachEvent
              key={event.location + event.id}
              href={{
                pathname: `/${event.name.toLowerCase()}`,
                query: { id: event.id },
              }}
            >
              <ButtonsWrapper>

              <ButtonWrapper
                onClick={(evt: React.MouseEvent<HTMLButtonElement>) =>
                  edit(event, evt)
                }
                className="material-symbols-outlined"
              >
                edit
              </ButtonWrapper>
              <ButtonWrapper
                onClick={(evt: React.MouseEvent<HTMLButtonElement>) =>
                  removeEvent(evt, event.id)
                }
                className="material-symbols-outlined"
              >
                delete
              </ButtonWrapper>
              </ButtonsWrapper>

              <EachEventInfo>
                <h3>{event.name} </h3>
              </EachEventInfo>
              <EachEventInfo>
                Start:{`${event.start_date.slice(0, 16)}`}
              </EachEventInfo>
              <EachEventInfo>
                End:{`${event.end_date.slice(0, 16)}`}
              </EachEventInfo>
              <EachEventInfo>Location:{event.location} </EachEventInfo>
              <EachEventInfo>Notes:{event.notes} </EachEventInfo>
            </EachEvent>
          ))}
        </TableWrapper>
      ) : null}
    </div>
  );
}
