import {AudioClip} from "../components/com_audio_source";

export let snd_shoot = <AudioClip>{
    tracks: [
        {
            instrument: [
                13,
                true,
                "lowpass",
                10,
                4,
                false,
                false,
                "sine",
                13,
                1,
                [[1, 10, 0, 0, 5], [0, 7, 0, 2, 2, "sine", 8, false, false, 8, 8, 8]],
            ],
            notes: [57],
        },
    ],
    exit: 0.2,
};
