import React, {useState, useEffect} from 'react';
import '../styles/App.css'


const App = () => {
   const [error, setError] = useState(null);
   const [isLoaded, setIsLoaded] = useState(false);
   const [countries, setCountries] = useState([]);
  //  search query => set it to an empty string
   const [query, setQuery] = useState("");

  //  set search parameters
  const [searchParam] = useState(["name"]);

  const search = (countries) =>{
    return countries.filter((country) => {
      return searchParam.some((newCountry) => {
        return (
           country[newCountry]
           .toString()
           .toLowerCase()
           .indexOf(query.toLowerCase()) > -1
        );
      });
    });
  }

  //  empty deps array[] means that this useEffect will run once
  useEffect(() => {
    fetch(`https://restcountries.com/v2/all?fields=name,region,area`)
    .then((response) => response.json())
    .then((data) => {
      setIsLoaded(true);
      setCountries(data)
    },
    // error handling
    (error) => {
      setIsLoaded(true);
      setError(error);
    }
    );
  }, []);
//  render a list of countries
if(error){
  return (
    <div>Error: {error.message}</div>
  )
}
else if(!isLoaded){
  return (
    <div>
      <p>Loading...</p>
    </div>
  )
}
else {
  return (
    <div className='wrapper'>
      <div className='search-wrapper'>
        <label htmlFor='search-form'>
           <input
           type='search'
           name='search-form'
           id='search-form'
           className='search-input'
           placeholder='Search for...'
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           />
           <span className='sr-only'>Search for countries here</span>
        </label>
      </div>
      <ul className='card-container'>
        {search(countries).map((country) => (
          <li>
            <article className='card' key={country.id}>
              <div className='card-content'>
                <h2 className='card-name'>Country Name: {country.name}</h2>
                <h2 className='card-region'>Region: {country.region}</h2>
                <h2 className='card-area'>Area Size: {country.area}</h2>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
}

export default App
