import { useContext, useEffect, useState } from "react";
import { EventInfoContext, Expense } from "../_app";
import styled from "styled-components";
import { useRouter } from "next/router";
import ExpenseForm from "./expenseForm";

const Heading = styled.h3`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const ExpensesArea = styled.div`
  width: 90vw;
  display: flex;
  flex-direction: column;
  padding: 6px;
  align-items: center;
`;

const EachExpense = styled.div`
  border-radius: 5px;
  margin: 8px;
  padding: 6px;
  display: flex;
  background: #324a5f;
  width: 80vw;
  flex-direction: column;
`;

const EachExpenseInfo = styled.span`
`;

const EachExpenseBody = styled.span`
  display: flex;
  justify-content: space-between;
`;
const EachExpenseTitle = styled.span`
  font-weight: bold;
`;
const TotalExpensesArea = styled.div`
  font-weight: bold;
  margin: 8px;
  padding: 6px;
  flex-direction: column;
  display: flex;
  float: right;
`;
const TotalExpensesItem = styled.div``;
const ButtonWrapper = styled.span`
  display: flex;
  float: right;
  margin:2px;
  align-items: center;
  cursor: pointer;
`;
export default function AllExpenses({ config }: any) {
  const { expenses, setExpenses } = useContext(EventInfoContext);
  const router = useRouter();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [sidePanel, setSidePanel] = useState(false);
  const [method, setMethod] = useState("POST");
  const { slug, id } = router.query;
  const [event_name, setEvent_name] = useState(
    slug ? slug.toString() : "ERROR"
  );
  const [totalExpensesPerPerson, setTotalExpensesPerPerson] = useState(0);
  const [currentExpense, setCurrentExpense] = useState<Expense>({
    name: "",
    description: "",
    total: 0,
    event_id: Number(id),
    event_name: event_name,
  });

  useEffect(() => {
    let currentTotal = 0;
    expenses.map((expense) => (currentTotal += expense.total));
    setTotalExpensesPerPerson(
      currentTotal / config.filteredGuests.length.toFixed(2)
    );
    setTotalExpenses(currentTotal);
  }, [expenses]);
  const addExpense = () => {
    setMethod("POST");
    setSidePanel(!sidePanel);
  };
  const removeExpense = async (id: number | undefined) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/expense/${id}`, {
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
      setExpenses(result.expenses);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };
  const edit = (expense: Expense) => {
    setMethod("PUT");
    setSidePanel(!sidePanel);
    setCurrentExpense(expense);
  };
  return (
    <div>
      <Heading>{config.title}&apos;s Expenses List</Heading>
      {sidePanel ? (
        <ExpenseForm
          setHidden={setSidePanel}
          hidden={sidePanel}
          currentExpense={currentExpense}
          setCurrentExpense={setCurrentExpense}
          method={method}
        />
      ) : (
        <ButtonWrapper onClick={() => addExpense()}>
          <span className="material-symbols-outlined">add_box</span>
          <span>Add Expense</span>
        </ButtonWrapper>
      )}
      <ExpensesArea>
        {expenses ? (
          expenses.map((expense, index) => (
            <EachExpense key={expense.name + expense.id}>
              <div>
                <ButtonWrapper
                  onClick={() => removeExpense(expense.id)}
                  className="material-symbols-outlined"
                >
                  delete
                </ButtonWrapper>
                <ButtonWrapper
                  onClick={() => edit(expense)}
                  className="material-symbols-outlined"
                >
                  edit
                </ButtonWrapper>
                <EachExpenseTitle className={expense.name + index}>
                  {expense.name}
                </EachExpenseTitle>
              </div>
              <EachExpenseBody>
                <EachExpenseInfo className={expense.name + index}>
                  Description:
                  {expense.description ? expense.description : "N/A"}
                </EachExpenseInfo>
                <EachExpenseInfo className={expense.name + index}>
                  ${expense.total}
                </EachExpenseInfo>
              </EachExpenseBody>
            </EachExpense>
          ))
        ) : (
          <div> No expenses</div>
        )}
      </ExpensesArea>

      <TotalExpensesArea>
        <TotalExpensesItem>Total: ${totalExpenses}</TotalExpensesItem>
        <TotalExpensesItem>
          Total PP: ${totalExpensesPerPerson}
        </TotalExpensesItem>
      </TotalExpensesArea>
    </div>
  );
}
