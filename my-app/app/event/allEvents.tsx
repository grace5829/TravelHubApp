"use client";
import styled from "styled-components";
import { useContext, useState } from "react";
import { Guest, GuestsContext } from "../layout";
import SidePanel from "./sidePanel";

const TableWrapper = styled.span`
  margin: 10px;
  display: flex;
`;
const EachGuest = styled.div`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
  margin: 8px;
  padding: 6px;
  background: #f7f4f2;
`;
const EachGuestInfo = styled.span`
  padding: 2px;
  display: flex;
  justify-content: center;
`;
export default function AllEvents() {
  const { events, setEvents } = useContext(GuestsContext);
console.log(events)
  return (
    <div>
{events? <div>{events.map((event)=> (
    <div>

<div>{event.name} </div>
{console.log(event.end_date.split(" "))}
<div>{event.start_date} </div>
<div>{event.end_date} </div>
<div>{event.notes} </div>
<div>{event.location} </div>
</div>
))} </div> :null}

    </div>
  );
}
