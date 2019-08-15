export interface Model {
    offsets: Float32Array;
    size: [number, number, number];
    palette?: Array<number>;
}

export async function load(path: string): Promise<Array<Model>> {
    let response = await fetch(path);
    let buffer = await response.arrayBuffer();
    let buffer_array = new Uint16Array(buffer);
    let model_data = [];
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

        let size = model.splice(0, 3).map(i => ++i) as [number, number, number];
        model.shift();

        model_data.push({
            offsets: new Float32Array(model).map((val, idx) => {
                switch (idx % 4) {
                    case 0:
                        return val - size[0] / 2 + 0.5;
                    case 1:
                        return val - size[1] / 2 + 0.5;
                    case 2:
                        return val - size[2] / 2 + 0.5;
                    default:
                        return val;
                }
            }),
            size,
        });
    }

    return model_data;
}
