//const { isCompositeComponent } = require("react-dom/test-utils");

const CLIENT_ID = "eea54cb88b224000ae2f240e19a85659";
const REDIRECT_URI = "http://localhost:3000/";
let accessToken = "";
let expiresIn = "";

const Spotify = {

  getAccessToken: function () {
    if (!accessToken) {
      // check for token in URL
      const url = window.location.href;
      const accessTokenParams = url.match(/access_token=([^&]*)/);
      const expiresInParams = url.match(/expires_in=([^&]*)/);
      // Spotify is returning an array of two items: full parameter and just the value, hence [1]
      if (accessTokenParams && expiresInParams) {
        accessToken = accessTokenParams[1];
        expiresIn = expiresInParams[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        // redirect to authenticate
        window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;

      }
    }
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
          uri: trck.uri,
          albumArtUrl: trck.album.images[0].url
        }
      });
      return {
        searchResults: tracksToReturn,
        moreResultsUrl: jsonResponse.tracks.next
      };
    } else {
      return {
        searchResults: [],
        moreResultsUrl: null
      };
    }
  },

  spotifyFetch: async function (method, endpoint, body) {
    const apiToken = this.getAccessToken();
    const apiEndpoint = `https://api.spotify.com/v1/${endpoint}`;
    const apiHeaders = {
      'Authorization': 'Bearer ' + apiToken,
      'Content-Type': 'application/json'
    };
    try {
      const response = await fetch(apiEndpoint,
        {
          method: method,
          headers: apiHeaders,
          body: body && JSON.stringify(body)
        });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
    } catch (error) {
      console.log("ERROR:" + error.status + "-" + error.message);
    };
  },

  search: async function (term) {
    const apiEndpoint = `search?type=track&limit=10&q=${term}`;
    const jsonResponse = await this.spotifyFetch('GET', apiEndpoint, null);
    return this.renderTracks(jsonResponse)
  },

  searchNext: async function (nextApiUrl) {
    if (!nextApiUrl) { 
      return { searchResults: [], moreResultsUrl:null} 
    } else {
      const apiEndpoint = nextApiUrl.substring(nextApiUrl.search('search?'));
      const jsonResponse = await this.spotifyFetch('GET', apiEndpoint, null);
      return this.renderTracks(jsonResponse)
    }
  },

  savePlaylist: async function (playlistName, playlistTracks) {
    if (!playlistName || !playlistTracks) { return false }
    const userResponse = await this.spotifyFetch('GET', `me`, null);
    const userID = userResponse.id;
    const playlistBody = {
      name: playlistName,
      description: 'Playlist from Jammming for Codecademy learning project',
      public: true
    };
    const playlistResponse = await this.spotifyFetch('POST', `users/${userID}/playlists`, playlistBody);
    const playlistID = playlistResponse.id;
    const addTracksBody = { uris: playlistTracks };
    await this.spotifyFetch('POST', `playlists/${playlistID}/tracks`, addTracksBody);
    console.log('Spotify Playlist created OK');
    return true;
  }
}

module.exports = { Spotify };
