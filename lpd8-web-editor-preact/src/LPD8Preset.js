
class LPD8Preset {

    channel = 1;
    preset_nr = 1;
    pads = [];
    knobs = [];

    constructor() {
        for (let i = 0; i < 8; i++) {
            this.pads.push({
                "number": i + 1,
                "note": 60 + i,
                "pc": i,
                "cc": 8 + i,
                "momentary": false
            }),
            this.knobs.push({
                "number": i + 1,
                "cc": i,
                "min": 0,
                "max": 127
            })
        }
    }

    setPadData(padNr, data) {
        for (let i in this.pads) {
            if (this.pads[i].number === padNr) {
                this.pads[i].note = data.note;
                this.pads[i].pc = data.pc;
                this.pads[i].cc = data.cc;
                this.pads[i].momentary = data.momentary;
            }
        }
    }

    setKnobData(knobNr, data) {
        for (let i in this.knobs) {
            if (this.knobs[i].number === knobNr) {
                this.knobs[i].cc = data.cc;
                this.knobs[i].min = data.min;
                this.knobs[i].max = data.max;
                return;
            }
        }
        throw Error('Could not set data on knob', knobNr);
    }

    toSysex() {
        let data = [];

        // we omit the SysEx Start and the manufacturer byte (0x47, Akai)
        data = [ 0x7F, 0x75, 0x61, 0x00, 0x3A ];
        
        data.push(this.preset_nr);
        data.push(this.channel - 1);

        for (let i = 0; i < 8; i++) {
            const pad = this.pads.find(pad => {
                return pad.number === i + 1;
            });
            data.push(pad.note);
            data.push(pad.pc);
            data.push(pad.cc);
            data.push(pad.momentary ? 0 : 1);
        }

        for (let i = 0; i < 8; i++) {
            const knob = this.knobs.find(knob => {
                return knob.number === i + 1;
            });
            data.push(knob.cc);
            data.push(knob.min);
            data.push(knob.max);
        }

        console.log('wrote some bytes', data.length);
        return data;
    }

    static fromSysex(data) {
        const preset = new LPD8Preset();
        preset.channel = data[8] + 1;
        preset.preset_nr = data[7];

        const padDataStart = 9;
        const knobDataStart = padDataStart + 4 * 8;

        for (let i = 0; i < 8; i++) {
            const thisPadDataOffset = padDataStart + i * 4;
            preset.pads[i].note = data[thisPadDataOffset];
            preset.pads[i].pc = data[thisPadDataOffset + 1];
            preset.pads[i].cc = data[thisPadDataOffset + 2];
            preset.pads[i].momentary = data[thisPadDataOffset + 3] === 0;

            const thisKnobDataOffset = knobDataStart + i * 3;
            preset.knobs[i].cc = data[thisKnobDataOffset];
            preset.knobs[i].min = data[thisKnobDataOffset + 1];
            preset.knobs[i].max = data[thisKnobDataOffset + 2];
        }

        return preset;
    }
}

export default LPD8Preset;