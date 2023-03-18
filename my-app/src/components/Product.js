import { useState } from "react";
import styled from "styled-components";
import { AiOutlineShoppingCart } from "react-icons/ai";

//deconstructed product, since it is now object, will be used to display information of products
const Product = ({ product }) => {
 const randomIndex = Math.floor(Math.random() * 4);

 //useState for cartItems, so that we know what to submit as data in the backend, to use in the frontend later
 const [cartItem, setCartItem] = useState({
  productId: product._id,
  product: product.fulhausProductName,
  price: product.retailPrice / 100,
  quantity: 1,
  image: product.imageURLs[randomIndex],
 });

 //post method for getting the user to add items to their cart from backend
 //used for the button so it can make a post request when it is clicked
 const handleAddToCart = () => {
  fetch(`http://localhost:8000/user/641367d81a73216f71aa1720/cart`, {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify(cartItem),
  })
   .then((res) => {
    if (!res.ok) {
     throw new Error("Failed to add item to cart");
    }
    console.log("Item added to cart");
   })
   .catch((err) => {
    console.error(err);
   });
 };

 //made sure to update the cost, since it came in cent notation

 return (
  <Content>
   <Image src={product.imageURLs[randomIndex]} alt={product.name} />
   <Name>{product.fulhausProductName}</Name>
   <Price>
    {Number.parseFloat(product.retailPrice / 100).toLocaleString(
     `${product.currency}`,
     {
      style: "currency",
      currency: "USD",
     }
    )}
    <Button onClick={handleAddToCart}>
     <AiOutlineShoppingCart />
    </Button>
   </Price>
  </Content>
 );
};

//made sure that image width covers its own div
const Image = styled.img`
 width: 100%;
 height: 100px;
 object-fit: cover;
`;

//content inside is distributed so that they arent cluttered
const Content = styled.div`
 margin: 10px;
 height: 215px;
 width: 150px;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 border-style: solid;
 border-width: 2px;
 border-color: #e6e6e6;
`;

const Name = styled.span`
 font-size: 15px;
 font-weight: bold;
`;

const Price = styled.p`
 font-size: 15px;
 font-weight: bold;
`;

const Button = styled.button`
 font-size: 20px;
 position: relative;
 left: 55px;
 color: black;
 padding: 10px;
 border: none;
 width: 40px;
 height: 40px;
 border-radius: 5px;
 cursor: pointer;
`;

export default Product;
