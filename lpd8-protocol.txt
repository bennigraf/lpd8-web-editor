# LPD8 MIDI sysex protocol

## Request preset from device: 9 bytes

7 bytes command, 1 byte preset# (01-04), 1 byte "EOL"
`F0 47 7F 75 63 00 01 01 F7`

LPD8 answers with preset dataset formatted as described in the next section, i.e.

```
00  F0 47 7F 75 63 00 3A 04  00 50 06 01 00 4F 07 02
10  00 53 08 03 00 52 09 04  00 24 00 05 00 26 01 06
20  00 2A 02 09 00 2E 03 08  00 00 00 7F 01 00 7F 02
30  00 7F 03 00 7F 04 00 7F  05 00 7F 06 00 7F 08 00
40  7F F7
```

## Write preset to device: 66 bytes

7 bytes: command
`F0 47 7F 75 61 00 3A`

1 byte: preset number, 1-4
`01`

1 byte: MIDI channel of preset, 0-15 (aka 00-0f)
`0f`

For 8 pads: 4 bytes each (=32 bytes) with 
 - 1 byte note# 0-x
 - 1 byte PC# 0-x
 - 1 byte CC# 0-x
 - 1 byte "Toggle" vs. "Momentary" (0-1)
i.e.
`01 11 21 01 02 12 22 00 03 13 23 01 04 14 24 00 05 15 25 01 06 16 26 00 07 17 27 01 08 18 28 00`

For 8 CCs: 3 bytes each (=24 bytes) with
 - 1 byte CC# 0-x
 - 1 byte CC value "from"
 - 1 byte CC value "to"
i.e.
`41 00 09 42 10 19 43 20 29 44 30 39 45 40 49 46 50 59 47 60 69 48 70 79`

1 byte "EOL":
`F7`
