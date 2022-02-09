import YouTube from 'react-youtube';
import { Button } from 'react-bootstrap';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

export default class CreditsMusic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: props.videoId,
            playing: true,
            player: null,
            hidden: false,
        }
    }

    pause() {
        this.state.player.stopVideo();
        this.setState({
            videoId: this.props.getMusic()
        });
    }

    onClick = async () => {
        this.setState({
            playing: !this.state.playing,
        });
        this.state.playing ? this.state.player.playVideo() : this.pause();
        if (this.state.playing) {
            toast.success(`Now playing: ${this.state.player.getVideoData().title}`);
        }
    }

    onReady = (event) => {
        this.setState({
            player: event.target,
        });
    }

    onError = () => {
        this.setState({
            hidden: true,
        });
    }

    render() {
        return (
            <div>
                <YouTube 
                    videoId={this.state.videoId}
                    opts={{
                        height: '0',
                        width: '0',
                        playerVars: {
                            controls: 1,
                            showinfo: 0,
                            modestbranding: 1,
                        },
                    }}
                    onReady={this.onReady}
                    onError={this.onError}
                />
                <Button 
                    variant="success" 
                    onClick={this.onClick}
                    className="rounded-circle shadow position-fixed"
                    style={{
                        bottom: '7%',
                        right: '5%',
                        width: 70,
                        height: 70,
                        fontSize: '2rem',
                        zIndex: 99,
                        visibility: this.state.hidden ? 'hidden' : 'visible',
                    }}
                >
                    {this.state.playing ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faStop} />}
                </Button>
            </div>
        )
    }
}