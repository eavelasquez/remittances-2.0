"use strict";

// Create a MongoDBClient
import connect from "../lib/mongodb-client";
import Remittance from "../models/Remittance";

/**
 * HTTP post method to add one remittance to a MongoDB.
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  // All log statements are written to logger.
  console.info("input req:", req);

  // Get the MongoClient by calling await on the promise.
  // Because it's promise, it will only resolve once.
  await connect();

  try {
    const { method, body } = req;
    if (method !== "POST") {
      throw new Error(
        `This function only accepts POST method, you tried: ${method} method.`
      );
    }

    const remittance = await Remittance.create(
      { ...body, PIN: randomUnique(999999, 1)[0].toString() },
    ); /* create a new model in the database */

    const response = {
      success: true,
      data: {
        message: "Successfully added a remittance to the database.",
        remittance,
      },
    };

    // All log statements are written to logger.
    console.info(`response body: ${response}`);
    // Use the client to return the name of the connected database.
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Generate unique (non-repeating) random numbers.
 *
 * @param {number} range - The range of numbers to generate.
 * @param {number} count - The number of numbers to generate.
 * @returns {number[]} - An array of unique random numbers.
 * @example randomUnique(10, 5) // [5, 7, 9, 1, 3] (5 unique numbers)
 */
const randomUnique = (range, count) => {
  let numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (range - 1 + 1) + 1));
  }
  return [...numbers];
};
