const vox = require("./vox");
const parser = new vox.Parser();
const fs = require("fs");
const path = require("path");
const each = require("async-each");

const models_dir = path.join(__dirname, "models");
const models_map = [];
let current_model_index = 0;
let files = fs.readdirSync(models_dir);
files = files.filter(el => {
    return path.extname(el) === ".vox" && !el.endsWith("ignore");
});

const final_palette = [];
const color_map = {};
let models_output = [];
let map_elements_indexes = new Set();
each(
    files,
    (file, next) => {
        const model_data = {
            size: {},
            cubes: [],
        };

        parser
            .parse(path.join("models", file))
            .then(result => {
                model_data.size = [result.size.x - 1, result.size.z - 1, result.size.y - 1];
                const palette = result.palette.map(color => {
                    return [
                        (color.r / 255).toFixed(2),
                        (color.g / 255).toFixed(2),
                        (color.b / 255).toFixed(2),
                    ];
                });

                if (final_palette.length === 0) {
                    // Colors that can be modified (indexes 0-5)
                    for (let i = 0; i <= 6; i++) {
                        final_palette.push(palette[i]);
                        color_map[i] = i - 1;
                    }

                    console.log({color_map});
                }

                result.voxels.forEach((curr, idx) => {
                    let color;
                    if (file.includes("map")) {
                        map_elements_indexes.add(curr.colorIndex - 1);
                        // console.log(`Map element found: ${254 - curr.colorIndex}`);
                        color = curr.colorIndex - 1;
                    } else {
                        if (typeof color_map[curr.colorIndex] !== "undefined") {
                        } else {
                            color_map[curr.colorIndex] =
                                final_palette.push(palette[curr.colorIndex]) - 1;
                            console.log(
                                `No color ${
                                    palette[curr.colorIndex]
                                } found (voxel ${idx} in model ${path
                                    .basename(file, ".vox")
                                    .toUpperCase()}). Next color index: ${
                                    color_map[curr.colorIndex]
                                }`
                            );
                        }

                        color = color_map[curr.colorIndex];
                    }

                    const cube = [curr.x, curr.z, curr.y, color];

                    model_data.cubes.push(cube);
                });

                model_data.cubes = model_data.cubes.filter(cube => {
                    return !(
                        find_cube(model_data.cubes, [cube[0] + 1, cube[1], cube[2]]) &&
                        find_cube(model_data.cubes, [cube[0] - 1, cube[1], cube[2]]) &&
                        find_cube(model_data.cubes, [cube[0], cube[1] + 1, cube[2]]) &&
                        find_cube(model_data.cubes, [cube[0], cube[1] - 1, cube[2]]) &&
                        find_cube(model_data.cubes, [cube[0], cube[1], cube[2] + 1]) &&
                        find_cube(model_data.cubes, [cube[0], cube[1], cube[2] - 1])
                    );
                });

                console.log(`Model size: ${model_data.size}`);

                console.log(`Model ${file} saved. Cube count: ${model_data.cubes.length}.`);

                model_data.name = `${path.basename(file, ".vox").toUpperCase()}`;

                models_output.push(model_data);

                next();
            })
            .catch(e => {
                console.log(`Parses throws on file ${file}:`, e);
            });
    },
    () => {
        console.log({color_map});
        console.log(`Map elements count: ${map_elements_indexes.size}`);
        console.log(`Colors count: ${final_palette.length}`);
        console.log("Saving palette");
        fs.writeFileSync("./src/palette.ts", `export let palette = [${final_palette}];`);

        console.log("Saving models map");
        fs.writeFileSync(
            "./src/models_map.ts",
            `export const Models = {\n    ${models_output.map(print_model).join("\n")}\n}`
        );

        console.log(`Saving models file: ${models_output.length * 2}b`);
        const final_result = new Uint16Array(models_output);
        const final_buffer = new Uint8Array(final_result.buffer);
        fs.writeFileSync(path.join("./public", "models.tfu"), final_buffer);
    }
);

function print_model(model_data) {
    return `    ${model_data.name}: {
        Offsets: [${model_data.cubes.map(c => c.join(", ")).join(", ")}],
        Size: [${model_data.size.join(", ")}],
    },`;
}

function find_cube(collection, cords) {
    return collection.some(cube => {
        return cube[0] === cords[0] && cube[1] === cords[1] && cube[2] === cords[2];
    });
}
