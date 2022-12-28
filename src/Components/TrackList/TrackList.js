import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends React.Component {

  render() {
    const tracks = this.props.tracks;
    return (
      <div className="TrackList">
       {tracks.map( (trck) => 
            <Track key={trck.id.toString()}
                   track={trck} 
                   name={trck.name} 
                   artist = {trck.artist}
                   album = {trck.album}
                   onAdd = {this.props.onAdd}
                   onRemove = {this.props.onRemove}
                   isRemoval = {this.props.isRemoval}
                   />)}
      </div>
    )
  }
}