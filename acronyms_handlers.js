"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
 useNewUrlParser: true,
 useUnifiedTopology: true,
};

//generated unique id
const { v4: uuidv4 } = require("uuid");

// returns all acronyms and has fuzzy search,
const getAcronyms = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);

 try {
  await client.connect();
  console.log("client on");

  const db = client.db("data");
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search;
  const pageSize = parseInt(req.query.limit) || 10;

  // build query object based on search parameter
  const query = search ? { acronym: { $regex: search, $options: "i" } } : {};

  const count = await db.collection("acronyms").countDocuments(query);

  //gets list of acronyms that is sorted alphabetically and limited to certain amount of pages
  const data = await db
   .collection("acronyms")
   .find(query)
   .sort({ acronym: 1 })
   .skip((page - 1) * pageSize)
   .limit(pageSize)
   .toArray();

  //calculates total number of pages
  const totalPages = Math.ceil(count / pageSize);

  //determines if theres a next page
  const hasNextPage = page < totalPages;

  //determines if theres a previous page
  const hasPrevPage = page > 1;

  //returns 404 if no results found
  if (search && data.length === 0) {
   return res.status(404).json({ status: 404, message: "No results found" });
  }

  //displays the following info based on variables
  const response = {
   status: 200,
   data,
   page,
   totalPages,
   pageSize,
   hasNextPage,
   hasPrevPage,
  };

  res
   .status(200)
   .header("X-Total-Count", count)
   .header("X-Page-Count", totalPages)
   .header("X-Page-Size", pageSize)
   .json(response);
 } catch (error) {
  console.log(error);
  res.status(500).json({ status: 500, message: "Error fetching acronyms" });
 } finally {
  client.close();
  console.log("client off");
 }
};

//post new acronyms
const postAcronyms = async (req, res) => {
 const { acronym, definition } = req.body;

 const client = new MongoClient(MONGO_URI, options);
 try {
  await client.connect();

  const db = client.db("data");

  //verifies if theres any existing acronyms
  const existingAcronym = await db.collection("acronyms").findOne({ acronym });

  if (existingAcronym) {
   return res
    .status(404)
    .json({ status: 404, error: "Acronym already exists" });
  }

  //verifies if theres any existing definitions
  const existingDefinition = await db
   .collection("acronyms")
   .findOne({ definition });

  if (existingDefinition && existingDefinition.acronym !== acronym) {
   return res
    .status(404)
    .json({ status: 404, error: "Definition already exists" });
  }

  //verifies if the inputed values are verified
  if (
   !acronym ||
   !definition ||
   typeof acronym !== "string" ||
   typeof definition !== "string"
  ) {
   return res.status(404).json({ status: 404, error: "Invalid input" });
  }

  //generates a new acronym with the following keys/values
  const newAcronym = {
   _id: uuidv4(),
   acronym,
   definition,
  };

  await db.collection("acronyms").insertOne(newAcronym);

  return res.status(200).json({ status: 200, data: newAcronym });
 } catch (error) {
  console.log(error);
  res.status(500)({ error: "Error posting acronym" });
 } finally {
  client.close();
 }
};

//patch update acronym
const updateAcronym = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);
 try {
  await client.connect();
  console.log("client on");

  const db = client.db("data");

  //variables to update
  const { acronym, definition } = req.body;

  //params need to contain the _id of acronym
  const _id = req.params._id;

  //if acronym/definiton not valid, then 404 error
  if (!acronym || !definition) {
   return res
    .status(404)
    .json({ status: 404, error: "Missing required fields" });
  }

  //finds the information corresponding to _id to let a change happen in acronym + definiton.
  const updateAcronym = await db
   .collection("acronyms")
   .findOneAndUpdate(
    { _id },
    { $set: { acronym, definition } },
    { returnOriginal: false }
   );

  //if acronym returns null, user will receive 404, due to acronym not found
  if (!updateAcronym.value) {
   return res.status(404).json({ status: 404, message: "Acronym not found" });
  }

  res
   .status(200)
   .json({ status: 200, acronym_status: "updated", data: updateAcronym.value });
 } catch (error) {
  console.log(error);
  res.status(500).json({ status: 500, error: "Error updating acronym" });
 } finally {
  client.close();
 }
};

//deletes acronym based on their ID
const deleteAcronym = async (req, res) => {
 const client = new MongoClient(MONGO_URI, options);

 try {
  await client.connect();
  console.log("client on");

  const db = client.db("data");

  const _id = req.params._id;

  //if not correct _id return 404
  if (!_id) {
   return res
    .status(404)
    .json({ status: 404, message: "Missing or invalid _id parameter" });
  }

  const result = await db.collection("acronyms").deleteOne({ _id: _id });

  // if theres no recent deletions then acronym doesnt exist
  if (!result.deletedCount) {
   return res.status(404).json({ status: 404, message: "Acronym not found" });
  }

  res.status(200).json({ status: 200, message: "Acronym deleted" });
 } catch (error) {
  console.log(error);
  res.status(500).json({ status: 500, message: "Error deleting acronym" });
 } finally {
  await client.close();
  console.log("client off");
 }
};

module.exports = {
 getAcronyms,
 postAcronyms,
 updateAcronym,
 deleteAcronym,
};
