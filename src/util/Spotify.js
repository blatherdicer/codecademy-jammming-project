const { isCompositeComponent } = require("react-dom/test-utils");

const CLIENT_ID = "eea54cb88b224000ae2f240e19a85659";
const REDIRECT_URI = "http://localhost:3000/";
let accessToken = "";
let expiresIn = "";

const Spotify = {

  getAccessToken: function () {
    console.log('Entering GetAccessToken()');
    if (!accessToken) {
      console.log('!accessToken');
      // check for token in URL
      const url = window.location.href;
      const accessTokenParams = url.match(/access_token=([^&]*)/);
      const expiresInParams = url.match(/expires_in=([^&]*)/);
      // Spotify is returning an array of two items: full parameter and just the value, hence [1]
      if (accessTokenParams && expiresInParams) {
        console.log('Found token in url');
        accessToken = accessTokenParams[1];
        expiresIn = expiresInParams[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        //window.history.replaceState('access_token', null, '/');
      } else {
        // redirect to authenticate
        console.log('Redirecting to Spotify Auth')
        window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;

      }
    }
    console.log('Returning token');
    return accessToken;
  },

  renderTracks: function (jsonResponse) {
    if (jsonResponse.tracks.items) {
      const tracksToReturn = jsonResponse.tracks.items.map((trck) => {
        return {
          id: trck.id,
          name: trck.name,
          artist: trck.artists[0].name,
          album: trck.album.name,
          uri: trck.uri
        }
      });
      return tracksToReturn;
    } else {
      return [];
    }
  },

  search: async function (term) {
    const apiToken = this.getAccessToken();
    const apiHeaders = {
      'Authorization': 'Bearer ' + apiToken,
      'Content-Type': 'application/json'
    };
    const apiEndpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    try {
      const response = await fetch(apiEndpoint,
        {
          method: 'GET',
          headers: apiHeaders
        });
      if (response.ok) {
        const jsonResponse = await response.json();
        return this.renderTracks(jsonResponse);
      }
    } catch (error) {
      console.log("ERROR:" + error.status + "-" + error.message);
    }
  },

  savePlaylist: async function (playlistName, playlistTracks) {
    if (!playlistName || !playlistTracks) {
      return
    }
    let apiToken = this.getAccessToken();
    const apiHeaders = {
      'Authorization': 'Bearer ' + apiToken,
      'Content-Type': 'application/json'
    };
    let userID = '';

    // get user ID from Spotify API
    let apiEndpoint = `https://api.spotify.com/v1/me`;
    try {
      const response = await fetch(apiEndpoint,
        {
          method: 'GET',
          headers: apiHeaders
        });
      if (response.ok) {
        const userJsonResponse = await response.json();
        userID = userJsonResponse.id;
      }
    } catch (error) {
      console.log("ERROR:" + error.status + "-" + error.message);
    };

    //create new Playlist
    let playlistID = '';
    apiToken = this.getAccessToken();
    apiEndpoint = `https://api.spotify.com/v1/users/${userID}/playlists`;
    try {
      const response = await fetch(apiEndpoint,
        {
          method: 'POST',
          headers: apiHeaders,
          body: JSON.stringify({
            name: playlistName,
            description: 'Playlist from Jammming for Codecademy learning project',
            public: true
          })
        });
      if (response.ok) {
        const playlistJsonResponse = await response.json();
        playlistID = playlistJsonResponse.id;
      }
    } catch (error) {
      console.log("ERROR:" + error.status + "-" + error.message);
    };

    //add the tracks to the Playlist
    apiToken = this.getAccessToken();
    apiEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
    try {
      const response = await fetch(apiEndpoint,
        {
          method: 'POST',
          headers: apiHeaders,
          body: JSON.stringify({
            uris: playlistTracks
          })
        });
      if (response.ok) {
        console.log('Success - created playlist.');
        return (true);
      }
    } catch (error) {
      console.log("ERROR:" + error.status + "-" + error.message);
    };

  }
}

module.exports = { Spotify };
