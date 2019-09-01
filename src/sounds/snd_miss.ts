import {AudioClip} from "../components/com_audio_source";

export let snd_miss = <AudioClip>{
    Tracks: [
        {
            Instrument: [
                11,
                true,
                "lowpass",
                12,
                5,
                false,
                false,
                "sine",
                13,
                4,
                [[1, 10, 0, 0, 5], [0, 7, 1, 1, 5, "triangle", 8, false, true, 2, 3, 11]],
            ],
            Notes: [57],
        },
    ],
    Exit: 0.2,
};
