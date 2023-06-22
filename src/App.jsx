import React, { useState, useEffect } from "react";
import { AiOutlineSortDescending } from "react-icons/ai";
import { GoTriangleDown } from "react-icons/go";
import "../styles/App.css";


const App = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [filterParam, setFilterParam] = useState(["All"]);
  const [paginate, setPaginate] = useState(4);

  //  set search parameters
  const [searchParam] = useState(["name"]);

  //  empty deps array[] means that this useEffect will run once
  useEffect(() => {
    fetch(`https://restcountries.com/v2/all?fields=name,region,area`)
      .then((response) => response.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setCountries(data);
        },
        // error handling
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const search = (countries) => {
    return countries.filter((country) => {
      if (country.region == filterParam) {
        return searchParam.some((newCountry) => {
          return (
            country[newCountry]
              .toString()
              .toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          );
        });
      } else if (filterParam == "All") {
        return searchParam.some((newCountry) => {
          return (
            country[newCountry]
              .toString()
              .toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          );
        });
      } else if (country.area < filterParam) {
        return searchParam.some((newCountry) => {
          return (
            country[newCountry]
              .toString()
              .toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          );
        });
      }
    });
  };

  // sort
  const sortAscendingDescending = () => {
    const sortedCountries = [...countries].sort().reverse();
    setCountries(sortedCountries);
  };

  // paginate
  const loadMore = (e) => {
    setPaginate((prevValue) => prevValue + 4);
  }

  //  render a list of countries
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  } else {
    return (
      <div className="wrapper">
        {/* search bar */}
        <div className="search-wrapper">
          <label htmlFor="search-form">
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="sr-only">Search for countries here</span>
          </label>
        </div>

        {/*filter by region => oceania*/}
        <div className="select">
          <select
            className="custom-select"
            aria-label="Filter countries by region"
            onChange={(e) => setFilterParam(e.target.value)}
          >
            <option value="All">Filter By Region</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
          <GoTriangleDown />

          {/* filter by countries smaller than Lithuania by area size */}
          <select
            className="custom-select"
            aria-label="Filter countries by area size"
            onChange={(e) => setFilterParam(e.target.value)}
          >
            <option value="All">Filter by area size</option>
            <option value={65300}>Area size smaller than Lithuania</option>
          </select>
          <GoTriangleDown />
          {/* sort */}
          <span className="sort-button">
            <button onClick={sortAscendingDescending} className="btn-desc">
              <span>SORT</span>
              <AiOutlineSortDescending className="sort-icon" />
            </button>
          </span>
        </div>

        {/* list of countries */}
        <ul className="card-container">
          {search(countries).slice(0,paginate).map((country) => (
            <li>
              <article className="card" key={country.id}>
                <div className="card-content">
                  <h2 className="card-name">Country Name: {country.name}</h2>
                  <h2 className="card-region">Region: {country.region}</h2>
                  <h2 className="card-area">Area Size: {country.area}</h2>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <button className="load-more-button" onClick={loadMore}>Load More</button>
      </div>
    );
  }
};

export default App;
