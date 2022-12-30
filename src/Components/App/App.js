import React from 'react';
import './App.css';

import { Spotify } from '../../util/Spotify';

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
        album: "Love Songs",
        uri:"spotify:track:5NERbS7923kF471NLKDZkB?si=23d446f58d6045f4"
      },{
        id: 2,
        name: "Wish You Were Here",
        artist: "Pink Floyd",
        album: "Wish You Were Here",
        uri:"spotify:track:6mFkJmJqdDVQ1REhVfGgd1?si=0573e0d810564654"
      },{id: 3,
        name: "Hello",
        artist: "The Cars",
        album: "Drive",
        uri:"spotify:track:6HFpfx0Efw1ckqKTLVrMQy?si=29df68dd47b44f8e"
      }];
    const testPlaylistTracks = [
      {id: 4,
        name: "The Race",
        artist: "Yello",
        album: "Essential",
        uri:"spotify:track:25FitAyupH9zHMouaoMpYF?si=41eef093bbc240e0"
      },{
        id: 5,
        name: "Gold",
        artist: "Spandau Ballet",
        album: "Best of Spandau Ballet",
        uri:"spotify:track:2X9fsxb6O6bYEopJYmUbNC?si=ac2d755218ac41e9"
      },{id: 6,
        name: "Romeo and Juliet",
        artist: "Dire Straits",
        album: "Making Movies",
        uri:"spotify:track:0PNt5WTw092eED0ru9SuIp?si=adb2c760074b4c20"
      }];
    const testPlaylistName = 'My Playlist';
    this.state = {
      searchResults: testSearchResults,
      playlistName: testPlaylistName,
      playlistTracks: testPlaylistTracks
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
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
    this.setState({ playlistName: {name}})
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((trk)=> trk.uri);
    console.log(trackURIs)
  }

  async search(term){
    const results = await Spotify.search(term);
    this.setState({
      searchResults: results
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults onAdd = {this.addTrack} searchResults = {this.state.searchResults}/>
            <Playlist 
                onRemove = {this.removeTrack}
                onSave = {this.savePlaylist}
                onNameChange = {this.updatePlaylistName}
                playlistName = {this.state.playlistName} 
                playlistTracks = {this.state.playlistTracks} 
            />
          </div>
        </div>
      </div>
    )
  }

}
