import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";
import colors from "../styles/_settings.scss";

const CoinChart = ({ coinId, coinName, coins }) => {
  const [coinData, setCoinData] = useState();
  const [duration, setDuration] = useState(30);
  const [theme, setTheme] = useState("");
  const headerData = [
    [1, "1 jour"],
    [3, "3 jours"],
    [7, "7 jours"],
    [30, "1 mois"],
    [91, "3 mois"],
    [181, "6 mois"],
    [365, "1 an"],
    [3000, "Max"],
  ];

  const colorChart = () => {
    switch (duration) {
      case 1:
        if (coins.price_change_percentage_24h_in_currency < 0) {
          return setTheme("colors.red2");
        } else {
          return setTheme("colors.green1");
        }
      case 7:
        if (coins.price_change_percentage_7d_in_currency < 0) {
          return setTheme("colors.red2");
        } else {
          return setTheme("colors.green1");
        }
      case 30:
        if (coins.price_change_percentage_30d_in_currency < 0) {
          return setTheme("colors.red2");
        } else {
          return setTheme("colors.green1");
        }
      case 181:
        if (coins.price_change_percentage_200d_in_currency < 0) {
          return setTheme("colors.red2");
        } else {
          return setTheme("colors.green1");
        }
      case 365:
        if (coins.price_change_percentage_1y_in_currency < 0) {
          return setTheme("colors.red2");
        } else {
          return setTheme("colors.green1");
        }
      default:
        setTheme("colors.green1");
    }
  };

  useEffect(() => {
    let dataArray = [];

    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${duration}${
          duration > 32 ? "&interval=daily" : ""
        }`
      )
      .then((res) => {
        for (let i = 0; i < res.data.prices.length; i++) {
          let price = res.data.prices[i][1];

          dataArray.push({
            date: new Date(res.data.prices[i][0]).toLocaleDateString(),
            price: price < "50" ? price : parseInt(price),
          });
        }
        setCoinData(dataArray);
      });

    colorChart();
  }, [coinId, duration, theme]);

  return (
    <div className="coin-chart">
      <p>{coinName}</p>
      <div className="btn-container">
        {headerData.map((radio) => {
          return (
            <div
              htmlFor={"btn" + radio[0]}
              onClick={() => setDuration(radio[0])}
              key={radio[0]}
              className={radio[0] === duration ? "active-btn" : ""}
            >
              {radio[1]}
            </div>
          );
        })}
      </div>
      <AreaChart
        width={800}
        height={400}
        data={coinData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="7%" stopColor={colors.bgChart} stopOpacity={1} />
            <stop
              offset="93%"
              stopColor={colors.borderChart}
              stopOpacity={0.5}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="price"
          stroke={colors.borderChart}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </div>
  );
};

export default CoinChart;
