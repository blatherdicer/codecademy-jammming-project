const CLIENT_ID = "eea54cb88b224000ae2f240e19a85659";
const REDIRECT_URI = "http://localhost:3000/";
let accessToken = "";
let expiresIn = "";

const Spotify = {

  getAccessToken: function () {
    if (accessToken) {                
      // if there, return it
      return accessToken;

    } else {                           
      // check for token in URL
      // Spotify is returning an array of two items: full parameter and just the value, hence [1]
      const url = window.location.href;
      const accessTokenParams = url.match(/access_token=([^&]*)/);
      const expiresInParams = url.match(/expires_in=([^&]*)/);
      if (accessTokenParams) {
        accessToken = accessTokenParams[1];
        expiresIn = expiresInParams[1];
      };
      if (accessToken && expiresIn) {
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;

      } else {                        
        // redirect to authenticate
        window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;

      }
    }
  },

  renderTracks: function (jsonResponse) {
    console.log(jsonResponse.tracks.items);
    if (jsonResponse.tracks.items) {
      const tracksToReturn = jsonResponse.tracks.items.map((trck) => {
        return {
        id: trck.id,
        name: trck.name,
        artist: trck.artists[0].name,
        album: trck.album.name,
        uri: trck.uri 
      }});
      return tracksToReturn;
    } else {
      return [];
    }
  },

  search: async function (term) {
    
      const apiToken = this.getAccessToken();
      const apiEndpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
      try {
        const response = await fetch( apiEndpoint, 
          { method: 'GET',
              headers: { 
                'Authorization': 'Bearer '+apiToken,
                'Content-Type': 'application/json'
              }
            });
        if(response.ok){
          const jsonResponse = await response.json();
          return this.renderTracks(jsonResponse);
        }
      } catch (error) {
        console.log("ERROR:"+error.status+"-"+error.message);
      }
    }
  }

module.exports = {Spotify};
