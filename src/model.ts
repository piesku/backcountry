export interface Model {
    Offsets: Float32Array;
    Size: [number, number, number];
    Palette?: Array<number>;
}

export async function load(path: string): Promise<Array<Model>> {
    let response = await fetch(path);
    let buffer = await response.arrayBuffer();
    let buffer_array = new Uint16Array(buffer);
    let model_data: Array<Model> = [];
    let i = 0;

    while (i < buffer_array.length) {
        let model_start = i + 1;
        let model_length = buffer_array[i];
        let model_end = model_start + model_length + 1; // '1' is for size
        let model = [];

        for (i = model_start; i < model_end; i++) {
            let voxel = buffer_array[i];
            model.push(
                (voxel & 15) >> 0,
                (voxel & 240) >> 4,
                (voxel & 3840) >> 8,
                (voxel & 61440) >> 12
            );
        }

        let Size = model.splice(0, 3).map(i => ++i) as [number, number, number];
        model.shift();

        model_data.push({
            Offsets: new Float32Array(model).map((val, idx) => {
                switch (idx % 4) {
                    case 0:
                        return val - Size[0] / 2 + 0.5;
                    case 1:
                        return val - Size[1] / 2 + 0.5;
                    case 2:
                        return val - Size[2] / 2 + 0.5;
                    default:
                        return val;
                }
            }),
            Size,
        });
    }

    return model_data;
}
