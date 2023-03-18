"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
 useNewUrlParser: true,
 useUnifiedTopology: true,
};

//gets all users
const getUsers = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);

 try {
  await client.connect();
  console.log("client on");

  const db = client.db("data");

  const user = await db.collection("user").find().toArray();

  if (user.length > 0) {
   res.status(200).json({ status: 200, user });
  } else {
   res.status(404).send({ status: 404, message: "User not found" });
  }
 } catch (error) {
  console.error(error);
  res.status(500).json("Error getting information");
 } finally {
  await client.close();
  console.log("client off");
 }
};

//gets user by id
const getUserById = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);

 try {
  await client.connect();
  console.log("client on");

  const db = client.db("data");
  const _id = req.params._id;

  const user = await db.collection("user").findOne({ _id: _id });

  if (user) {
   res.status(200).json({ status: 200, user });
  } else {
   res.status(404).send({ status: 404, message: "User not found" });
  }

  console.log(user);
 } catch (error) {
  console.error(error);
  res.status(500).json("Error getting information");
 } finally {
  await client.close();
  console.log("client off");
 }
};

//post method for the cart
const userCart = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);

 try {
  await client.connect();
  console.log("client on");
  const _id = req.params._id;
  const { productId, product, image, price, quantity } = req.body;

  const db = client.db("data");
  const usersCollection = db.collection("user");

  // check if cart item by id already exists and increment the quantity if it does
  const existingCartItem = await usersCollection.findOneAndUpdate(
   {
    _id,
    "cart.productId": productId,
   },
   {
    $inc: {
     "cart.$.quantity": 1,
     totalPrice: price, // Update totalPrice when item quantity is incremented
    },
   },
   { returnOriginal: false }
  );

  // if cart item does not exist, add it to the cart array
  if (!existingCartItem.value) {
   const updateCart = await usersCollection.updateOne(
    { _id: _id },
    {
     $push: { cart: { productId, product, image, price, quantity } },
     $inc: { totalPrice: price * quantity }, // Update totalPrice when new item is added
    }
   );

   //required fieldsm or else return 404
   if (!productId || !product || !price || !quantity || !image) {
    return res
     .status(404)
     .json({ status: 404, error: "Missing required fields" });
   }

   //update if acknowledgge
   if (updateCart.acknowledged) {
    res.status(200).json({
     status: 200,
     message: "User's cart has been updated",
    });
   } else {
    res.status(500).json({
     status: 500,
     message: "Cart has not been updated",
    });
   }
  } else {
   res.status(200).json({
    status: 200,
    message: "Cart item quantity has been incremented",
   });
  }
 } catch (err) {
  console.error(err);
  res.status(500).json({ status: 500, message: "Error posting cart" });
 } finally {
  await client.close();
 }
};

//patch update cart
const updateUserCart = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);
 try {
  await client.connect();
  console.log("client on");

  const db = client.db("data");

  //variables needed to update
  const { quantity, product, price } = req.body;

  //params need to contain the _id of user to access cart
  const _id = req.params._id;

  //if variables not valid, then 404 error
  if (!product || !price) {
   return res
    .status(404)
    .json({ status: 404, error: "Missing required fields" });
  }

  // check if cart item to update already has the same quantity and product values
  const user = await db.collection("user").findOne({ _id });
  const cartItem = user.cart.find((item) => item.product === product);

  // if quantity is 0, remove the item from the cart
  if (quantity === 0) {
   const updateUserCart = await db
    .collection("user")
    .findOneAndUpdate(
     { _id },
     { $pull: { cart: { product } } },
     { returnOriginal: false }
    );

   if (!updateUserCart.value) {
    return res.status(404).json({ status: 404, message: "Cart not found" });
   }

   return res
    .status(200)
    .json({ status: 200, cart_status: "updated", data: updateUserCart.value });
  }

  if (cartItem && cartItem.quantity === quantity && cartItem.price === price) {
   return res
    .status(404)
    .json({ status: 404, error: "Resource has not been modified" });
  }

  //set necessary id, and change the following info
  const updateUserCart = await db
   .collection("user")
   .findOneAndUpdate(
    { _id: _id, "cart.product": product },
    { $set: { "cart.$.quantity": quantity, "cart.$.price": price } },
    { returnOriginal: false }
   );

  //if cart returns null, user will receive 404, due to cart not found
  if (!updateUserCart.value) {
   return res.status(404).json({ status: 404, message: "Cart not found" });
  }

  res
   .status(200)
   .json({ status: 200, cart_status: "updated", data: updateUserCart.value });
 } catch (error) {
  console.log(error);
  res.status(500).json({ status: 500, error: "Error updating cart" });
 } finally {
  client.close();
 }
};

//delete cart !--- purposely used to clear the whole cart to not ruin cart database
const deleteUserCart = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);

 try {
  await client.connect();
  console.log("client on");
  const _id = req.params._id;

  const db = client.db("data");
  const usersCollection = db.collection("user");

  // check if user document exists and has a cart
  const user = await usersCollection.findOne({ _id: _id });
  if (!user || !user.cart) {
   return res.status(404).json({
    status: 404,
    message: "User or cart doesn't exist",
   });
  }

  // deletes the info of user's cart
  await usersCollection.updateOne({ _id: _id }, { $unset: { cart: "" } });

  res.status(200).json({ status: 200, message: "Cart deleted" });
 } catch (err) {
  console.error(err);
  res.status(500).json({ status: 500, message: "Error deleting cart" });
 } finally {
  await client.close();
 }
};

//deletes an item in the users cart based on the productId
const deleteCartItem = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);

 try {
  await client.connect();
  console.log("client on");

  const { _id, productId } = req.params;

  if (!productId) {
   return res.status(400).json({
    status: 400,
    message: "productId not specified",
   });
  }

  const db = client.db("data");
  const usersCollection = db.collection("user");

  // check if user document exists and has a cart
  const user = await usersCollection.findOne({ _id });
  if (!user || !user.cart) {
   return res.status(404).json({
    status: 404,
    message: "User or cart doesn't exist",
   });
  }

  // find the cart item to delete
  const cartItem = user.cart.find((item) => item.productId === productId);

  if (!cartItem) {
   return res.status(404).json({
    status: 404,
    message: "productId invalid or no product to delete",
   });
  }

  // Calculate the new totalPrice after subtracting the total price of the deleted item
  const newTotalPrice = parseFloat(
   (user.totalPrice - cartItem.price * cartItem.quantity).toFixed(2)
  );

  // remove the item from user's cart and update totalPrice
  const result = await usersCollection.updateOne(
   { _id },
   {
    $pull: { cart: { productId } },
    $set: { totalPrice: newTotalPrice }, // Set the updated totalPrice
   }
  );

  if (result.modifiedCount === 0) {
   return res.status(404).json({
    status: 404,
    message: "productId invalid or no product to delete",
   });
  }

  res.status(200).json({
   status: 200,
   message: "Cart item deleted",
  });
 } catch (err) {
  console.error(err);
  res.status(500).json({
   status: 500,
   message: "Error deleting cart item",
  });
 } finally {
  await client.close();
 }
};

module.exports = {
 getUsers,
 getUserById,
 userCart,
 deleteUserCart,
 updateUserCart,
 deleteCartItem,
};
