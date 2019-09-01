import minify from "rollup-plugin-babel-minify";

export default {
    input: "./public/js/index.js",
    output: {
        file: "public/opt/game.min.js",
        format: "iife",
        name: "backcountry",
    },
    plugins: [minify({comments: false})],
};
