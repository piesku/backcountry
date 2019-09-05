export function set_item(key: string, value: any) {
    localStorage.setItem("com.piesku.back." + key, JSON.stringify(value));
}

export function get_item<T>(key: string) {
    let value = localStorage.getItem("com.piesku.back." + key);
    if (value) {
        return JSON.parse(value) as T;
    }
}
