export function widget_damage(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    [damage]: Array<unknown>
) {
    ctx.font = "5vh Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ff0";
    ctx.fillText((damage as number).toFixed(0), x, y);
}
