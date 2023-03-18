import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

//header for all pages, has company name and links to home and cart
const Header = () => {
 return (
  <>
   <HeaderWrapper>
    <Logo>FullHause</Logo>
    <LinkWrapper>
     <StyledLink to="/">Home</StyledLink>
     <StyledLink to="/cart">Cart</StyledLink>
    </LinkWrapper>
   </HeaderWrapper>
  </>
 );
};

export default Header;

const HeaderWrapper = styled.div`
 display: flex;
 align-items: center;
 justify-content: space-between;
 background-color: #f8f8f8;
 padding: 16px;
 font-family: "Roboto", sans-serif;

 @media (max-width: 375px) {
  padding: 8px;
  font-size: 14px;
 }
`;

//adjust logo since it is too big for mobile
const Logo = styled.h1`
 font-size: 32px;
 font-weight: bold;
 color: #333;
 font-style: italic;

 //reduce size of header
 @media (max-width: 375px) {
  font-size: 10px;
 }
`;

const LinkWrapper = styled.div`
 display: flex;
 align-items: center;
`;

const StyledLink = styled(Link)`
 text-decoration: none;
 color: #333;
 font-size: 16px;
 font-weight: bold;
 margin-right: 50px;

 @media (max-width: 375px) {
  font-size: 10px;
 }
`;
