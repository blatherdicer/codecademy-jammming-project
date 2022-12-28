import React from 'react';
import './App.css';

import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    const testSearchResults = [
      {id: 1,
        name: "Funeral for a Friend",
        artist: "Elton John",
        album: "Love Songs"
      },{
        id: 2,
        name: "Hello I Must Be Going",
        artist: "Pink Floyd",
        album: "Hello I Must Be Going"
      },{id: 3,
        name: "Hello",
        artist: "The Cars",
        album: "Drive"
      }];
    const testPlaylistTracks = [
      {id: 4,
        name: "The Race",
        artist: "Yello",
        album: "Flag"
      },{
        id: 5,
        name: "Gold",
        artist: "Spandau Ballet",
        album: "Best of Spandau Ballet"
      },{id: 6,
        name: "Romeo and Juliet",
        artist: "Dire Straits",
        album: "Love over Gold"
      }];
    const testPlaylistName = 'My Playlist';
    this.state = {
      searchResults: testSearchResults,
      playlistName: testPlaylistName,
      playlistTracks: testPlaylistTracks
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
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

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults onAdd = {this.addTrack} searchResults = {this.state.searchResults}/>
            <Playlist 
                onRemove = {this.removeTrack}
                playlistName = {this.state.playlistName} 
                playlistTracks = {this.state.playlistTracks} 
            />
          </div>
        </div>
      </div>
    )
  }

}
