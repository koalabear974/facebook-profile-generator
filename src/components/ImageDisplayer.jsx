import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ImageOnLoad from 'react-image-onload';
import Button from '@material-ui/core/Button';

class ImageDisplayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageLoaded: true,
        };

        this.onResetClick = this.onResetClick.bind(this);
        this.onLoadedImage = this.onLoadedImage.bind(this);
    };

    onResetClick(e) {
        this.props.onResetClick();
    }

    onLoadedImage() {
    }

    componentDidUpdate(prevProps) {
    }

    render() {
        return (
            <div className='imageDisplayer'>
                <div className='imageDisplayer_imageContainer'>
                    <a download="bigPicture.jpg" href={this.props.images[0]} title="bigPicture">
                        <ImageOnLoad
                            ref={this.image}
                            className={'imageDisplayer_image ' + (this.state.imageLoaded ? '' : 'hidden')}
                            key={this.props.images[0]}
                            src={this.props.images[0]}
                            onLoad={this.onLoadedImage}
                            alt='Image'
                        />
                    </a>
                </div>

                <div className='imageDisplayer_imageContainer'>
                    <a download="smallPicture.jpg" href={this.props.images[0]} title="bigPicture">
                        <ImageOnLoad
                            ref={this.image}
                            className={'imageDisplayer_image ' + (this.state.imageLoaded ? '' : 'hidden')}
                            key={this.props.images[1]}
                            src={this.props.images[1]}
                            onLoad={this.onLoadedImage}
                            alt='Image'
                        />
                    </a>
                </div>
                <div className='imageDisplayer_buttonContainer'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className='imageDisplayer_reset'
                        onClick={this.onResetClick}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        );
    };
};

ImageDisplayer.propTypes = {
    images: PropTypes.array.isRequired,
    onResetClick: PropTypes.func.isRequired,
};

export default ImageDisplayer;
