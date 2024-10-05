import React, { useState } from "react";

// String Calculator Logic
const add = (input: string): number => {
  // Normalize the input: Replace escaped newlines with actual newlines
  input = input.replace(/\\n/g, "\n");

  // Trim surrounding quotes and whitespace from the input
  input = input.replace(/^"|"$/g, "").trim();

  if (input.trim() === "") return 0; // Return 0 for empty input

  // Default delimiters: commas and newlines
  let delimiters = [",", "\n"];
  let numbers = input;

  // Handle custom delimiter in the format "//[delimiter]\n"
  if (input.startsWith("//")) {
    const parts = input.split("\n");
    const customDelimiter = parts[0].substring(2).trim(); // Extract custom delimiter after "//"
    delimiters.push(customDelimiter); // Add custom delimiter to the list

    // The remaining part of the string contains the numbers
    numbers = parts.slice(1).join("\n");
  }

  // Create a regex pattern to split the numbers based on the delimiters
  const regex = new RegExp(
    `[${delimiters
      .map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("")}]`
  ); // Escape delimiters

  // Split the input string into an array based on the delimiters
  const values = numbers
    .split(regex)
    .map((value) => value.trim())
    .filter((value) => value !== ""); // Filter out empty values

  // Initialize sum and check for negative numbers
  let sum = 0;
  const negativeNumbers: number[] = [];

  // Iterate through the array of values
  values.forEach((value) => {
    const num = parseInt(value, 10); // Trim whitespace before parsing

    if (isNaN(num)) return; // Skip invalid or empty values

    if (num < 0) {
      // If the number is negative, collect it for error handling
      negativeNumbers.push(num);
    } else if (num <= 1000) {
      // Ignore numbers greater than 1000
      sum += num;
    }
  });

  // If there are any negative numbers, throw an error
  if (negativeNumbers.length > 0) {
    throw new Error(
      `Negative numbers not allowed: ${negativeNumbers.join(", ")}`
    );
  }

  return sum;
};

const StringCalculator: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    setError(""); // Clear any previous error

    try {
      const trimmedInput = input.trim(); // Trim any extra whitespace
      const sum = add(trimmedInput); // Calculate and set the result
      setResult(sum);
    } catch (e: any) {
      setResult(null); // Clear the result on error
      setError(e.message); // Set the error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-stone-600 via-neutral-500 to-stone-600 text-white">
      <div className="bg-gradient-to-r from-neutral-700 via-stone-600 to-neutral-700 p-8 rounded-lg shadow-lg md:w-full w-[95%] max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-teal-400">
          String Calculator
        </h1>
        <label className="block mb-2 text-gray-300">Enter numbers:</label>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-teal-400 bg-neutral-600 text-white"
          value={input} // Bind the input value to the state
          placeholder='e.g., "1,2,3" or "//;\n1;2;3"'
          onChange={(e) => setInput(e.target.value)} // Update state on change
        />
        <button
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
          onClick={handleCalculate} // Handle calculation on button click
        >
          Calculate
        </button>
        {result !== null && (
          <div className="mt-4 p-4 bg-green-600 text-green-200 border border-green-400 rounded">
            <h2 className="text-xl">Result: {result}</h2>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-600 text-red-200 border border-red-400 rounded">
            <h2 className="text-xl">{error}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default StringCalculator;
