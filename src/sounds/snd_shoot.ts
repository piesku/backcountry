import {AudioClip} from "../components/com_audio_source";

export let snd_shoot = <AudioClip>{
    Tracks: [
        {
            Instrument: [
                13,
                "lowpass",
                10,
                4,
                false,
                false,
                13,
                1,
                [[false, 10, 0, 0, 5], ["sine", 7, 0, 2, 2, 8, false, false, 8, 8, 8]],
            ],
            Notes: [57],
        },
    ],
    Exit: 0.2,
};
