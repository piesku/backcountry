import {Action} from "../actions.js";

export function Store() {
    let enabled =
        (document as any).monetization && (document as any).monetization.state == "started";
    return `
        <div style="
            width: 66%;
            margin: 5vh auto;
            text-align: center;
            color: #222;
        ">
            GENERAL STORE
        </div>

        <div onclick="$(${Action.ChangePlayerSeed});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 15%;
            left: 10%;
            ${enabled ? "" : "pointer-events: none;"}
        ">
            Change Outfit
            ${
                enabled
                    ? ""
                    : '<div style="font: italic 5vmin serif;">(Available only to paid subscribers.)</div>'
            }
        </div>

        <div onclick="$(${Action.GoToTown});" style="
            font: italic bold small-caps 7vmin serif;
            position: absolute;
            bottom: 5%;
            right: 10%;
        ">
            Exit to Town
        </div>
    `;
}
