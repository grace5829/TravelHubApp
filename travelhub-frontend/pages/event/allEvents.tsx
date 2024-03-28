import styled from "styled-components";
import { useContext } from "react";
import Link from "next/link";
import { GuestsContext } from "../_app";

const TableWrapper = styled.div`
  margin: 10px;
  display: flex;
`;
const EachEvent =  styled(Link)`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
  color:black;
  text-decoration: none;
  margin: 8px;
  padding: 6px;
  background: #f7f4f2;
`;
const EachEventInfo = styled.span`
  padding: 2px;
  display: flex;
  justify-content: center;
`;

export default function AllEvents() {
  const { events, setEvents } = useContext(GuestsContext);

  return (
    <div>
      {events ? (
        <TableWrapper >
          {events.map((event) => (
            <EachEvent key={event.location + event.name} href={{pathname:`/${event.name.toLowerCase()}`, query:{ id:event.id}}} >
              <EachEventInfo><h3>{event.name} </h3></EachEventInfo>
              <EachEventInfo>
                Start:{event.start_date.slice(0, 16)} 
              </EachEventInfo>
              <EachEventInfo>
               End:{event.end_date.slice(0, 16)}
              </EachEventInfo>
              <EachEventInfo>Location:{event.location} </EachEventInfo>
              <EachEventInfo>Notes:{event.notes} </EachEventInfo>
            </EachEvent>
          ))}{" "}
        </TableWrapper>
      ) : null}
    </div>
  );
}
