import { useContext, useState } from "react";
import { EventInfoContext } from "../_app";

export default function AllExpenses() {
    const { expenses, setExpenses } = useContext(EventInfoContext);


  return (
    <div>
      <div> 
        {expenses? 
     expenses.map((expense, index) => (
      <div className={expense.name}>  {expense.name}</div>

     ))
     
     : <div> No expenses</div>
        
        }
      </div>    </div>
  );
}
