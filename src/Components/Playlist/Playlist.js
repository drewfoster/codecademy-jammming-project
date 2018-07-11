import React from 'react';
import './Playlist.css';

import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isRemoval: true
		}
		this.handleNameChange = this.handleNameChange.bind(this);
	}
	handleNameChange(e) {
		this.props.onNameChange(e.target.value);
	}


	render() {
		return (
			<div className="Playlist">
			  <input defaultValue={this.props.playlistName} onChange={this.handleNameChange}/>
				<TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={this.state.isRemoval}/>
			  <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
			</div>
			);
	}

}
export default Playlist;