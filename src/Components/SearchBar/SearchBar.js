import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 'Enter A Song, Album, or Artist'
		}
		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}

	search(e) {
			this.props.onSearch(this.state.value);
			e.preventDefault();
	}

	handleTermChange(e) {
		this.setState({
			value: e.target.value
		});
	}

	render() {
		return (
		<form onSubmit={this.search} className="SearchBar">
		  <input type="text" placeholder={this.state.value} onChange={this.handleTermChange} />
		  <input type="submit" value="SUBMIT"/>
		</form>
		);
	}

}
export default SearchBar;
