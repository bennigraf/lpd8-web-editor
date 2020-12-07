const { Component } = require("preact");

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class Uploader extends Component {

    state = {
        selectedSlot: null,
        isUploading: false
    }

    selectSlot = presetNr => {
        this.setState({
            selectedSlot: presetNr
        });
    }

    upload = () => {
        this.props.onUpload(this.state.selectedSlot);
        this.setState({ isUploading: true }, () => {
            setTimeout(() => {
                this.setState({ 
                    isUploading: false,
                    selectedSlot: null
                });
            }, 280);
        })
    }

    render(props, state) {
        const loader = (
            <p class="content">
                <span class="icon">
                    <FontAwesomeIcon icon={faSpinner} spin />
                </span>
                Waiting for MIDI device selection
            </p>
        );

        const content = (
            <div>
                <p class="is-size-7">
                    Save settings to device in slot:
                </p>
                <div class="buttons has-addons">
                    <button class={ 'button' + (state.selectedSlot === 1 ? ' is-primary' : '') }
                            disabled={ state.isUploading }
                            onClick={ _ => { this.selectSlot(1) } }>
                        1
                    </button>
                    <button class={ 'button' + (state.selectedSlot === 2 ? ' is-primary' : '') }
                            disabled={ state.isUploading }
                            onClick={ _ => { this.selectSlot(2) } }>
                        2
                    </button>
                    <button class={ 'button' + (state.selectedSlot === 3 ? ' is-primary' : '') }
                            disabled={ state.isUploading }
                            onClick={ _ => { this.selectSlot(3) } }>
                        3
                    </button>
                    <button class={ 'button' + (state.selectedSlot === 4 ? ' is-primary' : '') }
                            disabled={ state.isUploading }
                            onClick={ _ => { this.selectSlot(4) } }>
                        4
                    </button>
                </div>
                <div class={ ( state.selectedSlot === null ? 'is-hidden' : '' ) }>
                    <button class="button is-danger" 
                            disabled={ state.isUploading }
                            onClick={ this.upload }>
                        Upload to device
                    </button>
                    <p class="my-3 is-size-7">
                        <strong>Attention:</strong> When clicking upload, all settings on the device will be overwritten
                        by the settings listed below!
                    </p>
                </div>
            </div>
        )

        const sectionBody = !props.active ? loader : content;

        return (<>
            <div class="message">
                <div class="message-header">
                    <p>Save settings to device</p>
                </div>
                <div class="message-body">
                    { sectionBody }
                </div>
            </div>
        </>)
    }
}

export default Uploader;
