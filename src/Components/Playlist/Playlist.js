import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList';
 
export class Playlist extends React.Component {

  render() {
    const tracks = this.props.playlistTracks;
    return (
      <div className="Playlist">
        <input defaultValue={'New Playlist'} />
        <TrackList onRemove = {this.props.onRemove} tracks={tracks} isRemoval={true}/>
        <button className="Playlist-save">SAVE TO SPOTIFY</button>
      </div>
    )
  }
}