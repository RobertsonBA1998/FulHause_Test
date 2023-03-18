import { useEffect, useState } from "react";
import Product from "./Product";
import styled from "styled-components";

const Homepage = () => {
 //myData is data from the API
 const [myData, setData] = useState([]);

 //make sure to focus on data.products due to how the API is sending us the info
 useEffect(() => {
  fetch(
   "https://fh-api-dev.herokuapp.com/api/products-service/products/website/CAD?page=0&limit=6"
  )
   .then((res) => res.json())
   .then((resData) => setData(resData.data.products));
 }, []);

 //loading state for myData if null
 if (!myData) {
  return <div>Loading..</div>;
 }

 //pass data as props for Product Component to display the products in that component
 return (
  <div>
   <Wrapper>
    <Image
     src="https://furnitureplushome.com/wp-content/uploads/2018/07/EEI-1633-TEAl3-640x400.jpg"
     alt="Couch"
    />

    <Container>
     {myData.map((product) => {
      return <Product key={product._id} product={product} />;
     })}
    </Container>
   </Wrapper>
  </div>
 );
};

//styled container to make sure they have three rows and two columns
const Container = styled.div`
 height: 520px;
 width: 520px;

 display: grid;
 grid-template-columns: repeat(3, 1fr);
 grid-template-rows: repeat(2, 1fr);
 grid-auto-flow: dense;
 gap: -10px;
 justify-items: center;
 align-items: center;

 //format for phones so they can see the grid better if width is around 769
 @media (max-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 300px;
  height: 750px;
  gap: 10px;
 }

 //format for phones so that they can see all items in columns for better viewing
 @media (max-width: 480px) {
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, 1fr);
  width: 200px;
  height: 1200px;
  gap: 20px;
 }
`;

const Wrapper = styled.div`
 display: flex;
 align-items: center;

 @media (max-width: 768px) {
  flex-direction: column;
 }
`;

const Image = styled.img`
 width: 315px;
 height: 490px;
 margin-right: 10px;
 border-style: solid;
 border-width: 3px;
 border-color: #e6e6e6;

 @media (max-width: 768px) {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
 }
`;

export default Homepage;
