import React, { useEffect, useState } from "react";
import axios from "axios";

const Historical = ({ days, id }) => {
  const [coinData, setCoinData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
        );
        const data = response.data;
        setCoinData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, days]);

  if (!coinData || !coinData.prices) {
    return <div>Loading...</div>;
  }

  const sortedData = coinData.prices.sort((a, b) => a[1] - b[1]);

  const smallestPrice = sortedData[0][1];
  const largestPrice = sortedData[sortedData.length - 1][1];

  const numberWithSeparator = (number) => {
    return number.toLocaleString("en-US");
  };

  return (
    <div className="prices">
      <p>
        $ {numberWithSeparator(smallestPrice.toFixed(2))} - $
        {numberWithSeparator(largestPrice.toFixed(2))}
      </p>
    </div>
  );
};

export default Historical;
