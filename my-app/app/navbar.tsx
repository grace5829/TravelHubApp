import Link from "next/link";
import styled from "styled-components";

const IndividualLink = styled(Link)`
  padding: 5px;
  text-decoration: none;
  color:black;
  font-family: fantasy;
font-weight: bold;
font-size: 20px;

&:hover {
  background-color: #5fbbe3;
}

`;




export default function NavBar() {
  return (
    <span>
        <IndividualLink href="/">Home</IndividualLink>
        <IndividualLink href="/guest">Guest List</IndividualLink>
    </span>
  );
}
