"use strict";

// Create a MongoDBClient
const clientPromise = require("./mongodb-client");

/**
 * HTTP post method to add one remittance to a MongoDB.
 * @param {*} req
 * @param {*} res
 */
export default handler = async (req, res) => {
  if (req.method !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${req.method} method.`
    );
  }

  // All log statements are written to CloudWatch
  console.info("input req:", req);
  // Get the MongoClient by calling await on the promise.
  // Because it's promise, it will only resolve once.
  const client = await clientPromise;

  const response = {
    code: 200,
    result: {
      message: "Successfully added a remittance to the database.",
      dbName: client.db().databaseName,
    },
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${req.path} statusCode: ${response.code} body: ${response}`
  );

  // Use the client to return the name of the connected database.
  res.status(response.code).json(response);
};
