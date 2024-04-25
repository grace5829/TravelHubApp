import Link from "next/link";
import styled from "styled-components";

export const IndividualLink = styled(Link)`
  padding: 5px;
  text-decoration: none;
  font-family: fantasy;
  font-weight: bold;
  font-size: 20px;
  padding-left: 5px;
  align-items-center;
  display:flex;
  color:#f0e2d3;

  &:hover {
    background-color: #5fbbe3;
  }
`;
export const NavWrapper = styled.div`
  flex-wrap: wrap;

  display: flex;
`;
export const IconWrapper = styled.div`
  align-items-center;

`;

export default function NavBar() {
  return (
    <NavWrapper>
      <IndividualLink href="/">
        <span className="material-symbols-outlined">home</span>Home
      </IndividualLink>
      <IndividualLink href="/events">
        <span className="material-symbols-outlined">event</span>
        Events
      </IndividualLink>
    </NavWrapper>
  );
}
