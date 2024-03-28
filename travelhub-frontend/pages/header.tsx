import styled from "styled-components";
import NavBar from "./navbar";

const HeaderWrapper = styled.span`
  display: flex;
  justify-content: space-between;
  top: 10px;
  padding: 5px 5px 0px 5px;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
`;

const Logo = styled.span`
  font-family: fantasy;
  font-weight: bold;
  font-size: 24px;
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <Logo>Travel Hub</Logo>
      <NavBar />
    </HeaderWrapper>
  );
}
