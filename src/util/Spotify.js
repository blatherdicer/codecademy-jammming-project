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
      const url = window.location.href;
      accessToken = url.match(/access_token=([^&]*)/);
      expiresIn = url.match(/expires_in=([^&]*)/);

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

  },

  search: async function (term) {
    {
      const apiEndpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
      try {
        const response = await fetch( apiEndpoint, 
          { method: 'GET',
            cache: 'no-cache',
            headers: { 
                Authorization: `Bearer ${this.accessToken}`
              },
            });
        if(response.ok){
          const jsonResponse = await response.json();
          renderTracks(jsonResponse);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

}

module.exports = {Spotify};