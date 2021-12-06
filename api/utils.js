"use strict";

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
