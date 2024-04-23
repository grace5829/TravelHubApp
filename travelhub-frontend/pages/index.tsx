import { useEffect, useState } from "react";
import { Event } from "./_app";
import styled from "styled-components";
import Link from "next/link";

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
export default function Home() {
  const [nextEvent, setNextEvent] = useState<null | Event>(null);

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

  useEffect(() => {
    fetchNextEvent();
  });

  return (
    <div>
      {nextEvent ? (
        <TableWrapper>
          <h2>Next Event:</h2>
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
        </TableWrapper>

      ) : (
        <div>"No upcoming events found" </div>
      )}
    </div>
  );
}
