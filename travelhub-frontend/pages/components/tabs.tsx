import { useState } from "react";
import styled from "styled-components";
const EventInfoArea = styled.h3`
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
  width:15vw;
  font-size:10px;
  z-index: 1;
  top: 0; 
  left: 0;
  overflow-x: hidden; 
  padding-top: 60px; 
  `;
const EachTab = styled.h3`
  box-shadow: 5px 5px 5px gray;
  border-radius: 5px;
  margin: 8px;
  padding: 6px;
  background: #f7f4f2;
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
