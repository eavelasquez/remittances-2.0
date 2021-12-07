"use strict";

// Create a MongoDBClient
import connect from "../lib/mongodb-client";
import Remittance from "../models/Remittance";

/**
 * HTTP post method to add one remittance to a MongoDB.
 * @param {*} req
 * @param {*} res
 */
export default handler = async (req, res) => {
  // All log statements are written to CloudWatch
  console.info("input req:", req);

  // Get the MongoClient by calling await on the promise.
  // Because it's promise, it will only resolve once.
  await connect();

  try {
    if (req.method !== "POST") {
      throw new Error(
        `This function only accepts POST method, you tried: ${req.method} method.`
      );
    }
    const remittance = await Remittance.create(req.body);

    const response = {
      code: 201,
      result: {
        message: "Successfully added a remittance to the database.",
        remittance: { ...remittance, PIN: randomUnique(999999, 1)[0] }
      },
    };

    // All log statements are written to CloudWatch
    console.info(
      `response from: ${req.path} statusCode: ${response.code} body: ${response}`
    );
    // Use the client to return the name of the connected database.
    res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    // client.close();
  }
};

/**
 * Generate unique (non-repeating) random numbers.
 *
 * @param {number} range - The range of numbers to generate.
 * @param {number} count - The number of numbers to generate.
 * @returns {number[]} - An array of unique random numbers.
 * @example randomUnique(10, 5) // [5, 7, 9, 1, 3] (5 unique numbers)
 */
export const randomUnique = (range, count) => {
  let numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (range - 1 + 1) + 1));
  }
  return [...numbers];
};
