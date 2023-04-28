import { useState, useEffect } from "react";
import { DateTime } from "luxon";

export default function Home() {
  const [userInput, setUserInput] = useState<string>("");
  const [marketData, setMarketData] = useState<Record<string, any>>({});

  const handleUploadMarketData = async () => {
    // Validate if the user input is a valid JSON
    let marketData;
    try {
      marketData = JSON.parse(userInput);
    } catch (error) {
      console.error("Invalid JSON format");
      return;
    }

    const response = await fetch("/api/market-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: JSON.stringify(marketData) }),
    });

    if (response.ok) {
      console.log("Market data uploaded");
    } else {
      console.error("Error uploading market data");
    }
  };
  const handleGetMarketData = async () => {
    const response = await fetch("/api/market-data");
    const data = await response.json();

    if (response.ok) {
      console.log("Market data fetched", data);
      setMarketData(data); // Store the fetched data in the marketData state
    } else {
      console.error("Error fetching market data");
    }
  };

  const displayMarketData = () => {
    return (
      <div>
        <h3>Market Data (JSON format):</h3>
        <pre>{JSON.stringify(marketData, null, 2)}</pre>
      </div>
    );
  };
  const handleUploadCalibrationData = async () => {
    // Validate if the user input is a valid JSON
    let calibrationData;
    try {
      calibrationData = JSON.parse(userInput);
    } catch (error) {
      console.error("Invalid JSON format");
      return;
    }

    // Check if the required fields are present in the calibration data
    if (
      !calibrationData ||
      !Array.isArray(calibrationData) ||
      calibrationData.length === 0
    ) {
      console.error("Invalid calibration data format");
      return;
    }

    calibrationData.forEach((data: any) => {
      if (
        !data.scenario ||
        !data.Time ||
        !data.calibration ||
        !data.calibration["Risk-Free Rate"]
      ) {
        console.error("Invalid calibration data format");
        return;
      }
    });

    const response = await fetch("/api/upload_calibration_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(calibrationData),
    });

    if (response.ok) {
      console.log("Calibration data uploaded");
    } else {
      console.error("Error uploading calibration data");
    }
  };
  const handleUploadContractAndRun = async () => {
    // Validate if the user input is a valid JSON
    let contractData;
    try {
      contractData = JSON.parse(userInput);
    } catch (error) {
      console.error("Invalid JSON format");
      return;
    }

    const response = await fetch("/api/upload_contract_and_run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contractData),
    });

    if (response.ok) {
      console.log("Contract uploaded and run");
    } else {
      console.error("Error uploading contract and running");
    }
  };

  const handleCalculatePV = async () => {
    // Fetch the market data from the API
    const response = await fetch("/api/market-data");
    const marketData = await response.json();

    // Extract the required values from the market data
    const priceDate = marketData.priceDate;
    const futurePrice = marketData.futurePrice;
    const volatility = marketData.volatility;
    const maturityDate = marketData.maturityDate;
    const rf = marketData.rf;
    const strike = marketData.strike;

    // Send a POST request to the /api/calculate-pv endpoint with the required data
    const pvResponse = await fetch("/api/calculate-pv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceDate,
        futurePrice,
        volatility,
        maturityDate,
        rf,
        strike,
      }),
    });

    if (pvResponse.ok) {
      const pvData = await pvResponse.json();
      console.log("Call:", pvData.call, "Put:", pvData.put);
    } else {
      console.error("Error calculating PV");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-bold">Option Pricing</h1>
      {/* Upload market data */}
      <div className="glass my-4">
        <h2 className="text-2xl font-bold">Enter Market Data (JSON format)</h2>
        <textarea
          className="w-full h-64 p-2 my-2 border text-black border-gray-300 rounded-lg"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        ></textarea>
        <button
          onClick={handleUploadMarketData}
          className="bg-blue-500 p-4 text-white rounded-lg shadow-lg hover:bg-blue-700"
        >
          Upload Market Data
        </button>
      </div>
      {/* Get market data */}{" "}
      <div className="glass my-4">
        <button
          onClick={handleGetMarketData}
          className="bg-green-500 p-4 text-white rounded-lg shadow-lg hover:bg-green-700"
        >
          Get Market Data
        </button>
        <pre className="bg-gray-100 text-black p-4 rounded-lg mt-4">
          {displayMarketData()}
        </pre>
      </div>
      {/* Upload calibration data */}
      <div className="glass my-4">
        <h2 className="text-2xl font-bold">
          Enter Calibration Data (JSON format)
        </h2>
        <textarea
          className="w-full h-64 p-2 my-2 border text-black border-gray-300 rounded-lg"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        ></textarea>
        <button
          onClick={handleUploadCalibrationData}
          className="bg-blue-500 p-4 text-white rounded-lg shadow-lg hover:bg-blue-700"
        >
          Upload Calibration Data
        </button>
      </div>
      {/* Upload contract and run */}
      <div className="glass my-4">
        <h2 className="text-2xl font-bold">
          Enter Contract Data (JSON format)
        </h2>
        <textarea
          className="w-full h-64 p-2 my-2 border text-black border-gray-300 rounded-lg"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        ></textarea>
        <button
          onClick={handleUploadContractAndRun}
          className="bg-green-500 p-4 text-white rounded-lg shadow-lg hover:bg-green-700"
        >
          Upload Contract and Run
        </button>
      </div>
      {/* Calculate PV */}
      <div className="glass my-4">
        <button
          onClick={handleCalculatePV}
          className="bg-yellow-500 p-4 text-white rounded-lg shadow-lg hover:bg-yellow-700"
        >
          Calculate PV
        </button>
      </div>
    </div>
  );
}
