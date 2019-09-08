export function widget_exclamation(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.font = "10vh Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText("!", x, y);
}
