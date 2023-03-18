const express = require("express");
const morgan = require("morgan");

const port = process.env.PORT || 8000;

//handlers are obtained here for ACRONYMS
const {
 getAcronyms,
 postAcronyms,
 updateAcronym,
 deleteAcronym,
} = require("./acronyms_handlers");

//handlers are obtaind here for USER
const {
 getUsers,
 getUserById,
 userCart,
 deleteUserCart,
 updateUserCart,
 deleteCartItem,
} = require("./user_handlers");

//includes setheader and options so i can contact with backend with my frontend localhost
express()
 .use(morgan("dev"))
 .use(express.json())
 .use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
 })

 .options("*", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).send();
 })

 // endpoints are written here

 //endpoints for acronyms
 .get("/acronyms", getAcronyms)

 .post("/acronyms", postAcronyms)

 .patch("/acronyms/:_id", updateAcronym)

 .delete("/acronyms/:_id", deleteAcronym)
 //endpoints for acronyms ends here

 //endpoints for user
 .get("/user", getUsers)

 .get("/user/:_id", getUserById)

 .post("/user/:_id/cart", userCart)

 .patch("/user/:_id/cart", updateUserCart)

 .delete("/user/:_id/cart", deleteUserCart)

 .delete("/user/:_id/cart/:productId", deleteCartItem)
 //endpoint for user ends here

 //test endpoints
 .get("/", (req, res) => {
  res.json("Test");
 })

 .get("/test", (req, res) => {
  res.status(200).json({
   status: 200,
   test: "route to test",
  });
 })

 //end of endpoints

 .listen(port, () => {
  console.log(`Server listening on port ${port}`);
 });
