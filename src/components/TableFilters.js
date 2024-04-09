import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setStableState } from "../action/stable.action";
import { setListDisplay } from "../action/list.action";
import { BiSearchAlt } from "react-icons/bi";
import axios from "axios";
import { NavLink } from "react-router-dom";

const TableFilters = () => {
  const [showStable, setShowStable] = useState(true);
  const dispatch = useDispatch();
  const [showFavList, setShowFavList] = useState(false);
  const [showWindowSearch, setShowWindowSearch] = useState(false);
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    dispatch(setStableState(showStable));
    dispatch(setListDisplay(showFavList));
  }, [showStable, showFavList, dispatch]);

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/search?query=${inputValue}`)
      .then((res) => setData(res.data.coins));

    if (!inputValue) {
      setShowWindowSearch(false);
    }
  }, [inputValue]);

  return (
    <div className="table-filters">
      <div className="table-filters-container">
        <div className="search-container">
          <div className="input-container">
            <input
              placeholder="Search coins ..."
              type="search"
              name=""
              id=""
              onChange={(e) => {
                setShowWindowSearch(true);
                setInputValue(e.target.value);
              }}
            />

            <BiSearchAlt />
          </div>
          {showWindowSearch && (
            <div
              className="window-search"
              onMouseLeave={() => setShowWindowSearch(false)}
            >
              {data.map((coins) => (
                <NavLink to={`/${coins.id}`}>
                  <div className="result-search">
                    <div className="left">
                      <img src={coins.thumb} alt="" />
                      <p className="coins-name">{coins.name}</p>
                      <p className="symbole">{coins.symbol}</p>
                    </div>
                    <div className="right">
                      <p>#{coins.market_cap_rank}</p>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
        <div
          className={showFavList ? "no-list-btn" : "no-list-btn active"}
          onClick={() => setShowFavList(false)}
        >
          <p>Aucune liste</p>
        </div>
        <div
          className={showFavList ? "fav-list active" : "fav-list"}
          onClick={() => setShowFavList(true)}
        >
          <p>Favoris</p>
          <img src="./assets/star-full.svg" alt="icon-star" />
        </div>
      </div>
    </div>
  );
};

export default TableFilters;

{
  /* <input
            type="checkbox"
            id="stableCoin"
            defaultChecked={true}
            onChange={() => setShowStable(!showStable)}
          />
          <label htmlFor="stableCoin">
            {showStable ? "Avec stable coin" : "Sans stable coin"}
          </label> */
}
