import axios from "axios";
import React, { useEffect, useState } from "react";
import PercentChange from "../components/PercentChange";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import LinearProgress from "@mui/joy/LinearProgress";
import CoinChart from "../components/CoinChart";
import StartIcon from "../components/StartIcon";

const InfosCoins = () => {
  const [coinData, setCoinData] = useState(null);
  const [result, setResult] = useState();
  const [resultInverse, setResultInverse] = useState(1);
  const [percentageChange, setPercentageChange] = useState(0);
  const idUrl = window.location.pathname;
  const [htmlContent, setHtmlContent] = useState("");
  // const htmlContent = `${coinData.description.en}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins${idUrl}`
        );
        const data = response.data;
        setCoinData(data);
        calculatePercentageChange(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [idUrl]);

  useEffect(() => {
    if (coinData && coinData.description && coinData.description.en) {
      setHtmlContent(coinData.description.en);
    }
  }, [coinData]);

  const calculatePercentageChange = (data) => {
    if (!data) return;
    const { current_price, low_24h, high_24h } = data.market_data;
    const changePercentage =
      ((current_price.usd - low_24h.usd) / (high_24h.usd - low_24h.usd)) * 100;
    setPercentageChange(changePercentage.toFixed(2));
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  if (!coinData) {
    return <div>Loading...</div>;
  }

  // const calcul = (e) => {
  //   setResult(formatNumber(e * coinData.market_data.current_price.usd));

  //   return result;
  // };

  const calculInverse = (e) => {
    setResultInverse(e / coinData.market_data.current_price.usd);

    console.log(resultInverse);
  };

  const calcul = (e) => {
    if (/^\d+$/.test(e)) {
      setResult(formatNumber(e * coinData.market_data.current_price.usd));
    } else {
      setResult(0);
    }

    console.log(result);
  };

  return (
    <div className="info-container">
      <div className="main-infos">
        <div className="left-part">
          <div className="header">
            <div className="start">
              <StartIcon coinId={coinData.id} />
            </div>

            <div className="coins-name">
              <img src={coinData.image.thumb} alt="" />
              <h1 className="name">{coinData.name}</h1>
              <p className="symbol">{coinData.symbol}</p>
              <p className="rank">#{coinData.market_cap_rank}</p>
            </div>
            <div className="price">
              <h1 className="current-price">
                {formatNumber(coinData.market_data.current_price.usd)}
              </h1>
              <h1 className="devise">$US</h1>
              <div className="evol">
                {coinData.market_data.price_change_percentage_24h >= 0 ? (
                  <p className="arrow-green">
                    <BsCaretUpFill />
                  </p>
                ) : (
                  <p className="arrow-red">
                    <BsCaretDownFill />
                  </p>
                )}
                <h3>
                  <PercentChange
                    percent={coinData.market_data.price_change_percentage_24h}
                  />
                </h3>
              </div>
            </div>
            <LinearProgress
              determinate
              value={percentageChange}
              style={{ width: "100%" }}
            />
            <div className="range-infos">
              <p>{formatNumber(coinData.market_data.low_24h.usd)}$US</p>
              <p>24h Range</p>
              <p>{formatNumber(coinData.market_data.high_24h.usd)}$US</p>
            </div>
          </div>

          <div className="array-infos">
            <div className="array-line">
              <p>Market Cap</p>
              <p className="price">
                ${formatNumber(coinData.market_data.market_cap.usd)}
              </p>
            </div>
            <div className="array-line">
              <p>Fully Diluted Valuation</p>
              <p className="price">
                $
                {formatNumber(coinData.market_data.fully_diluted_valuation.usd)}
              </p>
            </div>
            <div className="array-line">
              <p>Circulating Supply</p>
              <p className="price">
                ${formatNumber(coinData.market_data.circulating_supply)}
              </p>
            </div>
            <div className="array-line">
              <p>Total Supply</p>
              <p className="price">
                ${formatNumber(coinData.market_data.total_supply)}
              </p>
            </div>
            <div className="array-line">
              <p>Max Supply</p>
              <p className="price">
                {coinData.market_data.max_supply
                  ? ` $ ${formatNumber(coinData.market_data.max_supply)}`
                  : "∞"}
              </p>
            </div>
          </div>
          <div className="converteur-container">
            <h1>Convertisseur {coinData.symbol.toUpperCase()}</h1>
            <div className="inputs">
              <input
                type="text"
                defaultValue={1}
                onChange={(e) => calcul(e.target.value)}
                value={resultInverse}
              />
              <p className="symbole">{coinData.symbol.toUpperCase()}</p>
              <p className="devise">USD</p>
              <input
                type="text"
                defaultValue={formatNumber(
                  coinData.market_data.current_price.usd
                )}
                onChange={(e) => calculInverse(e.target.value)}
                value={result}
              />
            </div>
          </div>
          <div className="vote-container">
            <h3>
              The community is bullish about {coinData.name} (
              {coinData.symbol.toUpperCase()}) today.
            </h3>
            <div className="votes">
              <div>
                <h3>🚀</h3>
                <h4>{Math.round(coinData.sentiment_votes_up_percentage)}%</h4>
              </div>
              <div>
                <h3>👎 </h3>
                <h4>{Math.round(coinData.sentiment_votes_down_percentage)}%</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="right-part">
          <CoinChart
            coinId={coinData.id}
            coinName={coinData.name}
            coins={coinData}
          />
          <div className="array-evolution">
            <div className="top-array">
              <p>1h</p>
              <p>24h</p>
              <p>7j</p>
              <p>30j</p>
              <p>6m</p>
              <p>1a</p>
            </div>
            <div className="bot-array">
              <PercentChange
                percent={
                  coinData.market_data.price_change_percentage_1h_in_currency
                    .usd
                }
              />
              <PercentChange
                percent={coinData.market_data.price_change_percentage_24h}
              />
              <PercentChange
                percent={coinData.market_data.price_change_percentage_7d}
              />
              <PercentChange
                percent={coinData.market_data.price_change_percentage_30d}
              />
              <PercentChange
                percent={coinData.market_data.price_change_percentage_200d}
              />
              <PercentChange
                percent={coinData.market_data.price_change_percentage_1y}
              />
            </div>
          </div>
          {coinData.description.en ? (
            <div className="description-container">
              <h2>
                {coinData.name} ? ({coinData.symbol.toUpperCase()})
              </h2>
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default InfosCoins;
