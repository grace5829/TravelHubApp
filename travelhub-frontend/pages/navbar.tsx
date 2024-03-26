import Link from "next/link";
import styled from "styled-components";

export const IndividualLink = styled(Link)`
  padding: 5px;
  text-decoration: none;
  color: black;
  font-family: fantasy;
  font-weight: bold;
  font-size: 20px;
  padding-left: 5px;

  &:hover {
    background-color: #5fbbe3;
  }
`;

export default function NavBar() {
  return (
    <span>
      <IndividualLink href="/">Home</IndividualLink>
      <IndividualLink href="/guest">All Guest List</IndividualLink>
      <IndividualLink href="/event">Event</IndividualLink>
    </span>
  );
}
