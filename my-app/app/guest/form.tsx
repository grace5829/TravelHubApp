"use client";
import { useState } from "react";

import { Guest } from "../page";
import SidePanel from "./sidePanel";
import React from "react";

export default function Form() {
  const [addGuest, setAddGuest] = useState<boolean>(false);
  const [currentGuest, setCurrentGuest] = useState<Guest>({
    firstName: "",
    lastName: "",
    gender: "FEMALE",
    age: 0,
    amountDue: 0,
    RSVP: "PENDING",
    notes: "",
  });

  return (
    <div>
      {addGuest ? (
        <SidePanel
          setHidden={setAddGuest}
          hidden={addGuest}
          currentGuest={currentGuest}
          setCurrentGuest={setCurrentGuest}
          method="POST"
        />
      ) : (
        <button onClick={() => setAddGuest(!addGuest)}> Add Guest</button>
      )}
    </div>
  );
}
