import React, {Component} from 'react';
import ReactDropzone from 'react-dropzone';
import ImageManager from './components/ImageManager.jsx';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
        };

        this.onPreviewDrop = this.onPreviewDrop.bind(this);
        this.getFile = this.getFile.bind(this);
        this.onReset = this.onReset.bind(this);
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
        console.log("RESET");
    }

    componentDidUpdate( prevProps,  prevState) {
    }

    render() {
        let currentFile = this.getFile();
        return (
            <div className='mainContainer'>
                <h1>Profile generator</h1>
                {
                    !currentFile &&
                    <ReactDropzone
                        className='mainContainer_dropZone dropZone'
                        onDrop={this.onPreviewDrop}
                    >
                        <img className='dropZone_icon' src='build/drop.svg' alt='Drop file here'/>
                    </ReactDropzone>
                }

                {
                    currentFile &&
                    <ImageManager
                        image={currentFile}
                        onResetClick={this.onReset}
                    />
                }
            </div>
        );
    };
}

export default App;
