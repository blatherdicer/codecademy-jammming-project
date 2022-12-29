import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {

  constructor(props){
    super(props);
    this.state = { term: "" };
    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleTermChange(e) {
    const newTerm = e.target.value;
    this.setState ({term: newTerm});
  }

  search(){
    const term = this.state.term;
    this.props.onSearch(term);
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <button className="SearchButton" onClick={this.search}>SEARCH</button>
      </div>
    )
  }
}