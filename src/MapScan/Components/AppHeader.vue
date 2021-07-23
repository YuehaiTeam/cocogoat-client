<script>
import { devtools } from '../ipc'
import { bus } from '../bus'
export default {
    emits: ['auto'],
    data() {
        return {
            clickTimes: 0,
        }
    },
    computed: {
        runtimeDebug() {
            return bus.runtimeDebug
        },
        ready() {
            return bus.ready
        },
        auto() {
            return bus.auto
        },
    },
    methods: {
        close() {
            window.close()
        },
        clickDebug() {
            if (bus.runtimeDebug) {
                bus.runtimeDebug = false
            } else {
                this.clickTimes++
                if (this.clickTimes >= 5) {
                    this.clickTimes = 0
                    bus.runtimeDebug = true
                }
            }
        },
        ctxDebug() {
            if (bus.runtimeDebug) {
                devtools()
            }
        },
    },
}
</script>
<template>
    <header>
        <div class="icon"></div>
        <div class="title">{{ ready ? (auto ? '同步中' : '小地图') : '初始化' }}{{ runtimeDebug ? 'D' : '' }}</div>
        <div class="actions">
            <button class="auto" @contextmenu="clickDebug" @click="$emit('auto')">
                <i class="el-icon-view"></i>
            </button>
            <button class="close" @click="close" @contextmenu="ctxDebug">
                <i class="el-icon-close"></i>
            </button>
        </div>
    </header>
    <div class="borders">
        <div class="l"></div>
        <div class="r"></div>
        <div class="b"></div>
    </div>
</template>

<style lang="scss" scoped>
header {
    * {
        box-sizing: border-box;
    }
    height: 30px;
    background: #007acc;
    color: #fff;
    line-height: 28px;
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    -webkit-app-region: drag;
    user-select: none;

    .icon {
        display: inline-block;
        width: 10px;
        vertical-align: top;
    }

    .title {
        display: inline-block;
        vertical-align: top;
        height: 30px;
        line-height: 32px;
    }

    .actions {
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        -webkit-app-region: no-drag;

        button {
            color: #fff;
            width: 30px;
            height: 30px;
            -webkit-appearance: none;
            border: 0;
            background: transparent;
            display: inline-block;
            vertical-align: top;
            cursor: pointer;
            outline: 0;
            font-size: 16px;
            line-height: 31px;
            vertical-align: middle;

            &:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            &.dump {
                opacity: 0;
                cursor: default;
                &.show {
                    opacity: 1;
                    cursor: pointer;
                }
            }
        }
    }
}
.borders {
    & > div {
        position: absolute;
        z-index: 9999;
        border: 1px solid #007acc;
        -webkit-app-region: drag;
    }

    .l {
        top: 30px;
        left: 0;
        bottom: 0;
    }

    .r {
        top: 30px;
        bottom: 0;
        right: 0;
    }

    .b {
        bottom: 0;
        left: 0;
        right: 0;
    }
}
</style>
<style>
.titlebar-tip {
    color: #007acc;
    padding: 5px 10px;
    padding-top: 7px;
}
</style>
