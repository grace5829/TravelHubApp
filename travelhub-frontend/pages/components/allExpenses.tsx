import { useContext } from "react";
import { EventInfoContext } from "../_app";

export default function AllExpenses() {
  const { expenses, setExpenses } = useContext(EventInfoContext);

  return (
      <div>
        {expenses ? (
          expenses.map((expense, index) => (
            <div className={expense.name + index}> {expense.name}</div>
          ))
        ) : (
          <div> No expenses</div>
        )}
      </div>
  );
}
