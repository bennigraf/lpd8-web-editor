const { Component } = require("preact");
import { toInteger } from 'lodash';
import style from './style.css';

class MidiChannelController extends Component {
    state = {
        channelValue: 1,
    }

    channelChange = event => {
        const val = toInteger(event.target.value);
        this.setState({ channelValue: val })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.fullSettings !== this.props.fullSettings) {
            this.setState({
                channelValue: this.props.fullSettings.channel,
            });
            return;
        }

        prevProps.onChannelUpdate({
            channel: this.state.channelValue,
        });
    }

    render (props, state) {
        const channelFieldIsValid = state.channelValue >= 1 && state.channelValue <= 16;

        return (
            <div class={ 'card m-3 ' + style.condensedCard }>
                <header class="card-header">
                    <p class="card-header-title">
                        Midi channel
                    </p>
                </header>
                <div class="card-content">
                    <div class="field is-horizontal">
                        <div class="field-label is-small">
                            <label class="label">Midi channel</label>
                        </div>
                        <div class={ 'field-body ' + style.limitedWidthField}>
                            <div class="field">
                                <div class="control">
                                    <input class={ 'input is-small is-rounded ' + style.limitedWidth + (!channelFieldIsValid ? ' is-danger' : '') } 
                                           type="number" min="1" max="16" required value={ state.channelValue }
                                           onChange={ this.channelChange } />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MidiChannelController