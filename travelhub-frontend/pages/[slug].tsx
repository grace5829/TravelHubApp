import Tabs from "./components/tabs";
import AllGuests from "./components/allGuests";
import AllExpenses from "./components/allExpenses";

export default function DynamicPage() {
  return (
    <div>
      <Tabs
        config={[
          { header: "Guests", component: <AllGuests /> },
          { header: "Expenses", component: <AllExpenses /> },
        ]}
      ></Tabs>
    </div>
  );
}
