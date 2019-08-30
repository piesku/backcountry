let seed = 1;

export function set_seed(new_seed: number) {
    seed = new_seed;
}

function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
}

export function integer(min = 0, max = 1) {
    return Math.floor(rand() * (max - min + 1) + min);
}

export function float(min = 0, max = 1) {
    return rand() * (max - min) + min;
}

export function element(arr: Array<unknown>) {
    return arr[integer(0, arr.length - 1)];
}
