import React, { useState, useEffect } from "react";
import axios from "axios";
import PercentChange from "../components/PercentChange";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
const TrendingCoins = ({ name }) => {
  const [trendingData, setTrendingData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/search/trending`
        );
        const data = response.data;
        setTrendingData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!trendingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="trendingCoins-container">
      {trendingData.coins
        .filter((coins) => {
          if (coins.item.name !== name) {
            return coins;
          } else {
            return null;
          }
        })
        .slice(0, 10)
        .map((coins, index) => (
          <NavLink to={`/${coins.item.id}`}>
            <div key={index} className="card-container">
              <img src={coins.item.thumb} alt="" />
              <p className="name">{coins.item.name}</p>
              <div className="price-evol">
                <p className="price">$ {coins.item.data.price.toFixed(2)}</p>

                {coins.item.data.price_change_percentage_24h.usd >= 0 ? (
                  <p className="arrow-green">
                    <BsCaretUpFill />
                  </p>
                ) : (
                  <p className="arrow-red">
                    <BsCaretDownFill />
                  </p>
                )}
                <p>
                  <PercentChange
                    percent={coins.item.data.price_change_percentage_24h.usd}
                  />
                </p>
              </div>
            </div>
          </NavLink>
        ))}
    </div>
  );
};

export default TrendingCoins;
