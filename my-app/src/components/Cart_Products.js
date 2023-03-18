import styled from "styled-components";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";

const Cart_Products = ({ userCart, setTotalPrice }) => {
 const [isDeleted, setIsDeleted] = useState(false);

 //fetch method delete from backnd
 const deleteCartItem = async () => {
  const response = await fetch(
   `http://localhost:8000/user/641367d81a73216f71aa1720/cart/${userCart.productId}`,
   {
    method: "DELETE",
   }
  );

  if (!response.ok) {
   throw new Error("Failed to delete cart item.");
  }

  console.log("Item deleted");
  setIsDeleted(true);
 };

 //update cart total when it is removed
 const fetchUpdatedCartData = async () => {
  const res = await fetch(
   "http://localhost:8000/user/641367d81a73216f71aa1720"
  );
  const updatedData = await res.json();

  setTotalPrice(updatedData.user.totalPrice);
 };

 //delete product item for button,
 const handleDelete = async () => {
  try {
   await deleteCartItem();
   await fetchUpdatedCartData();
  } catch (error) {
   console.error(error.message);
  }
 };

 //for the deletion process
 useEffect(() => {
  setIsDeleted(false);
 }, [userCart]);

 //cart will return as empty if there is nothing inside, or if error backend
 if (!userCart || userCart.length === 0) {
  return <div>Cart Empty!</div>;
 }
 if (isDeleted) {
  return null;
 }

 return (
  <CartContainer>
   <Image src={userCart.image} alt={userCart.product} />
   <ProductInfo>
    <ProductName>{userCart.product}</ProductName>
    <Price>${userCart.price}</Price>
    <Quantity>Quantity: {userCart.quantity}</Quantity>
    <Button onClick={handleDelete}>
     <AiFillDelete />
    </Button>
   </ProductInfo>
  </CartContainer>
 );
};

const CartContainer = styled.div`
 display: flex;
 flex-direction: row;
 align-items: flex-start;
 background-color: #f2f2f2;
 margin: 10px;
 padding: 16px;

 // cart to be viewable with max width by increasing width height
 @media (max-width: 375px) {
  flex-direction: column;
  align-items: center;
  width: 100px;
  height: 100px;
 }
`;

const Button = styled.button`
 font-size: 32px;
 color: black;
 padding: 10px;
 border: none;
 width: 40px;
 height: 40px;
 border-radius: 5px;
 cursor: pointer;
`;

//adjusted image size for max width
const Image = styled.img`
 width: 80px;
 height: 80px;
 margin-right: 16px;

 @media (max-width: 375px) {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
 }
`;

const ProductInfo = styled.div`
 display: flex;
 flex-direction: column;
 justify-content: center;
 flex-grow: 1;
`;

const ProductName = styled.p`
 font-size: 24px;
 margin: 0;
 margin-bottom: 8px;
 line-height: 1.2;

 //adjusted font size for 480 screens
 @media (max-width: 480px) {
  font-size: 10px;
 }
`;

const Price = styled.p`
 font-weight: bold;
 margin: 0;
 margin-bottom: 8px;

 //adjusted price to be consistent with product size name
 @media (max-width: 480px) {
  font-size: 10px;
 }
`;

const Quantity = styled.p`
 margin: 0;
 margin-bottom: 8px;

 @media (max-width: 480px) {
  font-size: 10px;
 }
`;

export default Cart_Products;
