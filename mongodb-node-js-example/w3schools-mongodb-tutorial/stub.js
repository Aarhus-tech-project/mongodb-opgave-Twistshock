// W3schools MongoDB tutorial
// https://www.w3schools.com/mongodb/index.php

// Install Docker Desktop:
// winget install Docker.DockerDesktop

// Install Node.js:
// npm init -y
// npm install mongodb

// Run Docker Desktop:
// docker run --name mongodb -d -p 27017:27017 mongo:latest

// Run Node.js example:
// node mongodb-node-js-example\w3schools-mongodb-tutorial\stub.js

import { MongoClient } from 'mongodb';
import { names } from './names.js';

function getRandomInt(stringsObj)
{
    const item = Object.values = Object.values(stringsObj);
    return item[Math.floor(Math.random() * item.length)];
}

//const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);
const dbName = 'school';
const collectionName = 'students'
const studentCount = 20;
const minAge = 18;
const maxage = 25;

async function main() {
  
  // Connect to db
  try {
    await client.connect();
    console.log('Connected successfully to server');
  } catch (err) {
    console.error('CRITICAL: Could not connect to database.', err);
    return; 
  }

  // Db operations
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert one
    const insertOneResult = await collection.insertOne(
    {
      name: "John Doe",
      age: 25,
      major: "Computer Science"
    });
    console.log('Inserted document:', insertOneResult.insertedId);

    // Insert many
    const insertManyResult = await collection.insertMany([
    {
      name: "Jane Doe",
      age: 26,
      major: "Astrophysics"
    },
    {
      name: "Jon Doe",
      age: 25,
      major: "Computer Science"
    },
    {
      name: "Daniel Carlsen",
      age: 33,
      major: "Biotechnology"
    },
    {
      name: "Daniel Carlsen",
      age: 33,
      major: "Biotechnology"
    },
    {
      name: "Daniel Carlsen",
      age: 33,
      major: "Biotechnology"
    }]);
    console.log('Inserted documents:', insertManyResult.insertedCount, insertManyResult.insertedIds);
    
    // Create additional students.
    for (let i = 0; i < studentCount; i++) {
      const firstName = names.firstNames[Math.floor(Math.random() * names.firstNames.length)];
      const lastName = names.lastNames[Math.floor(Math.random() * names.lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const major = names.majors[Math.floor(Math.random() * names.majors.length)];
      const age = 18 + Math.floor(Math.random() * 13);
      const res = await collection.insertOne({ name, age, major });
    }


    // findOne
    const findResult = await collection.findOne({ name: "John Doe" });
    console.log('Found document:', findResult);
    // Find with sorting, filtering, and omission of _id field
    // Show all CompSci students sans _id, youngest first, partial match on major.
    const findAllSortedresult = await collection.find({ major: /Computer/ }, { projection: { _id: 0 } }).sort({ age: 1 }).toArray();
    console.log('Displaying compsci:', findAllSortedresult);

    // Delete Jon Doe specifically, he's a duplicate and misspelled
    const deleteJohnDoes = await collection.deleteOne({ name: "Jon Doe" });
    console.log("Deleted Jon Does:", deleteJohnDoes.deletedCount);

    // Delete Daniel Carlsen, too many entries
    const deleteMes = await collection.deleteMany({ name: "Daniel Carlsen"});
    console.log("Deleted " + deleteMes.deletedCount + " copies of myself");

    // Update with upsert - Create Daniel Carlsen again, but with an upsert
    const upsertMe = await collection.updateOne(
      { name: "Daniel Carlsen" },
      { $set: { name: "Daniel Carlsen", age: 32, major: "Biotechnology" } },
      { upsert: true }
    );
    const findMe1 = await collection.findOne({name: "Daniel Carlsen"})
    console.log("Hit", findMe1)
    // Update - Correct the age
    const updateMe = await collection.updateOne(
      { name: "Daniel Carlsen" },
      { $set: { age: 33 } },
      { upsert: true }
    );
    // verify
    const findMe2 = await collection.findOne({name: "Daniel Carlsen"})
    console.log("Hit2:", findMe2)
    // Update - Correct CompSci
      const updateCompSci = await collection.updateMany(
      { major: "Computer Sience" },
      { $set: { major: "Computer Science" } },
    );
    // Show whole unsorted DB sans _id (keeps it one line per entry in the terminal on my pc)
    const findAll = await collection.find({}, { projection: { _id: 0 } }).toArray();
    console.log('Displaying entire db:', findAll);

    // Running out of steam going through all operations from the mongodb tutorial,
    // so I'm just going to speed through the rest

    //
    // Additional find queries
    //

    // I'm going to keep omitting _id for the sake of compact outputs
    const proj = { projection: { _id: 0 } };

    // Comparison Operators
    console.log("$gt - older than 25:", await collection.find({ age: { $gt: 25 } }, proj).toArray());
    console.log("$gte - 25 or older:", await collection.find({ age: { $gte: 25 } }, proj).toArray());
    console.log("$lt - younger than 25:", await collection.find({ age: { $lt: 25 } }, proj).toArray());
    console.log("$lte - 25 or younger:", await collection.find({ age: { $lte: 25 } }, proj).toArray());
    console.log("$eq - exactly 25:", await collection.find({ age: { $eq: 25 } }, proj).toArray());
    console.log("$ne - not 25:", await collection.find({ age: { $ne: 25 } }, proj).toArray());
    console.log("$in - Science and Tech:", await collection.find({ major: { $in: ["Computer Science", "Biotechnology", "Astrophysics"] } }, proj).toArray());
    console.log("$nin - Others:", await collection.find({ major: { $nin: ["Computer Science", "Biotechnology", "Astrophysics"] } }, proj).toArray());

    // Logical Operators
    console.log("$and - 25 & CompSci:", await collection.find({ $and: [{ age: 25 }, { major: "Computer Science" }] }, proj).toArray());
    console.log("$or - under 20 or over 30:", await collection.find({ $or: [{ age: { $lt: 20 } }, { age: { $gt: 30 } }] }, proj).toArray());
    console.log("$nor - between 20-30:", await collection.find({ $nor: [{ age: { $lt: 20 } }, { age: { $gt: 30 } }] }, proj).toArray());
    console.log("$not - not older than 25:", await collection.find({ age: { $not: { $gt: 25 } } }, proj).toArray());

    // Evaluation Operators
    console.log("$regex - starts with J:", await collection.find({ name: { $regex: /^J/ } }, proj).toArray());
    console.log("$regex - contains 'doe':", await collection.find({ name: { $regex: /doe/i } }, proj).toArray());
    console.log("$expr - age >= 25:", await collection.find({ $expr: { $gte: ["$age", 25] } }, proj).toArray());
    console.log("$mod - age divisible by 5:", await collection.find({ age: { $mod: [5, 0] } }, proj).toArray());
    // Creating an index for $text
    // Also covers "Indexing & Search" on W3schools
    await collection.createIndex({ major: "text" }); // Text requires an index
    console.log("$text - search 'Science':", await collection.find({ $text: { $search: "Science" } }, proj).toArray());

    //
    // Update Operators
    //

    // --- Field Operators ---
    // $set: Sets the value of a field
    await collection.updateOne({ name: "John Doe" }, { $set: { gpa: 3.5 } });
    // $currentDate: Sets the field value to the current date
    await collection.updateOne({ name: "John Doe" }, { $currentDate: { lastModified: true } });
    // $inc: Increments the field value
    await collection.updateOne({ name: "John Doe" }, { $inc: { age: 1 } });
    // $rename: Renames the field
    await collection.updateOne({ name: "John Doe" }, { $rename: { gpa: "gradePointAverage" } });
    console.log("After field updates:", await collection.findOne({ name: "John Doe" }));
    // $unset: Removes the field from the document
    await collection.updateOne({ name: "John Doe" }, { $unset: { gradePointAverage: "", lastModified: "" } });
    console.log("After $unset:", await collection.findOne({ name: "John Doe" }));

    //
    // Array Operators
    //
    // First, add an array field to work with
    await collection.updateOne({ name: "John Doe" }, { $set: { courses: ["Math", "Physics"] } });
    // $push: Adds an element to an array
    await collection.updateOne({ name: "John Doe" }, { $push: { courses: "Chemistry" } });
    console.log("After $push:", await collection.findOne({ name: "John Doe" }, proj));
    // $addToSet: Adds distinct elements to an array
    await collection.updateOne({ name: "John Doe" }, { $addToSet: { courses: "Math" } }); // Alreadyy exists, so it won't add it
    await collection.updateOne({ name: "John Doe" }, { $addToSet: { courses: "Biology" } }); // Will add
    console.log("After $addToSet:", await collection.findOne({ name: "John Doe" }, proj));
    // $pop: Removes the first or last element of an array
    await collection.updateOne({ name: "John Doe" }, { $pop: { courses: 1 } }); // Remove last
    console.log("After $pop:", await collection.findOne({ name: "John Doe" }, proj));
    // $pull: Removes all elements from an array that match the query
    await collection.updateOne({ name: "John Doe" }, { $pull: { courses: "Physics" } });
    console.log("After $pull:", await collection.findOne({ name: "John Doe" }, proj));

    //
    // Aggregation Operators
    //

    // $match
    console.log("$match - CompSci students:", await collection.aggregate([
      { $match: { major: "Computer Science" } }
    ]).toArray());

    // $project
    console.log("$project - names only:", await collection.aggregate([
      { $project: { _id: 0, name: 1, major: 1 } }
    ]).toArray());

    // $sort
    console.log("$sort - by age desc:", await collection.aggregate([
      { $sort: { age: -1 } },
      { $project: { _id: 0, name: 1, age: 1 } }
    ]).toArray());

    // $limit
    console.log("$limit - 3 oldest:", await collection.aggregate([
      { $sort: { age: -1 } },
      { $limit: 3 },
      { $project: { _id: 0, name: 1, age: 1 } }
    ]).toArray());

    // $count
    console.log("$count - total students:", await collection.aggregate([
      { $count: "totalStudents" }
    ]).toArray());

    // $group
    console.log("$group - count by major:", await collection.aggregate([
      { $group: { _id: "$major", count: { $sum: 1 }, avgAge: { $avg: "$age" } } },
      { $sort: { count: -1 } }
    ]).toArray());

    // $addFields
    console.log("$addFields - add graduation year:", await collection.aggregate([
      { $match: { name: "John Doe" } },
      { $addFields: { graduationYear: { $add: [2026, { $subtract: [22, "$age"] }] } } },
      { $project: { _id: 0, name: 1, age: 1, graduationYear: 1 } }
    ]).toArray());

    // $lookup - Join with another collection (create a temp collection for demo)
    const majorsCollection = db.collection("majors");
    await majorsCollection.insertMany([
      { name: "Computer Science", department: "Engineering" },
      { name: "Astrophysics", department: "Physics" },
      { name: "Biotechnology", department: "Life Sciences" }
    ]);
    console.log("$lookup - join with majors:", await collection.aggregate([
      { $match: { name: "John Doe" } },
      { $lookup: { from: "majors", localField: "major", foreignField: "name", as: "majorInfo" } },
      { $project: { _id: 0, name: 1, major: 1, majorInfo: 1 } }
    ]).toArray());

    // $out - Write results to a new collection
    await collection.aggregate([
      { $match: { major: "Computer Science" } },
      { $project: { _id: 0, name: 1, age: 1, major: 1 } },
      { $out: "compSciStudents" }
    ]).toArray();
    const compSciCollection = db.collection("compSciStudents");
    console.log("$out - compSciStudents collection:", await compSciCollection.find({}).toArray());

    // Cleanup temp collections


    // Empty the collection, clear indexes, drop collections
    const clearAll = await collection.deleteMany({});
    await collection.dropIndex("major_text")
    await majorsCollection.drop();
    await compSciCollection.drop();
    console.log('Cleared documents count:', clearAll.deletedCount);

  } catch (err) {
    console.error('Error: ', err);
  } finally {
    console.log('Closing connection...');
    await client.close();
  }
}

main();