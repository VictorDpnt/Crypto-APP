import axios from "axios";
import React, { useEffect, useState } from "react";
import PercentChange from "../components/PercentChange";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import LinearProgress from "@mui/joy/LinearProgress";
import CoinChart from "../components/CoinChart";
import StartIcon from "../components/StartIcon";
import Historical from "../components/Historical";
import TrendingCoins from "../components/TrendingCoins";
import { IoArrowBackOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import ToTop from "../components/ToTop";
import { useLocation } from "react-router-dom";

const InfosCoins = () => {
  const [coinData, setCoinData] = useState(null);
  const [result, setResult] = useState();
  const [resultInverse, setResultInverse] = useState();
  const [percentageChange, setPercentageChange] = useState(0);
  const [loading, setLoading] = useState(true);
  // const idUrl = window.location.pathname;
  const location = useLocation();
  const [idUrl, setIdUrl] = useState(location.pathname);

  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins${idUrl}`
        );
        const data = response.data;
        setCoinData(data);
        calculatePercentageChange(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [idUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [idUrl]);

  useEffect(() => {
    setIdUrl(location.pathname);
  }, [location]);

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

  const calculInverse = (e) => {
    setResultInverse(e / coinData.market_data.current_price.usd);
  };

  const calcul = (e) => {
    setResult(coinData.market_data.current_price.usd);
    if (/^\d+$/.test(e)) {
      setResult(formatNumber(e * coinData.market_data.current_price.usd));
    } else {
      setResult(0);
    }
  };

  if (loading) {
    // Si les données sont en cours de chargement, afficher l'indicateur de chargement
    return <LinearProgress color="secondary" />;
  }

  // const handleClick = () => {
  //   window.history.back();
  // };

  return (
    <div className="info-container">
      <NavLink to={"/"}>
        <div className="back">
          <div>
            <IoArrowBackOutline />
            <p>Home</p>
          </div>
        </div>
      </NavLink>
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
              style={{ width: "95%" }}
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
                onClick={() => {
                  setResult(0);
                  setResultInverse(null);
                }}
                type="text"
                defaultValue={1}
                onChange={(e) => {
                  setResultInverse(e.target.value);
                  calcul(e.target.value);
                }}
                value={resultInverse}
              />
              <p className="symbole">{coinData.symbol.toUpperCase()}</p>
              <p className="devise">USD</p>
              <input
                onClick={() => {
                  setResult(0);
                  setResultInverse(null);
                }}
                type="text"
                defaultValue={formatNumber(
                  coinData.market_data.current_price.usd
                )}
                onChange={(e) => {
                  calculInverse(e.target.value);
                  setResult(e.target.value);
                }}
                value={result}
              />
            </div>
          </div>
          {/* <div className="historical-container">
            <h1>{coinData.symbol.toUpperCase()} Historical Price</h1>
            <div className="lines">
              <p>24h Range</p>
              <Historical days={1} id={coinData.id} />
            </div>
            <div className="lines">
              <p>7d Range</p>
              <Historical days={7} id={coinData.id} />
            </div>
            <div className="lines">
              <p>1m Range</p>
              <Historical days={30} id={coinData.id} />
            </div>
            <div className="lines">
              <p>6m Range</p>
              <Historical days={180} id={coinData.id} />
            </div>
            <div className="lines">
              <p>1y Range</p>
              <Historical days={365} id={coinData.id} />
            </div>
          </div> */}
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
      <div className="global-price-container">
        <h1>Global Bitcoin Prices</h1>
        <div className="global-price">
          <div className="line">
            <div className="monnaie-symb">
              <p className="symbol">{coinData.symbol.toUpperCase()} / USD</p>
              <p className="monnaie">US Dollar</p>
            </div>
            <p className="price">
              $ {formatNumber(coinData.market_data.current_price.usd)}
            </p>
          </div>
          <div className="line">
            <div className="monnaie-symb">
              <p className="symbol">{coinData.symbol.toUpperCase()} / GBP</p>
              <p className="monnaie">Britsh Pound Sterling</p>
            </div>
            <p className="price">
              £ {formatNumber(coinData.market_data.current_price.gbp)}
            </p>
          </div>
          <div className="line">
            <div className="monnaie-symb">
              <p className="symbol">{coinData.symbol.toUpperCase()} / EUR</p>
              <p className="monnaie">Euro</p>
            </div>
            <p className="price">
              € {formatNumber(coinData.market_data.current_price.eur)}
            </p>
          </div>
          <div className="line">
            <div className="monnaie-symb">
              <p className="symbol">{coinData.symbol.toUpperCase()} / CAD</p>
              <p className="monnaie">Canadian Dollar</p>
            </div>
            <p className="price">
              CA$ {formatNumber(coinData.market_data.current_price.cad)}
            </p>
          </div>
          <div className="line">
            <div className="monnaie-symb">
              <p className="symbol">{coinData.symbol.toUpperCase()} / INR</p>
              <p className="monnaie">Indian Rupee</p>
            </div>
            <p className="price">
              ₹ {formatNumber(coinData.market_data.current_price.inr)}
            </p>
          </div>
          <div className="line">
            <div className="monnaie-symb">
              <p className="symbol">{coinData.symbol.toUpperCase()}/ AUD</p>
              <p className="monnaie">Australian Dollar</p>
            </div>
            <p className="price">
              A$ {formatNumber(coinData.market_data.current_price.aud)}
            </p>
          </div>
        </div>
      </div>
      <div className="trending">
        <h1>Trending Coins</h1>
        <TrendingCoins name={coinData.name} />
      </div>
      <ToTop />
    </div>
  );
};

export default InfosCoins;
