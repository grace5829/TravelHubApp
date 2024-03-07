import styled from "styled-components";
import NavBar from "./navbar";

const HeaderWrapper = styled.span`
  // position: fixed;
  // right: 0;
  display:flex;
  justify-content:space-between;
  top: 10px;
  padding-top:5px;
  font-family: sans-serif;
  display flex; 
align-items:center;
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
