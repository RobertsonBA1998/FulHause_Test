import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Cart from "./components/Cart";
import Header from "./components/Header";
import styled, { createGlobalStyle } from "styled-components";

const App = () => {
 return (
  <BrowserRouter>
   <GlobalStyle />
   <Header />
   <Routes>
    <Route path="/" element={<Homepage key="homepage" />} />
    <Route path="/cart" element={<Cart key="cart" />} />
   </Routes>
  </BrowserRouter>
 );
};

//styles for every component, used for the font family
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Montserrat', sans-serif;
  }
`;

export default App;
