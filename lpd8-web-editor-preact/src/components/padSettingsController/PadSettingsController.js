const { Component } = require("preact");
import { toInteger } from 'lodash';
import style from './style.css';

class PadSettingsController extends Component {
    state = {
        noteValue: 0,
        ccValue: 0,
        pcValue: 0,

        isMomentary: true,
    }

    noteChange = event => {
        const val = toInteger(event.target.value);
        this.setState({ noteValue: val })
    }

    ccChange = event => {
        const val = toInteger(event.target.value);
        this.setState({ ccValue: val })
    }

    pcChange = event => {
        const val = toInteger(event.target.value);
        this.setState({ pcValue: val })
    }

    componentDidUpdate(prevProps, state) {
        if (prevProps.fullSettings !== this.props.fullSettings) {
            const padSettings = this.props.fullSettings.pads.find(pad => {
                return pad.number === this.props.padNr;
            });
            this.setState({
                noteValue: padSettings.note,
                pcValue: padSettings.pc,
                ccValue: padSettings.cc,
                isMomentary: padSettings.momentary
            });
            return;
        }

        this.props.onPadSettingsUpdate({
            note: this.state.noteValue,
            cc: this.state.ccValue,
            pc: this.state.pcValue,
            momentary: this.state.isMomentary,
        });
    }

    render (props, state) {
        const noteFieldIsValid = state.noteValue >= 0 && state.noteValue <= 127;
        const ccFieldIsValid = state.ccValue >= 0 && state.ccValue <= 127;
        const pcFieldIsValid = state.pcValue >= 0 && state.pcValue <= 127;

        return (
            <div class={ 'card m-3 ' + style.condensedCard }>
                <header class="card-header">
                    <p class="card-header-title">
                        Pad { props.padNr }
                    </p>
                </header>
                <div class="card-content">

                    <div class="field is-horizontal">
                        <div class="field-label is-small">
                            <label class="label">Note number</label>
                        </div>
                        <div class={ 'field-body ' + style.limitedWidthField}>
                            <div class="field">
                                <div class="control">
                                    <input class={ 'input is-small is-rounded ' + style.limitedWidth + (!noteFieldIsValid ? ' is-danger' : '') } 
                                           type="number" min="0" max="127" required value={ state.noteValue }
                                           onChange={ this.noteChange } />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field is-horizontal">
                        <div class="field-label is-small">
                            <label class="label">CC number</label>
                        </div>
                        <div class={ 'field-body ' + style.limitedWidthField}>
                            <div class="field">
                                <div class="control">
                                    <input class={ 'input is-small is-rounded ' + style.limitedWidth + (!ccFieldIsValid ? ' is-danger' : '') } 
                                            type="number" min="0" max="127" required value={ state.ccValue }
                                            onChange={ this.ccChange } />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field is-horizontal">
                        <div class="field-label is-small">
                            <label class="label">PC number</label>
                        </div>
                        <div class={ 'field-body ' + style.limitedWidthField}>
                            <div class="field">
                                <div class="control">
                                    <input class={ 'input is-small is-rounded ' + style.limitedWidth + (!pcFieldIsValid ? ' is-danger' : '') } 
                                            type="number" min="0" max="127" required value={ state.pcValue }
                                            onChange={ this.pcChange } />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="buttons has-addons">
                        <button class={ 'button is-small is-rounded ' + (state.isMomentary ? 'is-info is-selected' : '') }
                                onClick={ () => { this.setState(state => { return { isMomentary: true } } ) } }>
                            Momentary
                        </button>
                        <button class={ 'button is-small is-rounded ' + (!state.isMomentary ? 'is-info is-selected' : '') }
                                onClick={ () => { this.setState(state => { return { isMomentary: false } } ) } }>
                            Toggle
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default PadSettingsController