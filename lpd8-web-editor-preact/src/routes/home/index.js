import { Component, h } from 'preact';
import WebMidi from 'webmidi';
import MidiDeviceSelectors from '../../components/MidiDeviceSelectors';
import PresetLoader from '../../components/PresetLoader';
import Console from '../../components/console';

import style from './style.css';

// const isEqual = require('lodash/array/isEqual');
// const _array = require('lodash/array');
// import { array } from 'lodash';
// import array from "lodash/array";
// console.log(array);
import isEqual from 'lodash';
import LPD8Preset from '../../LPD8Preset';
import PadSettingsController from '../../components/padSettingsController/PadSettingsController';
import KnobSettingsController from '../../components/knobSettingsController/KnobSettingsController';
import Uploader from '../../components/Uploader';
import MidiChannelController from '../../components/midiChannelController/MidiChannelController';

class WebMidiHelper {
	enable() {
		return new Promise((resolve, reject) => {
			WebMidi.enable(function (err) {
				if (err) {
				  console.log("WebMidi could not be enabled.", err);
				  reject('could not enable webmidi');
				} else {
				  console.log("WebMidi enabled with sysex!");
				  resolve();
				}
			}, true);
		})
	}

	static portToDeviceInfo(port) {
		return [ 
			port.manufacturer, port.name, `(${port.type})` 
		].filter(item => item && item != '').join(' ');
	}
}
const webMidiHelper = new WebMidiHelper();

const LPD8MidiHelper = {
	parseSysex: data => {
		if (data[0] !== 0xf0 || data[data.length-1] !== 0xf7) {
			throw Error('invalid sysex packet');
		}

		if (data.length !== 66) {
			throw Error('unexpected packet length');
		}

		const packetHeader = data.slice(1, 7);
		const expectedPacketHeader = [0x47, 0x7F, 0x75, 0x63, 0x00, 0x3A];
		if (!isEqual(packetHeader, expectedPacketHeader)) {
			throw Error('unexpected packet header');
		}

		return LPD8Preset.fromSysex(data);
	}
}

class Home extends Component {

	inDevice = null;
	outDevice = null;

	lpd8SettingsToStore = new LPD8Preset();
	
	constructor() {
		super();
		this.state = { 
			midiIsConnected: false,
			midiInDevices: [],
			midiOutDevices: [],
			selectedInDevice: null,
			selectedOutDevice: null,

			loadedLpd8Settings: new LPD8Preset(),
		};
	}

	startMidi = async () => {
		try {
			await webMidiHelper.enable();
			this.console.postMessage('MIDI started');

			WebMidi.addListener("connected", e => {
				console.log('connected');
				console.log(e);
				this.console.postMessage(
					`Device found: ${WebMidiHelper.portToDeviceInfo(e.port)}`
				);
				if (e.port.type === 'input') {
					this.setState({ midiInDevices: WebMidi.inputs });
				} else {
					this.setState({ midiOutDevices: WebMidi.outputs });
				}
			});
			  
			// Reacting when a device becomes unavailable
			WebMidi.addListener("disconnected", e => {
				console.log('disconnected');
				console.log(e);
				this.console.postMessage(
					`Lost connection to a device: ${WebMidiHelper.portToDeviceInfo(e.port)}`
				);
				console.log(e.port);
				let stateToUpdate = { };
				if (e.port.type === 'input') {
					stateToUpdate = { midiInDevices: WebMidi.inputs };
				} else {
					stateToUpdate = { midiOutDevices: WebMidi.outputs };
				}
				if (e.port.id === this.state.selectedInDevice?.id) {
					stateToUpdate.selectedInDevice = null;
				}
				if (e.port.id === this.state.selectedOutDevice?.id) {
					stateToUpdate.selectedOutDevice = null;
				}
				this.setState(stateToUpdate);
			});

			this.setState({
				midiIsConnected: true,
				midiInDevices: WebMidi.inputs,
				midiOutDevices: WebMidi.outputs
			});

			const lpd8InDevice = WebMidi.inputs.find(device => device.name === 'LPD8' );
			if (lpd8InDevice !== undefined) {
				this.console.postMessage(`Input device auto-discovery: found ${lpd8InDevice.name}`);
				this.inDeviceSelected(lpd8InDevice);
			}

			const lpd8OutDevice = WebMidi.outputs.find(device => device.name === 'LPD8' );
			if (lpd8OutDevice !== undefined) {
				this.console.postMessage(`Output device auto-discovery: found ${lpd8OutDevice.name}`);
				this.outDeviceSelected(lpd8OutDevice);
			}

		} catch (e) {
			console.log('Could not enable webmidi!');
			console.log(e);
		}
	}

	inDeviceSelected = device => {
		console.log('got in device', device.name);
		this.console.postMessage(`Select device for input: ${device.name}`);
		if (this.inDevice !== null) {
			// remove all handlers
			this.inDevice.removeListener();
		}

		this.inDevice = device;
		this.setState({ selectedInDevice: device });

		this.inDevice.on('sysex', undefined, event => {
			console.log('got sysex');
			// console.log(event.data);
			try {
				this.preset = LPD8MidiHelper.parseSysex(event.data);
			} catch (e) {
				console.log('failed to parse sysex', e);
			}

			this.setState({
				loadedLpd8Settings: this.preset
			})
		});

		this.inDevice.on('controlchange', undefined, event => {
			this.console.parseAndPostEvent(event);
		});
		this.inDevice.on('programchange', undefined, event => {
			this.console.parseAndPostEvent(event);
		});
		this.inDevice.on('noteon', undefined, event => {
			this.console.parseAndPostEvent(event);
		});
		this.inDevice.on('noteoff', undefined, event => {
			this.console.parseAndPostEvent(event);
		});
		this.inDevice.on('sysex', undefined, event => {
			this.console.parseAndPostEvent(event);
		});
	}

	outDeviceSelected = device => {
		console.log('got out device', device.name);
		this.console.postMessage(`Select device for output: ${device.name}`);
		this.outDevice = device;
		this.setState({ selectedOutDevice: device });
	}

	requestPresetFromDevice = presetNr => {
		console.log('get preset from device', presetNr);
		// const presetData = webMidiHelper.loadPresetFromDevice(this.outDevice, presetNr);
		this.outDevice.sendSysex(
			0x47,
			[0x7F, 0x75, 0x63, 0x00, 0x01, presetNr]
		);
	}

	loadDefaultPreset = () => {
		console.log('set default preset');
		this.setState({
			loadedLpd8Settings: new LPD8Preset()
		});
	}

	setConsole = console => {
		this.console = console;
	}

	makePadSettingsUpdateHandler = padNr => {
		return data => {
			this.lpd8SettingsToStore.setPadData(padNr, data);
		}
	}

	makeKnobSettingsUpdateHandler = knobNr => {
		return data => {
			this.lpd8SettingsToStore.setKnobData(knobNr, data);
		}
	}

	channelUpdateHandler = data => {
		this.lpd8SettingsToStore.channel = data.channel;
	}

	uploadSettingsToDevice = slotNr => {
		console.log('will store settings to device slot', slotNr);
		this.lpd8SettingsToStore.preset_nr = slotNr;
		const data = this.lpd8SettingsToStore.toSysex();
		this.outDevice.sendSysex(0x47, data);
	}

	render(_, state) {
		const deviceSelector = (
			<MidiDeviceSelectors inDevices={ state.midiInDevices }
								 outDevices={ state.midiOutDevices }
								 selectedInDevice={ state.selectedInDevice }
								 selectedOutDevice={ state.selectedOutDevice }
								 onInDeviceSelection={ this.inDeviceSelected }
								 onOutDeviceSelection={ this.outDeviceSelected } 
								 active={ state.midiIsConnected } />
		);

		const presetLoader = (
			<PresetLoader onLoadPresetFromDevice={ this.requestPresetFromDevice }
						  onLoadDefaultPreset={ this.loadDefaultPreset }
						  active={ state.selectedInDevice !== null && state.selectedOutDevice !== null } />
		);
		
		const uploader = (
			<Uploader active={ state.selectedInDevice !== null && state.selectedOutDevice !== null }
					  onUpload={ this.uploadSettingsToDevice } />
		);
		
		const padSettings = [1, 2, 3, 4, 5, 6, 7, 8].map(padNr => {
			return (
				<PadSettingsController padNr={ padNr } 
					onPadSettingsUpdate={ this.makePadSettingsUpdateHandler(padNr) } 
					fullSettings={ state.loadedLpd8Settings } />
			)
		});
		
		const knobSettings = [1, 2, 3, 4, 5, 6, 7, 8].map(knobNr => {
			return (
				<KnobSettingsController knobNr={ knobNr } 
					onPadSettingsUpdate={ this.makeKnobSettingsUpdateHandler(knobNr) } 
					fullSettings={ state.loadedLpd8Settings } />
			)
		});

		return (<>
			<div class="columns is-tablet">
				<div class="column content p-5">
					<p>
						Welcome to the LPD8 Web Midi Editor. Use this tool to change the MIDI
						settings of your AKAI LPD8 controller – even on MacOS Catalina :-). The 
						code is publicly hosted at <a href="https://github.com/bennigraf/lpd8-web-editor">
						https://github.com/bennigraf/lpd8-web-editor</a>. There you can also find a few 
						details about the MIDI protocol used by the device.
					</p>
					<p>
						<strong>Disclaimer:</strong> I am in no way affiliated with AKAI. This tool has been developed completely independently
						and there is no official or inofficial support or warranty. Use at your own risk!
					</p>
					<div class="notification is-warning">
						This tool uses <strong>WebMidi</strong> to communicate with the LPD8 controller. This
						is currently supported best in Google Chrome and Chromium browsers. Supposedly there
						are plugins for Firefox and Safari, but I didn't test those – and neither the Edge
						browser, which might or might not work.
					</div>
					<p>
						To get started, connect your device 
						to your computer and click "Start MIDI".
					</p>
					<button class="button is-success"
							onClick={ this.startMidi }
							disabled={ state.midiIsConnected }>
						Start MIDI
					</button>
					
					{ deviceSelector }

					{ presetLoader }

					{ uploader }

				</div>
				
				<Console setConsole={ this.setConsole } />
			</div>
			<div class="container is-fluid py-3">
				<div class="content">
					<MidiChannelController
						onChannelUpdate={ this.channelUpdateHandler } 
						fullSettings={ state.loadedLpd8Settings } />
				</div>
				<div class="content">
					{ padSettings }
				</div>
				<div class="content">
					{ knobSettings }
				</div>
			</div>
		</>)
	}
}

export default Home;
