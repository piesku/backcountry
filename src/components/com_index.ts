import {Animate} from "./com_animate";
import {AudioSource} from "./com_audio_source";
import {Camera} from "./com_camera";
import {Collide} from "./com_collide";
import {ClickControl} from "./com_control_click";
import {FlyControl} from "./com_control_fly";
import {PlayerControl} from "./com_control_player";
import {Light} from "./com_light";
import {Move} from "./com_move";
import {Named} from "./com_named";
import {Navigable} from "./com_navigable";
import {RayCast} from "./com_ray_cast";
import {RayTarget} from "./com_ray_target";
import {Render} from "./com_render";
import {RigidBody} from "./com_rigid_body";
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
    ClickControl,
    FlyControl,
    Move,
    Collide,
    RigidBody,
    Trigger,
    RayTarget,
    Navigable,
    RayCast,
    Shoot,
    PlayerControl,
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
    [Get.ClickControl]: Array<ClickControl>;
    [Get.FlyControl]: Array<FlyControl>;
    [Get.Collide]: Array<Collide>;
    [Get.RigidBody]: Array<RigidBody>;
    [Get.Trigger]: Array<Trigger>;
    [Get.RayTarget]: Array<RayTarget>;
    [Get.Navigable]: Array<Navigable>;
    [Get.RayCast]: Array<RayCast>;
    [Get.Shoot]: Array<Shoot>;
    [Get.PlayerControl]: Array<PlayerControl>;
}
