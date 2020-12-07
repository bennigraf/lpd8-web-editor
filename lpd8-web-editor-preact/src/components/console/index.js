const { Component } = require("preact");

import style from './style.css';

const welcomeMessage = `Hello World! This is the console. We'll show what's going on behind the scenes here.`;

const MAX_LINES = 25;

class Console extends Component {

    lastPostedEvent = null;

    state = {
        lines: [
            { message: welcomeMessage }
        ]
    }

    componentDidMount() {
        // this.props.ref(this);
        this.props.setConsole(this);
    }

    postMessage(message) {
        this.lastPostedEvent = null;
        // this.state.lines.push({ message: message })
        this.state.lines.splice(0, 0, { message: message });
        this.setState({
            lines: this.state.lines
        });
    }

    parseAndPostEvent(event) {
        let message = 'An unknown thing happened!';

        if (event.type === 'controlchange') {
            message = `CH ${event.channel}: CC ${event.controller.number} - ${event.value}`;
        } else if (event.type === 'programchange') {
            message = `CH ${event.channel}: PC ${event.value}`;
        } else if (event.type === 'noteon') {
            message = `CH ${event.channel}: NoteOn ${event.note.number} - ${event.rawVelocity}`;
        } else if (event.type === 'noteoff') {
            message = `CH ${event.channel}: NoteOff ${event.note.number} - ${event.rawVelocity}`;
        } else if (event.type === 'sysex') {
            const someData = event.data.slice(1, 20).join(' ');
            message = `Sysex – ${someData}`;
            if (event.data.length > 21) {
                message += ' …';
            }
        }

        this.setState((state, _) => {
            let replaceInsteadOfPrepend = this.eventIsSimilarToPreviouslyPostedEvent(event);
        
            if (replaceInsteadOfPrepend) {
                state.lines.splice(0, 1, { message: message });
            } else {
                state.lines.splice(0, 0, { message: message });
            }

            if (state.lines.length >= MAX_LINES) {
                state.lines.splice(MAX_LINES, state.lines.length - MAX_LINES);
            }

            this.lastPostedEvent = event;
            return {
                lines: state.lines
            }
        });
    }

    eventIsSimilarToPreviouslyPostedEvent = event => {
        if (this.lastPostedEvent === null) {
            return false;
        }

        if (event.type !== this.lastPostedEvent.type) {
            return false;
        }

        if (event.channel !== this.lastPostedEvent.channel) {
            return false;
        }

        if (event.type === 'controlchange') {
            return this.lastPostedEvent.controller.number === event.controller.number;
        }

        if (event.type === 'programchange') {
            return true;
        }

        if (event.type === 'noteon' || event.type === 'noteoff') {
            return this.lastPostedEvent.note.number === event.note.number;
        }

        if (event.type === 'sysex') {
            return false;
        }

        return false;
        // if (event.)
        // this.lastPostedEvent !== null &&
        //         this.lastPostedEvent.channel === event.channel &&
        //         this.lastPostedEvent.controller.number === event.controller.number;
    }

    render (props, state) {
        const lines = state.lines.map(line => {
            return (
                <p class="my-0 py-1">{ line.message }</p>
            )
        });

        return (
            <div class={ 'column content is-small is-family-monospace ' + style.console }>
                { lines }
            </div>
        );
    }
}

export default Console;
