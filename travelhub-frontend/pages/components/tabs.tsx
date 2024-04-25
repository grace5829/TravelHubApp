import { useState } from "react";
import styled from "styled-components";
const EventInfoArea = styled.div`
  display: flex;
  flex-direction: row;
`;
const TabsArea = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  height:100%;
    font-size:10px;
  z-index: 1;
  top: 10px; 
  // overflow-x: hidden; 
  border-radius: 5px;
  background-color:#1b2a41;

  `;
const EachTab = styled.div`
  margin: 0px 8px;
  cursor:pointer;
  display:flex;
  justify-content:center;
  width: fit-content;
  block-size: fit-content;
    font-size:12px;
  padding: 9px;
  margin: 0px 5px;
`;
const BodyArea = styled.div`
margin:15px;
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
      <BodyArea>{config[activeTab].component}</BodyArea>
    </EventInfoArea>
  );
}
