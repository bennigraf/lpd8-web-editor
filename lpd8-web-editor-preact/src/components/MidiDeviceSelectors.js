const { Component } = require("preact");

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class MidiDeviceSelectors extends Component {

    findDeviceByIdFromList = (id, list) => {
        for (let index in list) {
            if (list[index].id == id) {
                return list[index];
            }
        }
        throw Error('non-existing device id')
    }

	selectInDevice = async event => {
		const selectedDeviceId = event.target.value;
        const inDevice = this.findDeviceByIdFromList(selectedDeviceId, this.props.inDevices);
        this.props.onInDeviceSelection(inDevice);
	}

	selectOutDevice = async event => {
		const selectedDeviceId = event.target.value;
        const outDevice = this.findDeviceByIdFromList(selectedDeviceId, this.props.outDevices);
        this.props.onOutDeviceSelection(outDevice);
    }

    render(props, state) {
		const midiInDevices = props.inDevices.map(device => {
			return (
				<option value={ device.id }>
					{ device.name }
				</option>
			);
        })
        
		const midiOutDevices = props.outDevices.map(device => {
			return (
				<option value={ device.id }>
					{ device.name }
				</option>
			);
        })

        
        const loader = (
            <p class="content">
                <span class="icon">
                    <FontAwesomeIcon icon={faSpinner} spin />
                </span>
                Waiting for MIDI to start…
            </p>
        )

        const selectors = (
            <div class="columns is-desktop">
                <div class="column">
                    <p class="mb-3 is-size-7">
                        Select a device port to <strong>read data from</strong>:
                    </p>
                    <div class="select is-multiple is-small"
                         style="width: 100%;">
                        <select value={ props.selectedInDevice?.id } 
                                onChange={ this.selectInDevice } 
                                multiple
                                style="width: 100%;">
                            { midiInDevices }
                        </select>
                    </div>
                </div>
                
                <div class="column">
                    <p class="mb-3 is-size-7">
                        Select a device port to <strong>write data to</strong>:
                    </p>
                    <div class="select is-multiple is-small"
                         style="width: 100%;">
                        <select value={ props.selectedOutDevice?.id } 
                                onChange={ this.selectOutDevice } 
                                multiple
                                style="width: 100%;">
                            { midiOutDevices }
                        </select>
                    </div>
                </div>
            </div>
        );

        const sectionBody = !props.active ? loader : selectors;

        return (<>
        <div class="message mt-5">
            <div class="message-header">
                <p>MIDI device selector</p>
            </div>
            <div class="message-body">
                { sectionBody }
            </div>
        </div>
        </>)
    }
}

export default MidiDeviceSelectors;