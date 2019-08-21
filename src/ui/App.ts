import {html} from "./html.js";
import {Intro} from "./Intro.js";
import {Overlay} from "./Overlay.js";
import {UIState} from "./state.js";

export function App(state: UIState) {
    return html`
        <div
            style="
                position: absolute;
                top: 0;
                background-color: #000;
                color: #fff;
            "
        >
            ${state.world === "intro" && Intro()} ${state.world === "stage" && Overlay()}
        </div>
    `;
}
