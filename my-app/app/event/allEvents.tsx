"use client";
import styled from "styled-components";
import { useContext, useState } from "react";
import { Guest, GuestsContext } from "../layout";
import SidePanel from "../guest/sidePanel";

const TableWrapper = styled.span`
  margin: 10px;
  display: flex;
`;
const EachEvent = styled.div`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
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
  // let currDate
  // events? currDate=events[0].start_date :null
  // console.log(typeof currDate)
  console.log(events[0]?.start_date.slice(0, 16));

  return (
    <div>
      {events ? (
        <TableWrapper>
          {events.map((event) => (
            <EachEvent key={event.location + event.name}>
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
