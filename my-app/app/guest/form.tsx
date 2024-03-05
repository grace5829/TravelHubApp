import { ChangeEvent, FormEvent, useContext, useState } from "react";
import styled from "styled-components";
import { Guest, GuestsContext } from "../page";
import SidePanel from "./sidePanel";
import React from "react";

export default function Form() {
  const [addGuest, setAddGuest] = useState<boolean>(false);
  const [currentGuest, setCurrentGuest] =useState<Guest | null>({
    firstName: "",
    lastName: "",
    gender: "FEMALE",
    age: 0,
    amountDue: 0,
    RSVP: "PENDING",
    notes: "",
  })

  return (
    <div>
      {addGuest ? (
        <SidePanel setHidden={setAddGuest} hidden={addGuest} currentGuest={currentGuest} setCurrentGuest={setCurrentGuest}/>
      ) : (
        <button onClick={() => setAddGuest(!addGuest)}> Add Guest</button>
      )}
    </div>
  );
}
