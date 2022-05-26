import {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const CLIENT_ID = "191a7620a28645bb8a3643470b007f91";
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if(!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);

  }, [])

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  }

  const showTop = async () => {
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists?limit=10", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setArtists(data.items);
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id} className="artist">
        {artist.images.length ? <img width="100%" src={artist.images[0].url} alt="failed to load"/> : <div>image unavailable</div>}
        {artist.name}
        <br/>
        <br/>
        <br/>
      </div>
    ))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Top Artists</h1>
        {!token ? 
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`}>Login to Spotify</a>
          : <button className="btn" onClick={logout}>logout</button>}
        <br/>
        {token ? 
          <button className="btn" id="showTop" onClick={showTop}>Show top artists</button>
          : <h2>login to search for songs</h2>
        } 
        <br/>
        {renderArtists()}

      </header>
    </div>
  );
}

export default App;
