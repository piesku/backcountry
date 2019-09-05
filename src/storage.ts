export function get_trophies() {
    let raw = localStorage.getItem("piesku:back");
    if (raw) {
        return raw.split(",").map(Number);
    } else {
        return [];
    }
}
export function save_trophy(seed: number) {
    let trophies = get_trophies();
    if (!trophies.includes(seed)) {
        trophies.push(seed);
        localStorage.setItem("piesku:back", (trophies as unknown) as string);
    }
}
