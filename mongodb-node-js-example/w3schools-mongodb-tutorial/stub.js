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
// node node mongodb-node-js-example\w3schools-mongodb-tutorial\stub.js

import { firstNames, lastNames } from './names.js';

function getRandomInt(stringsObj)
{
    const item = Object.values = Object.values(stringsObj);
    return item[Math.floor(Math.random() * item.length)];
}

const { MongoClient } = require('mongodb');

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
    
    // Insert more as a loop
    const { firstNames, lastNames } = await import('./names.js');
    const count = Math.min(firstNames.length, lastNames.length);
    for (let i = 0; i < count; i++) {
      const name = `${firstNames[i]} ${lastNames[i]}`;
      const age = 18 + Math.floor(Math.random() * 13);
      const res = await collection.insertOne({ name, age, major: 'Undeclared' });
    }


    // Read
    const findResult = await collection.findOne({ name: "John Doe" });
    console.log('Found document:', findResult);
    const findAllresult = await collection.find().toArray();
    console.log('Displaying entire db:', findAllresult);

    // Clear Jon Doe specifically, he's a duplicate and misspelled
    const deleteJohnDoes = await collection.deleteOne({ name: "Jon Doe" });
    console.log("Deleted Jon Does:", deleteJohnDoes.deletedCount);

    // I was impatient and refreshed a bunch while creating myself, making duplicates, so we clear me from the DB and crate a single one.
    const deleteMes = await collection.deleteMany({ name: "Daniel Carlsen"});
    console.log("Deleted " + deleteMes.deletedCount + " copies of myself");
    const createMe = await collection.insertOne({ name: "Daniel Carlsen", age: 32, major: "Biotechnology"});
    const findMe = await collection.findOne({ name: "Daniel Carlsen", age: 33});
    console.log("Looks like I made a mistake, no hits:", findMe);
    const updateMe = await collection.updateOne({name: "Daniel Carlsen"}, {$set: {age: 33}});
    const findMeAgain = await collection.findOne({ name: "Daniel Carlsen", age: 33});
    console.log("Am I here yet?", findMeAgain);

    // Empty the collection (do not drop the database)
    const clearAll = await collection.deleteMany({});
    console.log('Cleared documents count:', clearAll.deletedCount);

  } catch (err) {
    console.error('Error: ', err);
  } finally {
    console.log('Closing connection...');
    await client.close();
  }
}

main();