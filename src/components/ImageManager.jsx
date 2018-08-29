import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class ImageManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.onResetClick = this.onResetClick.bind(this);
    };

    onResetClick(event) {
        console.log(event);
        this.props.onResetClick();
    }

    componentDidUpdate( prevProps,  prevState) {
    }

    render() {
        return (
            <div className='imageManager'>
                <div className="imageManager_imageContainer">
                    <img
                        className="imageManager_image"
                        key={this.props.image.preview}
                        src={this.props.image.preview}
                        alt="Image"
                    />
                </div>
                <div className="imageManager_buttonContainer">
                    <Button
                        variant="contained"
                        color="secondary"
                        className="imageManager_reset"
                        onClick={this.onResetClick}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        );
    };
};

ImageManager.propTypes = {
    image: PropTypes.object.isRequired,
    onResetClick: PropTypes.func.isRequired,
};

export default ImageManager;