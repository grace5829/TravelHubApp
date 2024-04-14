import { useContext, useEffect, useState } from "react";
import { EventInfoContext } from "../_app";
import styled from "styled-components";
import { useRouter } from "next/router";

const Heading = styled.h3`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const EachExpense = styled.div`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
  margin: 8px;
  padding: 6px;
  display: flex;
  background: #f7f4f2;
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
const TotalExpenses = styled.div`
  font-weight: bold;
  border-radius: 5px;
  margin: 8px;
  padding: 6px;  display: flex;
  justify-content:flex-end;
`;
export default function AllExpenses({ config }: any) {
  const { expenses, setExpenses } = useContext(EventInfoContext);
const [totalExpenses, setTotalExpenses]= useState(0)
useEffect(() => {
    let currentTotal=0
expenses.map((expense)=>(
    currentTotal+=expense.total)
)
setTotalExpenses(currentTotal)
}, [expenses])

  return (
    <div>
      <Heading>{config.title}'s Expenses List</Heading>
      {expenses ? (
        expenses.map((expense, index) => (
          <EachExpense>
            <EachExpenseTitle className={expense.name + index}>
              {expense.name}
            </EachExpenseTitle>
            <EachExpenseBody>
              <EachExpenseInfo className={expense.name + index}>
                Description:{expense.description}
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
      <TotalExpenses>
        <span>
       Total: ${totalExpenses}
        </span>
            
      </TotalExpenses>
    </div>
  );
}
