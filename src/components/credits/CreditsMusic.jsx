import YouTube from 'react-youtube';
import { Button } from 'react-bootstrap';
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

export default function CreditsMusic({ videoId, getMusic }) {
    const [playing, setPlaying] = React.useState(true);
    const [player, setPlayer] = React.useState(null);
    const [video, setVideo] = React.useState(videoId);
    const [hidden, setHidden] = React.useState(false);

    const pause = () => {
        player.stopVideo();
        setVideo(getMusic());
    }

    const onReady = (event) => {
        setPlayer(event.target);
    }

    const onError = () => {
        setHidden(true);
    }

    const onClick = async () => {
        setPlaying(!playing);
        playing ? player.playVideo() : pause();
        if (playing) toast.success(`Now playing: ${player.getVideoData().title}`);
    }

    return (
        <div>
            <YouTube 
                videoId={video}
                opts={{
                    height: '0',
                    width: '0',
                    playerVars: {
                        controls: 1,
                        showinfo: 0,
                        modestbranding: 1,
                    },
                }}
                onReady={onReady}
                onError={onError}
            />
            <Button 
                variant="success" 
                onClick={onClick}
                className="rounded-circle shadow position-fixed"
                style={{
                    bottom: '7%',
                    right: '5%',
                    width: 70,
                    height: 70,
                    fontSize: '2rem',
                    zIndex: 99,
                    visibility: hidden ? 'hidden' : 'visible',
                }}
            >
                {playing ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faStop} />}
            </Button>
        </div>
    );
}

CreditsMusic.propTypes = {
    videoId: PropTypes.string.isRequired,
    getMusic: PropTypes.func.isRequired,
};