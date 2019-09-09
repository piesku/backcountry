import {AudioClip} from "../components/com_audio_source";

export let snd_click = <AudioClip>{
    Tracks: [
        {
            Instrument: [
                7,
                "lowpass",
                8,
                8,
                false,
                false,
                8,
                8,
                [["sine", 4, 1, 0, 3, 8, false, false, 7, 7, 7]],
            ],
            Notes: [69],
        },
    ],
    Exit: 0.2,
};
