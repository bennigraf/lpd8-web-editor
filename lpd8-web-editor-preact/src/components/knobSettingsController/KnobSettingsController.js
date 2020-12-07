const { Component } = require("preact");
import { toInteger } from 'lodash';
import style from './style.css';

class KnobSettingsController extends Component {
    state = {
        ccValue: 0,
        minValue: 0,
        maxValue: 0,
    }

    ccChange = event => {
        const val = toInteger(event.target.value);
        this.setState({ ccValue: val })
    }

    minChange = event => {
        const val = toInteger(event.target.value);
        this.setState({ minValue: val })
    }

    maxChange = event => {
        const val = toInteger(event.target.value);
        this.setState({ maxValue: val })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.fullSettings !== this.props.fullSettings) {
            const padSettings = this.props.fullSettings.knobs.find(knob => {
                return knob.number === this.props.knobNr;
            });
            this.setState({
                ccValue: padSettings.cc,
                minValue: padSettings.min,
                maxValue: padSettings.max,
            });
            return;
        }

        prevProps.onPadSettingsUpdate({
            cc: this.state.ccValue,
            min: this.state.minValue,
            max: this.state.maxValue,
        });
    }

    render (props, state) {
        const ccFieldIsValid = state.ccValue >= 0 && state.ccValue <= 127;
        const minFieldIsValid = state.minValue >= 0 && state.minValue <= 127;
        const maxFieldIsValid = state.maxValue >= 0 && state.maxValue <= 127;

        return (
            <div class={ 'card m-3 ' + style.condensedCard }>
                <header class="card-header">
                    <p class="card-header-title">
                        Knob K{ props.knobNr }
                    </p>
                </header>
                <div class="card-content">

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
                            <label class="label">Min. value</label>
                        </div>
                        <div class={ 'field-body ' + style.limitedWidthField}>
                            <div class="field">
                                <div class="control">
                                    <input class={ 'input is-small is-rounded ' + style.limitedWidth + (!minFieldIsValid ? ' is-danger' : '') } 
                                            type="number" min="0" max="127" required value={ state.minValue }
                                            onChange={ this.minChange } />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field is-horizontal">
                        <div class="field-label is-small">
                            <label class="label">Max. value</label>
                        </div>
                        <div class={ 'field-body ' + style.limitedWidthField}>
                            <div class="field">
                                <div class="control">
                                    <input class={ 'input is-small is-rounded ' + style.limitedWidth + (!maxFieldIsValid ? ' is-danger' : '') } 
                                            type="number" min="0" max="127" required value={ state.maxValue }
                                            onChange={ this.maxChange } />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default KnobSettingsController