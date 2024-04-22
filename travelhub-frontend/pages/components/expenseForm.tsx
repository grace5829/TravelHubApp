import { ChangeEvent, FormEvent, useContext } from "react";
import styled from "styled-components";
import React from "react";
import { Expense, EventInfoContext } from "../_app";

const ExpenseForms = styled.span`
  z-index: 1;
  width: 30vw;
  padding: 10px;
  background: gray;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
`;

const FormWrapper = styled.form`
  display: grid;
`;

export default function ExpenseForm({
  setHidden,
  hidden,
  currentExpense,
  setCurrentExpense,
  method,
}: {
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
  currentExpense: Expense;
  setCurrentExpense: React.Dispatch<React.SetStateAction<Expense>>;
  method: string;
}) {
    const { expenses, setExpenses } = useContext(EventInfoContext);

  const defaultExpense: Expense = {
    name: "",
    description: "",
    total: 0,
    event_id: currentExpense.event_id,
    event_name: currentExpense.event_name,
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentExpense.name.trim() || currentExpense.total===0) {
      let errorMessage = "";
      if (!currentExpense.name.trim()) {
        errorMessage += "Please enter a  name.";
      }
      if (currentExpense.total===0) {
        errorMessage += "Please enter a total.";
      }
      alert(errorMessage);
      return;
    }

    let API;
    if (method === "POST") {
      API = `http://127.0.0.1:5000/expenses`;
    } else {
      API = `http://127.0.0.1:5000/expenses/${currentExpense.id}`;
    }
    try {
      const response = await fetch(API, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentExpense),
      });

      if (!response.ok) {
        throw new Error(`Failed to update. Status: ${response.status}`);
      }

      const result = await response.json();
      let updatedList;

      if (method === "POST") {
        updatedList = [...expenses, result];
      } else {
        updatedList = expenses.map((expense) =>
        expense.id === result.id ? result : expense
        );
      }
      setExpenses(updatedList);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }

    setCurrentExpense(defaultExpense);
    setHidden(!hidden);
  };
  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "event_id") {
      setCurrentExpense((values) => ({ ...values, [name]: Number(value) }));
    } else {
      setCurrentExpense((values) => ({ ...values, [name]: value }));
    }
  };
  const hideSideBar = () => {
    setHidden(!hidden);
    setCurrentExpense(defaultExpense);
  };

  return (
    <ExpenseForms>
      <button onClick={() => hideSideBar()}>X</button>
      <FormWrapper onSubmit={handleSubmit}>
      <label htmlFor="name">
            Name:
          <input
            type="text"
            name="name"
            value={currentExpense?.name}
            onChange={handleChange}
          />
        </label>
      <label htmlFor="total">
            Total:
          <input
            type="number"
            name="total"
            value={currentExpense?.total}
            onChange={handleChange}
          />
        </label>
      <label htmlFor="description">
            Description:
          <input
            type="text"
            name="description"
            value={currentExpense?.description}
            onChange={handleChange}
          />
        </label>
        <input type="submit" />

      
      
      </FormWrapper>
    </ExpenseForms>
  );
}
