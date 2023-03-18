const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const { MONGO_URI } = process.env;

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true });

async function importData() {
 try {
  await client.connect();

  //name of databse to be called data
  const database = client.db("data");

  //route of data.js containing acronyms
  const data = require("./my-app/backend/data");

  console.log(data);

  //collections to be called accronyms
  const acronymCollection = database.collection("acronyms");

  //  acronyms data as mapped:
  const acronym = data.acronyms.map((acronyms) => {
   return {
    _id: acronyms._id,
    acronym: acronyms.acronym,
    definition: acronyms.definition,
   };
  });

  const acronymResult = await acronymCollection.insertMany(acronym);
  console.log(`${acronymResult.insertedCount} acronyms were inserted.`);
 } catch (err) {
  console.error(err);
 } finally {
  await client.close();
 }
}

importData();
