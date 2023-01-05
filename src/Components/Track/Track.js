import React from 'react';
import './Track.css';

export class Track extends React.Component {

  constructor(props){
    super(props);
    this.renderAction = this.renderAction.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(e) {
    this.props.onAdd(this.props.track);
  }

  removeTrack(e) {
    this.props.onRemove(this.props.track);
  }

  renderAction(isRemoval) {
    if (isRemoval) {
      return <button className="Track-action" onClick={this.removeTrack}>-</button>
    } else { 
      return<button className="Track-action" onClick={this.addTrack}>+</button>
    }
  }
  
  render() {
    return (
      <div className="Track">
        <div className="Track-album-art">
          <img src={this.props.albumArtUrl} alt={this.props.track.album + ' cover art'} />
        </div>
        <div className="Track-information">
          <h3>{this.props.track.name.length > 40 ? `${this.props.track.name.substr(0,40)}...` : this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        <div className="Track-action-container">
          {this.renderAction(this.props.isRemoval)}
        </div>
      </div>
    )
  }
}