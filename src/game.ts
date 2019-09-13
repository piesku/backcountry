import {GameState, PlayerState} from "./actions.js";
import {Blueprint} from "./blueprints/blu_common.js";
import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {PlayerControl} from "./components/com_control_player.js";
import {Cull} from "./components/com_cull.js";
import {Draw} from "./components/com_draw.js";
import {EmitParticles} from "./components/com_emit_particles.js";
import {Health} from "./components/com_health.js";
import {ComponentData, Get} from "./components/com_index.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Mimic} from "./components/com_mimic.js";
import {Move} from "./components/com_move.js";
import {Navigable} from "./components/com_navigable.js";
import {NPC} from "./components/com_npc.js";
import {Projectile} from "./components/com_projectile.js";
import {Render} from "./components/com_render.js";
import {Select} from "./components/com_select.js";
import {Shake} from "./components/com_shake.js";
import {Shoot} from "./components/com_shoot.js";
import {transform, Transform} from "./components/com_transform.js";
import {Trigger} from "./components/com_trigger.js";
import {Walking} from "./components/com_walking.js";
import {Material} from "./materials/mat_common.js";
import {Mat} from "./materials/mat_index.js";
import {mat_instanced} from "./materials/mat_instanced.js";
import {mat_particles} from "./materials/mat_particles.js";
import {mat_wireframe} from "./materials/mat_wireframe.js";
import {Model} from "./model.js";
import {palette} from "./palette.js";
import {sys_ai} from "./systems/sys_ai.js";
import {sys_aim} from "./systems/sys_aim.js";
import {sys_animate} from "./systems/sys_animate.js";
import {sys_audio} from "./systems/sys_audio.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_projectile} from "./systems/sys_control_projectile.js";
import {sys_cull} from "./systems/sys_cull.js";
import {sys_debug} from "./systems/sys_debug.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_health} from "./systems/sys_health.js";
import {sys_lifespan} from "./systems/sys_lifespan.js";
import {sys_mimic} from "./systems/sys_mimic.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_navigate} from "./systems/sys_navigate.js";
import {sys_particles} from "./systems/sys_particles.js";
import {sys_performance} from "./systems/sys_performance.js";
import {sys_player_control} from "./systems/sys_player_control.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_select} from "./systems/sys_select.js";
import {sys_shake} from "./systems/sys_shake.js";
import {sys_shoot} from "./systems/sys_shoot.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_trigger} from "./systems/sys_trigger.js";
import {sys_ui} from "./systems/sys_ui.js";
import {GL_CULL_FACE, GL_DEPTH_TEST} from "./webgl.js";
import {world_intro} from "./worlds/wor_town.js";

const MAX_ENTITIES = 10000;

export type Entity = number;

export interface InputState {
    [k: string]: number;
    mx: number;
    my: number;
}

export class Game implements ComponentData, GameState {
    public World: Array<number>;
    public Grid: Array<Array<number>> = [];
    public [Get.Transform]: Array<Transform> = [];
    public [Get.Render]: Array<Render> = [];
    public [Get.Draw]: Array<Draw> = [];
    public [Get.Camera]: Array<Camera> = [];
    public [Get.Light]: Array<Light> = [];
    public [Get.AudioSource]: Array<AudioSource> = [];
    public [Get.Animate]: Array<Animate> = [];
    public [Get.Move]: Array<Move> = [];
    public [Get.Collide]: Array<Collide> = [];
    public [Get.Trigger]: Array<Trigger> = [];
    public [Get.Navigable]: Array<Navigable> = [];
    public [Get.Select]: Array<Select> = [];
    public [Get.Shoot]: Array<Shoot> = [];
    public [Get.PlayerControl]: Array<PlayerControl> = [];
    public [Get.Health]: Array<Health> = [];
    public [Get.Mimic]: Array<Mimic> = [];
    public [Get.EmitParticles]: Array<EmitParticles> = [];
    public [Get.Cull]: Array<Cull> = [];
    public [Get.Walking]: Array<Walking> = [];
    public [Get.NPC]: Array<NPC> = [];
    public [Get.Projectile]: Array<Projectile> = [];
    public [Get.Shake]: Array<Shake> = [];
    public [Get.Lifespan]: Array<Lifespan> = [];

    public Canvas3: HTMLCanvasElement;
    public Canvas2: HTMLCanvasElement;
    public GL: WebGL2RenderingContext;
    public Context: CanvasRenderingContext2D;
    public Audio: AudioContext = new AudioContext();
    public UI: HTMLElement = document.querySelector("main")!;

    public Input: InputState = {
        mx: 0,
        my: 0,
    };

    public WorldFunc = world_intro;
    // Today's timestamp. Changes every midnight, 00:00 UTC.
    public ChallengeSeed = ~~(Date.now() / (24 * 60 * 60 * 1000));
    public PlayerSeed = this.ChallengeSeed;
    public ChallengeLevel = 1;
    public BountySeed = 0;
    public BountyCollected = 0;
    public PlayerState = PlayerState.Playing;
    public PlayerXY?: {X: number; Y: number};
    public Gold = 0;
    public MonetizationEnabled = false;

    public Materials: Array<Material> = [];
    public Camera?: Camera;
    public Player?: Entity;
    public Models: Array<Model> = [];
    public Palette: Array<number> = palette;
    private RAF: number = 0;

    constructor() {
        this.World = [];

        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.Stop() : this.Start()
        );

        this.Canvas3 = document.querySelector("canvas")! as HTMLCanvasElement;
        this.Canvas2 = document.querySelector("canvas + canvas")! as HTMLCanvasElement;
        this.Canvas3.width = this.Canvas2.width = window.innerWidth;
        this.Canvas3.height = this.Canvas2.height = window.innerHeight;

        this.GL = this.Canvas3.getContext("webgl2")!;
        this.Context = this.Canvas2.getContext("2d")!;

        for (let name in this.GL) {
            // @ts-ignore
            if (typeof this.GL[name] == "function") {
                // @ts-ignore
                this.GL[name.match(/^..|[A-Z]|([1-9].*)/g).join("")] = this.GL[name];
            }
        }

        this.UI.addEventListener("contextmenu", evt => evt.preventDefault());
        this.UI.addEventListener("mousedown", evt => {
            this.Input[`d${evt.button}`] = 1;
        });
        this.UI.addEventListener("mousemove", evt => {
            this.Input.mx = evt.offsetX;
            this.Input.my = evt.offsetY;
        });

        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);

        this.Materials[Mat.Wireframe] = mat_wireframe(this.GL);
        this.Materials[Mat.Instanced] = mat_instanced(this.GL);
        this.Materials[Mat.Particles] = mat_particles(this.GL);
    }

    CreateEntity(mask = 0) {
        for (let i = 0; i < MAX_ENTITIES; i++) {
            if (!this.World[i]) {
                this.World[i] = mask;
                return i;
            }
        }
        throw new Error("No more entities available.");
    }

    Update(delta: number) {
        let cpu = performance.now();
        sys_lifespan(this, delta);
        // Player input and AI.
        sys_select(this, delta);
        sys_player_control(this, delta);
        sys_ai(this, delta);
        sys_control_projectile(this, delta);
        // Game logic.
        sys_navigate(this, delta);
        sys_aim(this, delta);
        sys_particles(this, delta);
        sys_shake(this, delta);
        // Animation and movement.
        sys_animate(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        // Post-transform logic.
        sys_collide(this, delta);
        sys_trigger(this, delta);
        sys_shoot(this, delta);
        sys_health(this, delta);
        sys_mimic(this, delta);
        sys_cull(this, delta);
        sys_audio(this, delta);
        sys_camera(this, delta);

        // CPU Performance.
        sys_performance(this, performance.now() - cpu, document.querySelector("#cpu"));

        // Debug.
        false && sys_debug(this, delta);

        let gpu = performance.now();
        sys_render(this, delta);
        sys_draw(this, delta);
        sys_ui(this, delta);

        // GPU Performance.
        sys_performance(this, performance.now() - gpu, document.querySelector("#gpu"));
        sys_framerate(this, delta);

        this.Input.d0 = 0;
        this.Input.d2 = 0;
    }

    Start() {
        let last = performance.now();
        let tick = (now: number) => {
            let delta = (now - last) / 1000;
            this.Update(delta);
            last = now;
            this.RAF = requestAnimationFrame(tick);
        };

        this.Stop();
        this.Audio.resume();
        tick(last);
    }

    Stop() {
        this.Audio.suspend();
        cancelAnimationFrame(this.RAF);
    }

    Add({Translation, Rotation, Scale, Using = [], Children = []}: Blueprint) {
        let entity = this.CreateEntity(Get.Transform);
        transform(Translation, Rotation, Scale)(this, entity);
        for (let mixin of Using) {
            mixin(this, entity);
        }
        let entity_transform = this[Get.Transform][entity];
        for (let subtree of Children) {
            let child = this.Add(subtree);
            let child_transform = this[Get.Transform][child];
            child_transform.Parent = entity_transform;
            entity_transform.Children.push(child_transform);
        }
        return entity;
    }

    Destroy(entity: Entity) {
        let mask = this.World[entity];
        if (mask & (1 << Get.Transform)) {
            for (let child of this[Get.Transform][entity].Children) {
                this.Destroy(child.EntityId);
            }
        }
        this.World[entity] = 0;
    }
}
