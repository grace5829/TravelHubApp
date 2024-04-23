import { useState } from "react";
import styled from "styled-components";
const EventInfoArea = styled.div`
  display: flex;
  flex-direction: row;
  // background:black
`;
const TabsArea = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 20px;
  height:100%;
  width:10vw;
  font-size:10px;
  z-index: 1;
  top: 0; 
  left: 0;
  overflow-x: hidden; 
  border-radius: 5px;
  background: #f7f4f2;

  `;
const EachTab = styled.h3`
  margin: 0px 8px;
  padding: 5px;
`;
export default function Tabs({ config }: any) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <EventInfoArea>
      <TabsArea>
        {config.map((entry: any, index: any) => (
          <EachTab onClick={() => setActiveTab(index)}>{entry.header}</EachTab>
        ))}
      </TabsArea>
      <div>{config[activeTab].component}</div>
    </EventInfoArea>
  );
}
