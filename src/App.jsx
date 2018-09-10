import React, {Component} from 'react';
import ReactDropzone from 'react-dropzone';
import ImageManager from './components/ImageManager.jsx';
import ImageDisplayer from "./components/ImageDisplayer.jsx";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            cropped: false,
        };

        this.onPreviewDrop = this.onPreviewDrop.bind(this);
        this.getFile = this.getFile.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onApply = this.onApply.bind(this);
    };

    onPreviewDrop(files) {
        this.setState({
            files: files,
        });
    };

    getFile() {
        if (this.state.files.length > 0 ) {
            return this.state.files[0];
        }

        return false
    }

    onReset() {
        this.setState({
            files: [],
            cropped: false,
        });
    }

    onApply(bigBlob, smallBlob) {
        this.setState({
            files: [bigBlob, smallBlob],
            cropped: true,
        });
    }

    render() {
        let currentFile = this.getFile();
        return (
            <div className='mainContainer'>
                <h1 className='mainContainer_titleBar'>Profile generator</h1>
                {
                    (!currentFile && !this.state.cropped) &&
                    <ReactDropzone
                        className='mainContainer_dropZone dropZone'
                        onDrop={this.onPreviewDrop}
                    >
                        <img className='dropZone_icon' src='build/drop.svg' alt='Drop file here'/>
                    </ReactDropzone>
                }

                {
                    (currentFile && !this.state.cropped) &&
                    <ImageManager
                        image={currentFile}
                        onResetClick={this.onReset}
                        onApplyClick={this.onApply}
                    />
                }

                {
                    this.state.cropped &&
                    <ImageDisplayer
                        images={this.state.files}
                        onResetClick={this.onReset}
                    />
                }
            </div>
        );
    };
}

export default App;
