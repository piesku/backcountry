import {Animate} from "./com_animate";
import {AudioSource} from "./com_audio_source";
import {Camera} from "./com_camera";
import {Collide} from "./com_collide";
import {PlayerControl} from "./com_control_player";
import {Cull} from "./com_cull";
import {Draw} from "./com_draw";
import {EmitParticles} from "./com_emit_particles";
import {Health} from "./com_health";
import {Lifespan} from "./com_lifespan";
import {Light} from "./com_light";
import {Mimic} from "./com_mimic";
import {Move} from "./com_move";
import {Navigable} from "./com_navigable";
import {NPC} from "./com_npc.js";
import {Projectile} from "./com_projectile";
import {Render} from "./com_render";
import {Select} from "./com_select";
import {Shake} from "./com_shake";
import {Shoot} from "./com_shoot";
import {Transform} from "./com_transform";
import {Trigger} from "./com_trigger";
import {Walking} from "./com_walking";

export const enum Get {
    Transform,
    Render,
    Draw,
    Camera,
    Light,
    AudioSource,
    Animate,
    Move,
    Collide,
    Trigger,
    Navigable,
    Select,
    Shoot,
    PlayerControl,
    Health,
    Mimic,
    EmitParticles,
    Cull,
    Walking,
    NPC,
    Projectile,
    Shake,
    Lifespan,
}

export interface ComponentData {
    [Get.Transform]: Array<Transform>;
    [Get.Render]: Array<Render>;
    [Get.Draw]: Array<Draw>;
    [Get.Camera]: Array<Camera>;
    [Get.Light]: Array<Light>;
    [Get.AudioSource]: Array<AudioSource>;
    [Get.Animate]: Array<Animate>;
    [Get.Move]: Array<Move>;
    [Get.Collide]: Array<Collide>;
    [Get.Trigger]: Array<Trigger>;
    [Get.Navigable]: Array<Navigable>;
    [Get.Select]: Array<Select>;
    [Get.Shoot]: Array<Shoot>;
    [Get.PlayerControl]: Array<PlayerControl>;
    [Get.Health]: Array<Health>;
    [Get.Mimic]: Array<Mimic>;
    [Get.EmitParticles]: Array<EmitParticles>;
    [Get.Cull]: Array<Cull>;
    [Get.Walking]: Array<Walking>;
    [Get.NPC]: Array<NPC>;
    [Get.Projectile]: Array<Projectile>;
    [Get.Shake]: Array<Shake>;
    [Get.Lifespan]: Array<Lifespan>;
}

export const enum Has {
    Transform = 1 << Get.Transform,
    Render = 1 << Get.Render,
    Draw = 1 << Get.Draw,
    Camera = 1 << Get.Camera,
    Light = 1 << Get.Light,
    AudioSource = 1 << Get.AudioSource,
    Animate = 1 << Get.Animate,
    Move = 1 << Get.Move,
    Collide = 1 << Get.Collide,
    Trigger = 1 << Get.Trigger,
    Navigable = 1 << Get.Navigable,
    Select = 1 << Get.Select,
    Shoot = 1 << Get.Shoot,
    PlayerControl = 1 << Get.PlayerControl,
    Health = 1 << Get.Health,
    Mimic = 1 << Get.Mimic,
    EmitParticles = 1 << Get.EmitParticles,
    Cull = 1 << Get.Cull,
    Walking = 1 << Get.Walking,
    NPC = 1 << Get.NPC,
    Projectile = 1 << Get.Projectile,
    Shake = 1 << Get.Shake,
    Lifespan = 1 << Get.Lifespan,
}
