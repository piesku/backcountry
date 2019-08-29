import {Animate} from "./com_animate";
import {AudioSource} from "./com_audio_source";
import {Camera} from "./com_camera";
import {Collide} from "./com_collide";
import {PlayerControl} from "./com_control_player";
import {Cull} from "./com_cull";
import {EmitParticles} from "./com_emit_particles";
import {Health} from "./com_health";
import {Light} from "./com_light";
import {Mimic} from "./com_mimic";
import {Move} from "./com_move";
import {Named} from "./com_named";
import {Navigable} from "./com_navigable";
import {PathFind} from "./com_path_find";
import {RayTarget} from "./com_ray_target";
import {Render} from "./com_render";
import {Select} from "./com_select";
import {Shoot} from "./com_shoot";
import {Transform} from "./com_transform";
import {Trigger} from "./com_trigger";

export const enum Get {
    Transform,
    Render,
    Camera,
    Light,
    AudioSource,
    Animate,
    Named,
    PathFind,
    Move,
    Collide,
    Trigger,
    RayTarget,
    Navigable,
    Select,
    Shoot,
    PlayerControl,
    Health,
    Mimic,
    EmitParticles,
    Cull,
}

export interface ComponentData {
    [Get.Transform]: Array<Transform>;
    [Get.Render]: Array<Render>;
    [Get.Camera]: Array<Camera>;
    [Get.Light]: Array<Light>;
    [Get.AudioSource]: Array<AudioSource>;
    [Get.Animate]: Array<Animate>;
    [Get.Named]: Array<Named>;
    [Get.Move]: Array<Move>;
    [Get.PathFind]: Array<PathFind>;
    [Get.Collide]: Array<Collide>;
    [Get.Trigger]: Array<Trigger>;
    [Get.RayTarget]: Array<RayTarget>;
    [Get.Navigable]: Array<Navigable>;
    [Get.Select]: Array<Select>;
    [Get.Shoot]: Array<Shoot>;
    [Get.PlayerControl]: Array<PlayerControl>;
    [Get.Health]: Array<Health>;
    [Get.Mimic]: Array<Mimic>;
    [Get.EmitParticles]: Array<EmitParticles>;
    [Get.Cull]: Array<Cull>;
}
