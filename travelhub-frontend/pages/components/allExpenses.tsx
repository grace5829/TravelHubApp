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
width:90vw;
display: flex;
flex-direction: column;
padding: 6px;
// justify-content: center;
align-items:center;

`;

const EachExpense = styled.div`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
  margin: 8px;
  padding: 6px;
  display: flex;
  background: #f7f4f2;
  width:80vw;
  flex-direction: column;

`;

const EachExpenseInfo = styled.span`
`;

const EachExpenseBody = styled.span`
  display: flex;
  justify-content:space-between;
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
  float:right;
`;
const TotalExpensesItem = styled.div`
display: flex;
float:right;
`;
export default function AllExpenses({ config }: any) {
  const { expenses, setExpenses } = useContext(EventInfoContext);
  const router = useRouter();
const [totalExpenses, setTotalExpenses]= useState(0)
const [sidePanel, setSidePanel] = useState(false);
const [method, setMethod] = useState("POST");
const { slug, id } = router.query;
  const [event_name, setEvent_name] = useState(
    slug ? slug.toString() : "ERROR"
  );
const [totalExpensesPerPerson, setTotalExpensesPerPerson]= useState(0)
const [currentExpense, setCurrentExpense] = useState<Expense>({
  name: "",
  description: "",
  total: 0,
  event_id: Number(id),
  event_name: event_name,
});


useEffect(() => {
    let currentTotal=0
expenses.map((expense)=>(
    currentTotal+=expense.total)
)
setTotalExpensesPerPerson(currentTotal/config.filteredGuests.length.toFixed(2))
setTotalExpenses(currentTotal)
}, [expenses])
const addExpense = () => {
  setMethod("POST");
  setSidePanel(!sidePanel);
};
  return (
    <div>

      <Heading>{config.title}'s Expenses List</Heading>
      {sidePanel ? (
        <ExpenseForm
          setHidden={setSidePanel}
          hidden={sidePanel}
          currentExpense={currentExpense}
          setCurrentExpense={setCurrentExpense}
          method={method}
        />
      ) : (
        <button onClick={() => addExpense()}> Add Expense</button>
      )}
    <ExpensesArea>
      {expenses ? (
        expenses.map((expense, index) => (
          <EachExpense>
            
            <EachExpenseTitle className={expense.name + index}>
              {expense.name}
            </EachExpenseTitle>
            <EachExpenseBody>
              {expense.description? 
              
              <EachExpenseInfo className={expense.name + index}>
                Description:{expense.description}
              </EachExpenseInfo> :
              null
            }
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
        <TotalExpensesItem>
        Total: ${totalExpenses}
        </TotalExpensesItem>
        <TotalExpensesItem>
       Total PP: ${totalExpensesPerPerson}
        </TotalExpensesItem>
      </TotalExpensesArea>
      </div>

  );
}
