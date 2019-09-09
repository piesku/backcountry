import minify from "rollup-plugin-babel-minify";

export default {
    input: "./public/js/index.js",
    output: {
        file: "public/opt/game.min.js",
        format: "iife",
    },
    plugins: [minify({comments: false})],
};
