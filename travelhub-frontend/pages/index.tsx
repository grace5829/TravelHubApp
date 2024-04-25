import { useContext, useEffect, useState } from "react";
import { Event, EventInfoContext } from "./_app";
import styled from "styled-components";
import Link from "next/link";

const TableWrapper = styled.div`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  // justify-content: end;
  width:50vw;
`;
const EachEvent = styled(Link)`
  border-radius: 5px;
  text-decoration: none;
  color: #f0e2d3;
  margin: 8px;
  padding: 5px 10px;
  background: #324a5f;
  width: 33vw;
  // position: relative;
  // right: 0;
  &:hover {
    background-color: #23336f;
  }
`;
const Heading = styled.h2`
  // display: flex;
  float: left;

  position: relative;
  left: 0;
  // margin:2px;
  // align-items: center;
  // cursor: pointer;
`;
const EachEventInfo = styled.span`
  padding: 2px;
  display: flex;
  justify-content: center;
`;
export default function Home() {
  const [nextEvent, setNextEvent] = useState<null | Event>(null);
  const [previousEvent, setPreviousEvent] = useState<null | Event>(null);
  const { events } = useContext(EventInfoContext);

  const fetchNextEvent = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/next-event", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      setNextEvent(result.next_event);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchPreviousEvent = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/previous-event", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      setPreviousEvent(result.previous_event);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchNextEvent();
    fetchPreviousEvent();
  }, [events]);
  // console.log(previousEvent)

  return (
    <TableWrapper>
      <Heading>Next Event:</Heading>
      {nextEvent ? (
        <EachEvent
          key={nextEvent.location + nextEvent.name}
          href={{
            pathname: `/${nextEvent.name.toLowerCase()}`,
            query: { id: nextEvent.id },
          }}
        >
          <EachEventInfo>
            <h3>{nextEvent.name} </h3>
          </EachEventInfo>
          <EachEventInfo>
            Start:{`${nextEvent.start_date.slice(0, 16)}`}
          </EachEventInfo>
          <EachEventInfo>
            End:{`${nextEvent.end_date.slice(0, 16)}`}
          </EachEventInfo>
          <EachEventInfo>Location:{nextEvent.location} </EachEventInfo>
          <EachEventInfo>Notes:{nextEvent.notes} </EachEventInfo>
        </EachEvent>
      ) : (
        <div>"No upcoming events found" </div>
      )}
      <Heading>Previous Event:</Heading>

      {previousEvent ? (
        <EachEvent
          key={previousEvent.location + previousEvent.name}
          href={{
            pathname: `/${previousEvent.name.toLowerCase()}`,
            query: { id: previousEvent.id },
          }}
        >
          <EachEventInfo>
            <h3>{previousEvent.name} </h3>
          </EachEventInfo>
          <EachEventInfo>
            Start:{`${previousEvent.start_date.slice(0, 16)}`}
          </EachEventInfo>
          <EachEventInfo>
            End:{`${previousEvent.end_date.slice(0, 16)}`}
          </EachEventInfo>
          <EachEventInfo>Location:{previousEvent.location} </EachEventInfo>
          <EachEventInfo>Notes:{previousEvent.notes} </EachEventInfo>
        </EachEvent>
      ) : (
        <div>"No previous events found" </div>
      )}
    </TableWrapper>
  );
}
