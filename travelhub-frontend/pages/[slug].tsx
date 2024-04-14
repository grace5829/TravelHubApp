import Tabs from "./components/tabs";
import AllGuests from "./components/allGuests";
import AllExpenses from "./components/allExpenses";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DynamicPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const { slug, id } = router.query;


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
  return (
    <div>
      <Tabs
        config={[
          { header: "Guests", component: <AllGuests config={{title:`${title}`}}/> },
          { header: "Expenses", component: <AllExpenses config={{title:`${title}`}}/> },
        ]}
      ></Tabs>
    </div>
  );
}
