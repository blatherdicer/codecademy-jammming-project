import React from 'react';
import {TrackList} from '../TrackList/TrackList';
import './SearchResults.css';

export class SearchResults extends React.Component {

  render() {
    // console.log(this.props.searchResults);
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks={this.props.searchResults}/>
      </div>
    )
  }
}