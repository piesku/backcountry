import {Action} from "../actions.js";
import {html} from "./html.js";
import {Overlay} from "./Overlay.js";

export function Intro() {
    return html`
        ${Overlay()}
        <div
            style="
                position: absolute;
                left: 50%;
                display: flex;
                height: 100%;
            "
        >
            <div
                style="
                    margin: auto 0;
                    color: #FFE8C6;
                    font: 15vh Impact;
                "
            >
                BACK<br />COUNTRY
                <hr style="border: solid #D45230 10px;" />
                <button
                    onclick="game.dispatch(${Action.ChangeWorld}, 'mine');"
                    style="color: #FFE8C6;"
                >
                    PLAY
                </button>
            </div>
        </div>
    `;
}
