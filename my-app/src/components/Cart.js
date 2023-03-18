import { useEffect, useState } from "react";
import Cart_Products from "./Cart_Products";
import styled from "styled-components";

const Cart = () => {
 //usestates for cartData and toTalPrice
 const [cartData, setCartData] = useState([]);
 const [totalPrice, setTotalPrice] = useState(0);

 //fetch both data for cartData, and totalPrice
 useEffect(() => {
  fetch("http://localhost:8000/user/641367d81a73216f71aa1720")
   .then((res) => res.json())
   .then((resData) => {
    setCartData(resData.user.cart);
    setTotalPrice(resData.user.totalPrice);
   });
 }, []);

 //if cart is impty return cart empty
 if (!cartData || totalPrice === 0) {
  return (
   <div>
    <h1>Cart Empty!</h1>
   </div>
  );
 }

 // pass products as props for Cart_Production component, assign setTotalPrice, userCart, to update info
 //round in frontend of totalPrice so t hey are in two decimal places
 return (
  <div>
   <h1>Cart</h1>
   {cartData.map((userCart) => (
    <Cart_Products
     key={userCart.productId}
     userCart={userCart}
     setTotalPrice={setTotalPrice}
    />
   ))}
   <FinalizePurchase>
    <h1>Total Price: ${Math.round(totalPrice * 100) / 100}</h1>
    <CheckoutBtn>Check Out</CheckoutBtn>
   </FinalizePurchase>
  </div>
 );
};

const CheckoutBtn = styled.button`
 cursor: pointer;
 padding: 12px 24px;
 border: 0;
 color: black;
 background: #cccccc;
 font-size: 16px;
`;

const FinalizePurchase = styled.div`
 display: flex;
 align-items: center;
 flex-direction: column;
`;

export default Cart;
