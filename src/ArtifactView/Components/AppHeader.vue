<script>
import { sleep } from '../utils'
import { close, devtools, createArtifactSwitch } from '../ipc'
import { status, STATUS } from '../status'
export default {
    emits: ['clickprocess'],
    data() {
        return {
            STATUS,
            clickTimes: 0,
            noTooltip: false,
        }
    },
    computed: {
        runtimeDebug() {
            return status.runtimeDebug
        },
        auto() {
            return status.auto
        },
        status() {
            return status.status
        },
    },
    methods: {
        close,
        clickDebug() {
            if (status.runtimeDebug) {
                status.runtimeDebug = false
            } else {
                this.clickTimes++
                if (this.clickTimes >= 5) {
                    this.clickTimes = 0
                    status.runtimeDebug = true
                }
            }
        },
        ctxDebug() {
            if (status.runtimeDebug) {
                devtools()
            }
        },
        clickSwitcher() {
            createArtifactSwitch()
        },
        async enableAuto() {
            console.log('click auto button')
            if (status.auto) {
                status.auto = false
            } else {
                await sleep(100)
                status.auto = true
            }
        },
    },
}
</script>
<template>
    <header>
        <div class="icon"></div>
        <div class="title">{{ __('圣遗物') }} - {{ __(`单击识别${auto ? '启用' : '禁用'}`) }}</div>
        <div class="actions">
            <button class="dump" :class="{ show: runtimeDebug }" @click="clickDebug" @contextmenu="ctxDebug">
                <i class="el-icon-s-opportunity"></i>
            </button>
            <el-tooltip
                class="item"
                effect="light"
                :content="__('打开自动切换器')"
                placement="bottom"
                popper-class="titlebar-tip"
                transition="none"
                :enterable="false"
                :hide-after="0"
                :disabled="status === STATUS.LOADING"
            >
                <button class="store" @click="clickSwitcher">
                    <i class="el-icon-guide"></i>
                </button>
            </el-tooltip>
            <template v-if="status > STATUS.INTRO">
                <el-tooltip
                    class="item"
                    effect="light"
                    :content="__('识别')"
                    placement="bottom"
                    popper-class="titlebar-tip"
                    transition="none"
                    :enterable="false"
                    :hide-after="0"
                    :disabled="status === STATUS.LOADING || noTooltip"
                >
                    <button
                        class="store"
                        @mousedown="noTooltip = true"
                        @mouseout="noTooltip = false"
                        @click="$emit('clickprocess') && (noTooltip = false)"
                    >
                        <i class="el-icon-aim"></i>
                    </button>
                </el-tooltip>

                <el-tooltip
                    class="item"
                    effect="light"
                    :content="__(`${auto ? '关闭' : '开启'}单击识别`)"
                    placement="bottom"
                    popper-class="titlebar-tip"
                    transition="none"
                    :enterable="false"
                    :hide-after="0"
                    :disabled="status === STATUS.LOADING"
                >
                    <button class="store" @click="enableAuto">
                        <i class="el-icon-magic-stick"></i>
                    </button>
                </el-tooltip>
            </template>
            <button class="close" @click="close">
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
    -webkit-app-region: drag;
    user-select: none;

    .icon {
        display: inline-block;
        width: 30px;
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

@media only screen and (-webkit-min-device-pixel-ratio: 1.5) {
    header .actions button {
        width: 20px;
        padding: 0;
        padding-top: 2px;
        font-size: 14px;
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
