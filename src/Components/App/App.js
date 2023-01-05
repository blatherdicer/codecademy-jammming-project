import React from 'react';
import './App.css';

import { Spotify } from '../../util/Spotify.js';

import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      moreResultsUrl: null,
      playlistName: 'My Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.searchNext = this.searchNext.bind(this);
  }

  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
  }

  addTrack(trackToAdd) {
    if (!this.state.playlistTracks.find(existTrack => existTrack.id === trackToAdd.id)) {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, trackToAdd]
      })
    }
  }

  removeTrack(trackToRemove) {
    const updatedPlaylistTracks = this.state.playlistTracks.filter(existTrack => existTrack.id !== trackToRemove.id);
    if (updatedPlaylistTracks.length !== this.state.playlistTracks.length) {
      this.setState({
        playlistTracks: updatedPlaylistTracks
      })
    }
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  }

  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((trk) => trk.uri);
    const playlistName = this.state.playlistName;
    const playlistSaved = await Spotify.savePlaylist(playlistName, trackURIs);
    if (playlistSaved) {
      this.setState({
        playlistTracks: [],
        playlistName: 'My Playlist'
      }
      )
    } else {
      alert('Error saving playlist!')
    }
  }

  async search(term) {
    const results = await Spotify.search(term);
    this.setState({
      searchResults: results.searchResults,
      moreResultsUrl: results.moreResultsUrl
    })
  }

  async searchNext() {
    const results = await Spotify.searchNext(this.state.moreResultsUrl);
    this.setState({
      searchResults: [...this.state.searchResults, ...results.searchResults],
      moreResultsUrl: results.moreResultsUrl
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              onAdd={this.addTrack} 
              onNext={this.searchNext}
              searchResults={this.state.searchResults} 
              moreResults={this.state.moreResultsUrl}
              />
            <Playlist
              onRemove={this.removeTrack}
              onSave={this.savePlaylist}
              onNameChange={this.updatePlaylistName}
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
            />
          </div>
        </div>
      </div>
    )
  }

}
