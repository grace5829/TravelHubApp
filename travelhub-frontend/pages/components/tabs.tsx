import { useState } from "react";

export default function Tabs({ config }: any) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {config.map((entry: any, index: any) => (
        <div onClick={() => setActiveTab(index)}>{entry.header}</div>
      ))}
      <div>{config[activeTab].component}</div>
    </div>
  );
}
