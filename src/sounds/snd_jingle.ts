import {AudioClip} from "../components/com_audio_source";

export let snd_jingle = <AudioClip>{
    BPM: 100,
    Tracks: [
        {
            Instrument: [7, "bandpass", 10, 3, , , , , [["triangle", 7, 2, 2, 8, 8]]],
            Notes: [69, 74, 69, 74, 69],
        },
    ],
    Exit: 31,
};
