const { Component } = require("preact");

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class PresetLoader extends Component {

    loadPreset = (event, presetNr) => {
        event.target.classList.add('is-primary');
        setTimeout(() => {
            event.target.classList.remove('is-primary')
        }, 200);
        this.props.onLoadPresetFromDevice(presetNr);
    }

    loadDefaultPreset = () => {
        console.log('load default preset from "disk"');
        this.props.onLoadDefaultPreset();
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

        const content = (<>
            <div style="float: left;" class="mr-5">
                <p class="is-size-7">
                    Load preset from device slot:
                </p>
                <div class="buttons has-addons">
                    <button class="button" onClick={ event => { this.loadPreset(event, 1) } }>1</button>
                    <button class="button" onClick={ event => { this.loadPreset(event, 2) } }>2</button>
                    <button class="button" onClick={ event => { this.loadPreset(event, 3) } }>3</button>
                    <button class="button" onClick={ event => { this.loadPreset(event, 4) } }>4</button>
                </div>
            </div>
            <div style="">
                <p class="is-size-7">
                    ...or:
                </p>
                <button class="button is-small" onClick={ this.loadDefaultPreset }>Load a default preset</button>
            </div>
        </>)

        const sectionBody = !props.active ? loader : content;

        return (<>
            <div class="message">
                <div class="message-header">
                    <p>Load settings</p>
                </div>
                <div class="message-body">
                    { sectionBody }
                </div>
            </div>
        </>)
    }
}

export default PresetLoader;