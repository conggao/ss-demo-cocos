export const DynamicResourceDefine = {

    directory: ["effect", "audio", "actor", "ui"],

    Actor: {
        Path: "prefab/actor",
        Player: {
            User: "prefab/actor/Player"
        },
        Enemy: {
            Path: "actor/prefab/enemy",
        }
    },

    ui: {
        player: {
            Path: "prefab/",
            User: "prefab/user"
        }

    },

    Effect: {
        Path: "effect/prefab/",
        EffExplore: "effect/prefab/EffExplore",
        EffDie: "effect/prefab/EffDie",
    },

    audio: {
        Bgm: "audio/prefab/Bgm",
        SfxHit: "audio/prefab/SfxHit",
        SfxShoot: "audio/prefab/SfxShoot",
    },
}
