import React, {Component} from 'react';
import $ from 'jquery';
import Cropper from 'cropperjs';
import PropTypes from 'prop-types';
import ImageOnLoad from 'react-image-onload';
import Button from '@material-ui/core/Button';
import imageManagerHelper from './../helpers/imageManagerHelper.jsx';

class ImageManager extends Component {
    constructor(props) {
        super(props);

        let defaultValues = imageManagerHelper.defaultValues();

        this.state = {
            imageLoaded: false,
            calculationRun: false,
            invalid: false,
            imageProportions: defaultValues.imageProportions,
            overlayProportions: defaultValues.overlayProportions,
        };

        this.proportions = defaultValues.proportions;

        this.fader = React.createRef();
        this.imageContainer = React.createRef();
        this.bigOverlay = React.createRef();
        this.smallOverlay = React.createRef();
        this.image = React.createRef();

        this.onResetClick = this.onResetClick.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.onApplyClick = this.onApplyClick.bind(this);
        this.onImageLoad = this.onImageLoad.bind(this);
        this.updateCalculation = this.updateCalculation.bind(this);
        this.setOverlayStyle = this.setOverlayStyle.bind(this);
        this.processCropp = this.processCropp.bind(this);
        this.onImageMouseDown = this.onImageMouseDown.bind(this);
    };

    onResetClick(e) {
        this.props.onResetClick();
    }

    onImageLoad(img) {
        if (img.naturalHeight > img.naturalWidth) {
            img.style = "height: 100%; width: auto;";
        }

        this.setState({
            imageLoaded: true,
            calculationRun: false,
            smallBlob: null,
            bigBlob: null,
        });

        setTimeout(() => {
            this.updateCalculation();
        }, 500);
    }

    onApplyClick(e) {
        this.fader.current.classList.add('imageManager_fader--visible');
        setTimeout(() => {
            this.fader.current.classList.add('imageManager_fader--active');
        }, 100);

        this.fader.current.addEventListener(
            'webkitTransitionEnd',
            () => {
                console.log("Finished transition!");
                this.image.current.image.classList.add('imageManager_image--cropping');

                this.processCropp();
            },
            false
        );

    }

    processCropp() {
        let bigBlob, smallBlob;
        let root = this;
        let overlayProp = this.state.overlayProportions;
        bigBlob = this.croppImage(
            overlayProp.natural.smallPicture,
            overlayProp.natural.offset
        );
        bigBlob.then((blob) => {
            root.smallBlob = blob;

            smallBlob = this.croppImage(overlayProp.natural.bigPicture);

            smallBlob.then((blob) => {
                root.bigBlob = blob;
                this.setState({
                    bigBlob: root.bigBlob,
                    smallBlob: root.smallBlob
                });
            });
        });
    }

    componentDidUpdate(prevProps) {
        if (this.state.bigBlob && this.state.smallBlob) {
            this.props.onApplyClick(this.state.bigBlob, this.state.smallBlob);
        }
    }

    updateCalculation() {
        let img = this.image.current.image;

        let imageProportions = {
            "width": img.width,
            "height": img.height,
            "naturalWidth": img.naturalWidth,
            "naturalHeight": img.naturalHeight,
        };

        if (imageProportions.naturalWidth < this.proportions.small.bigPicture.width) {
            this.setState({
                invalid: true,
                calculationRun: false,
                imageProportions: imageProportions,
            });
        } else {
            let overlayProportions = imageManagerHelper.calculateProportions(
                imageProportions,
                this.state.overlayProportions,
                this.proportions
            );

            this.setOverlayStyle(overlayProportions, imageProportions);

            let minHeight = overlayProportions.natural.offset.top + overlayProportions.natural.smallPicture.height;
            if (imageProportions.naturalHeight < minHeight) {
                this.setState({
                    invalid: true,
                    calculationRun: false,
                    imageProportions: imageProportions,
                });
            }

            this.setState({
                calculationRun: true,
                imageProportions: imageProportions,
                overlayProportions: overlayProportions,
            });
        }
    }

    setOverlayStyle(propotions, imageProportions) {
        this.bigOverlay.current.style.width = propotions.visible.bigPicture.width + "px";
        this.bigOverlay.current.style.height = propotions.visible.bigPicture.height + "px";

        this.smallOverlay.current.style.width = propotions.visible.smallPicture.width + "px";
        this.smallOverlay.current.style.height = propotions.visible.smallPicture.width + "px";

        let borderWidth = getComputedStyle(this.smallOverlay.current).borderWidth;
        borderWidth = borderWidth.substr(0, borderWidth.length - 2);
        this.smallOverlay.current.style.left = (propotions.visible.offset.left - borderWidth) + "px";
        this.smallOverlay.current.style.top = (propotions.visible.offset.top - borderWidth) + "px";

        this.smallOverlay.current.style.backgroundImage = "url('" + this.props.image.preview +"')";
        this.smallOverlay.current.style.backgroundPosition = "-" + propotions.visible.offset.left + "px -"
            + propotions.visible.offset.top + "px";
        this.smallOverlay.current.style.backgroundSize = imageProportions.width + "px "
            + imageProportions.height + "px";
    }

    croppImage(proportions, offset = null) {
        let imageProp = this.state.imageProportions;
        return new Promise((resolve) => {
            let cropper = new Cropper(this.image.current.image, {
                viewMode: 1,
                autoCropArea: 0,
                strict: false,
                guides: false,
                highlight: false,
                dragCrop: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
                minContainerHeight: imageProp.naturalHeight,
                minContainerWidth: imageProp.naturalWidth,
                minCanvasHeight: imageProp.naturalHeight,
                minCanvasWidth: imageProp.naturalWidth,
                ready: function () {
                    cropper.setCanvasData({
                        left: 0,
                        top: 0,
                        height: imageProp.naturalHeight,
                        width: imageProp.naturalWidth,
                    });
                    cropper.setCropBoxData({
                        left: offset ? offset.left : 0,
                        top: offset ? offset.top : 0,
                        height: proportions.height,
                        width: proportions.width,
                    });
                    console.log(cropper.getCropBoxData());
                    cropper.getCroppedCanvas().toBlob(function (blob) {
                        cropper.destroy();
                        resolve(URL.createObjectURL(blob));
                    });
                }
            });
        });
    }

    onImageMouseDown(event) {
        let root = this;
        let mouseStart = event.pageY;
        let imagePosition = Math.abs(parseInt(root.image.current.image.style.marginTop || 0));
        let overlayPosition = Math.abs(parseInt(root.smallOverlay.current.style.backgroundPositionY));

        moveImage(event.pageY);
        function moveImage(pageY) {
            let imageOffset = (imagePosition + (mouseStart - pageY));
            let overlayOffset = (overlayPosition + (mouseStart - pageY));
            overlayOffset = overlayOffset > root.state.overlayProportions.visible.offset.top ?
                overlayOffset :
                root.state.overlayProportions.visible.offset.top;

            root.image.current.image.style.marginTop = "-" + (imageOffset > 0 ? imageOffset : 0) + "px";
            root.smallOverlay.current.style.backgroundPositionY = "-" + overlayOffset + "px";

            // TODO: setState with offset to cut properly!
        }

        function onMouseMove(event) {
            moveImage(event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateCalculation);
        this.imageContainer.current.ondragstart = function() {
            return false;
        };
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateCalculation);
    }

    render() {
        return (
            <div className='imageManager'>
                <div ref={this.fader} className='imageManager_fader'>
                </div>
                <div
                    className="imageManager_imageContainer imageContainer"
                    ref={this.imageContainer}
                    onMouseDown={this.onImageMouseDown}
                >
                    <div
                        className={"imageContainer_bigOverlay " + (this.state.calculationRun ? "" : "hidden")}
                        ref={this.bigOverlay}
                    >
                    </div>
                    <div
                        className={"imageContainer_smallOverlay " + (this.state.calculationRun ? "" : "hidden")}
                        ref={this.smallOverlay}
                    >
                    </div>

                    <img
                        className={"imageContainer_loading " + (this.state.imageLoaded ? "hidden" : "")}
                        src="build/loading.GIF"
                        alt="loading"
                    />

                    <ImageOnLoad
                        ref={this.image}
                        className={"imageManager_image " + (this.state.imageLoaded ? "" : "hidden")}
                        key={this.props.image.preview}
                        src={this.props.image.preview}
                        onLoad={this.onImageLoad}
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
                    <Button
                        variant="contained"
                        color="primary"
                        className="imageManager_apply"
                        onClick={this.onApplyClick}
                        disabled={this.state.invalid || !this.state.calculationRun}
                    >
                        Apply
                    </Button>
                </div>
            </div>
        );
    };
};

ImageManager.propTypes = {
    image: PropTypes.object.isRequired,
    onResetClick: PropTypes.func.isRequired,
    onApplyClick: PropTypes.func.isRequired,
};

export default ImageManager;
