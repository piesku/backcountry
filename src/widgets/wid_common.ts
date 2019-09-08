export type Widget = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    args: Array<unknown>
) => void;
