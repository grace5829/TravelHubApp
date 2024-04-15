import Tabs from "./components/tabs";
import AllGuests from "./components/allGuests";
import AllExpenses from "./components/allExpenses";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { EventInfoContext } from "./_app";

export default function DynamicPage() {
  const router = useRouter();
  const { guests, setGuests } = useContext(EventInfoContext);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [title, setTitle] = useState("");
  const { slug, id } = router.query;


  const filterGuests = async (eventId:number) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/guests/${eventId}`, {
          method: "GET", // Use the appropriate HTTP method
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const result = await response.json();
        setFilteredGuests(result.guests);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }

  };
  useEffect(() => {
    if (typeof slug === "string") {
     const words = slug
        .split(" ")
        ?.map((word) => {
          return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ");
        setTitle(words);
    }
  }, [slug]);
  useEffect(() => {
    if (typeof slug === "string") {
      filterGuests(Number(id));
    }
  }, [ guests]);
  return (
    <div>
      <Tabs
        config={[
          { header: "Guests", component: <AllGuests config={{title:title, filteredGuests:filteredGuests}}/> },
          { header: "Expenses", component: <AllExpenses config={{title:title, filteredGuests:filteredGuests}}/> },
        ]}
      ></Tabs>
    </div>
  );
}
