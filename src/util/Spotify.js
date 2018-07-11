const clientId = 'ae73f2c18e37425f919d8431c1207d54';
const redirectURI = 'https://drewfoster.surge.sh';

let accessToken;
let requestTime;
let expirationTime;

const Spotify = {

  getAccessToken() {

    if(expirationTime && Date.now() > expirationTime) {
      requestTime = undefined;
      expirationTime = undefined;
      accessToken = undefined;
    }

    if(!accessToken) {
      if(window.location.hash.match(/access_token=([^&]*)/)) {
        const hash = window.location.hash;
        accessToken = hash.match(/(#access_token=)(.*?)(&)/)[2];
        console.log('Access Token: ' + accessToken);
        let expiresIn = hash.match(/(expires_in=)(\d*)/)[2];
        expiresIn = expiresIn.trim();
        expirationTime = requestTime + (parseInt(expiresIn, 10) * 1000);
        console.log('Expires In: ' + expirationTime);
        window.location.hash = '';
    } else {
      requestTime = Date.now();
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  }
  return accessToken;
  },

  setHeaders() {
    let userAccessToken = this.getAccessToken();
    return { Authorization: `Bearer ${userAccessToken}`};
  },

  getUserId() {
    try {
      let headers = this.setHeaders();
      return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
        return response.json();
      }).then(jsonResponse => {
        console.log(JSON.stringify(jsonResponse));
        if(jsonResponse.id) {
          const userId = jsonResponse.id
          console.log(userId);
          return userId;
        }
      });
    } catch(error) {
      console.log(error);
    }

  },

  getPlaylistId(userId, playlistName) {
    try {
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if(jsonResponse.id) {
          console.log('Playlist ID: '+ jsonResponse.id);
          return jsonResponse.id;
        }
      });
    } catch(error) {
      console.log(error);
    }

  },

  search(term) {
    let headers = this.setHeaders();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: headers
    }).then(response => {
      console.log('Response Received');
      return response.json();
    }).then(jsonResponse => {
      console.log(JSON.stringify(jsonResponse));
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      } else {
        return [];
      }
    });
  },

  async savePlaylist(playlistName, trackURIs) {
    if(playlistName && trackURIs) {
      const userId = await this.getUserId();
      const playlistId = await this.getPlaylistId(userId, playlistName);
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        method: 'POST',
        body: JSON.stringify({uris: trackURIs})
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        console.log(JSON.stringify(jsonResponse));
      });
    } else {
      return;
    }
  }

}

export default Spotify;
