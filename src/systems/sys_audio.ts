import {play_note} from "../audio.js";
import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

export function sys_audio(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if (game.World[i] & (1 << Get.AudioSource)) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let audio_source = game[Get.AudioSource][entity];
    let can_exit = !audio_source.Current || audio_source.Time > audio_source.Current.Exit;

    if (audio_source.Trigger && can_exit) {
        for (let track of audio_source.Trigger.Tracks) {
            for (let i = 0; i < track.Notes.length; i++) {
                if (track.Notes[i]) {
                    // The duration of the note, 0.15 seconds, is calculated
                    // assuming BPM of 100. That's 60/100 seconds per beat,
                    // corresponding to a quarter note, divided by 4 to get an
                    // interval of a sixteenth note.
                    play_note(game.Audio, track.Instrument, track.Notes[i], i * 0.15);
                }
            }
        }
        audio_source.Current = audio_source.Trigger;
        audio_source.Time = 0;
    } else {
        audio_source.Time += delta;
    }

    // Audio triggers are only valid in the frame they're set; they don't stack
    // up. Otherwise sound effects would go out of sync with the game logic.
    // Reset the trigger to the default or undefined, regardless of whether it
    // triggered a new clip to play.
    audio_source.Trigger = audio_source.Idle;
}
