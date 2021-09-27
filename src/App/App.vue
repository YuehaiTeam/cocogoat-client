<script>
import { bus } from './bus'
import { ipcRenderer } from 'electron'
import FirstrunDialog from './Views/FirstrunDialog'
export default {
    components: {
        FirstrunDialog,
    },
    computed: {
        bus() {
            return bus
        },
    },
    created() {
        ipcRenderer.send('ready')
    },
    methods: {
        async hendleAction(ev, ipc) {
            ipcRenderer.send(ipc)
        },
    },
}
</script>
<template>
    <header>
        <div ref="logo" class="logo">
            <svg viewBox="0 0 204 204" class="cocogoat">
                <g>
                    <path
                        d=" M 92.79 59.13 C 94.98 55.32 98.53 52.56 101.92 49.88 C 105.14 52.74 108.92 55.30 111.02 59.15 C 110.63 62.49 107.80 65.92 104.21 65.83 C 101.15 65.86 97.27 66.68 95.10 63.91 C 93.97 62.56 92.73 60.98 92.79 59.13 Z"
                    />
                    <path
                        d=" M 82.38 54.26 C 82.72 54.23 83.41 54.17 83.76 54.14 C 86.77 57.18 89.10 60.84 92.29 63.72 C 93.95 65.58 96.89 67.68 95.57 70.52 C 93.68 75.27 90.04 79.03 87.26 83.27 C 85.94 84.91 84.25 87.99 81.72 86.52 C 79.39 83.07 77.68 79.20 75.02 75.95 C 73.64 73.84 70.87 71.42 72.69 68.75 C 75.49 63.69 78.35 58.47 82.38 54.26 Z"
                    />
                    <path
                        d=" M 119.11 54.95 C 120.87 52.96 122.79 55.72 123.89 57.04 C 126.97 61.41 130.22 65.85 132.00 70.92 C 128.93 76.45 124.76 81.37 121.83 87.03 C 121.20 86.96 119.95 86.83 119.33 86.77 C 116.16 82.55 113.06 78.28 110.00 73.99 C 108.50 71.78 106.78 68.39 109.16 66.15 C 112.65 62.58 116.01 58.89 119.11 54.95 Z"
                    />
                    <path
                        d=" M 51.82 63.56 C 58.70 63.02 64.12 67.97 68.08 72.99 C 72.28 77.62 75.21 83.19 78.32 88.57 C 80.70 92.48 79.50 97.42 81.68 101.44 C 84.44 88.13 95.06 78.87 101.41 67.39 C 103.21 69.06 104.59 71.10 105.93 73.15 C 111.83 81.55 119.56 89.46 121.42 99.94 C 121.88 99.79 122.79 99.50 123.25 99.35 C 123.62 95.93 123.59 92.31 125.30 89.22 C 129.75 80.82 134.83 72.41 142.47 66.52 C 145.21 64.40 148.62 63.50 152.06 63.57 C 150.18 68.18 148.61 72.98 148.91 78.04 C 148.87 91.80 143.22 105.66 132.73 114.74 C 129.22 118.10 124.49 120.51 122.54 125.21 C 127.83 124.55 132.04 121.10 136.38 118.32 C 145.39 112.57 154.03 106.14 161.79 98.78 C 167.77 93.07 171.20 85.51 174.16 77.96 C 176.45 77.74 177.07 80.44 178.09 81.97 C 181.72 88.26 181.50 95.83 180.67 102.81 C 179.03 109.41 175.27 115.68 169.55 119.51 C 161.87 124.32 153.00 127.10 143.98 127.83 C 140.96 128.00 137.94 128.52 135.19 129.85 C 136.01 134.37 136.26 139.44 133.24 143.26 C 129.03 150.23 118.48 151.96 112.25 146.74 C 108.03 143.08 106.71 137.40 103.80 132.82 C 102.28 133.14 100.11 132.48 99.28 134.22 C 96.79 138.38 95.66 143.53 91.73 146.71 C 87.38 150.49 80.82 150.55 75.80 148.14 C 72.69 146.31 70.33 143.26 68.96 139.95 C 67.64 136.66 68.75 133.04 68.04 129.67 C 65.75 128.01 62.69 128.23 60.02 127.83 C 51.21 127.21 42.64 124.39 35.05 119.91 C 28.95 116.19 24.96 109.66 23.29 102.82 C 22.58 95.83 22.21 88.24 25.83 81.92 C 26.84 80.41 27.51 77.79 29.76 77.99 C 31.70 81.87 32.72 86.19 35.15 89.83 C 41.41 100.09 51.57 106.93 61.00 113.98 C 67.60 117.93 73.49 123.71 81.26 125.19 C 79.42 120.47 74.79 118.01 71.24 114.75 C 60.50 105.43 54.82 91.11 55.06 76.99 C 55.35 72.26 53.43 67.89 51.82 63.56 M 72.72 129.22 C 72.52 135.00 78.56 138.93 83.85 138.62 C 87.70 138.20 90.56 135.35 93.11 132.70 C 87.27 128.33 79.61 128.62 72.72 129.22 M 110.90 132.29 C 112.59 134.55 114.51 136.81 117.21 137.86 C 123.13 140.54 131.06 135.91 131.17 129.27 C 124.29 128.39 117.05 128.76 110.90 132.29 Z"
                    />
                </g>
            </svg>
        </div>
        <div id="app-title" class="app-title"></div>
        <div id="app-actions" class="app-actions"></div>
        <div class="actions">
            <button @click="hendleAction($event, 'minimizeApp')"><i class="el-icon-minus"></i></button>
            <button @click="hendleAction($event, 'maximizeApp')"><i class="el-icon-copy-document"></i></button>
            <button @click="hendleAction($event, 'exit')"><i class="el-icon-close"></i></button>
        </div>
    </header>
    <aside>
        <div class="nav">
            <router-link :to="{ name: 'Artifacts' }">
                <svg class="svg-artifact" viewBox="0 0 73 60">
                    <path
                        d=" M 31.95 14.93 C 33.41 13.02 35.14 11.36 37.01 9.85 C 38.85 11.35 40.55 13.01 42.00 14.89 C 41.44 16.04 40.89 17.20 40.34 18.36 C 42.72 19.25 45.24 20.06 47.16 21.80 C 51.10 25.01 51.87 30.33 54.40 34.49 C 52.47 36.08 51.45 38.35 50.44 40.56 C 48.45 44.80 43.89 48.30 39.01 47.22 C 40.07 47.74 41.13 48.25 42.21 48.73 C 39.73 51.29 38.88 55.07 37.00 57.79 C 35.13 55.05 34.28 51.29 31.79 48.73 C 32.87 48.24 33.93 47.73 34.99 47.22 C 29.47 48.36 24.92 43.60 23.10 38.86 C 22.50 36.95 21.00 35.63 19.40 34.55 C 21.43 31.40 22.87 27.93 24.65 24.64 C 26.52 21.26 30.23 19.74 33.64 18.41 C 33.06 17.26 32.52 16.08 31.95 14.93 M 34.13 29.17 C 32.34 31.40 29.42 32.10 27.09 33.60 C 29.39 34.67 31.93 35.43 33.84 37.15 C 35.40 38.87 36.02 41.18 37.00 43.24 C 38.03 41.21 38.77 38.98 40.23 37.21 C 42.21 35.49 44.81 34.76 46.98 33.32 C 44.52 32.16 41.57 31.43 39.96 29.05 C 38.64 27.11 37.95 24.84 36.99 22.72 C 36.07 24.88 35.48 27.22 34.13 29.17 Z"
                    />
                </svg>

                <span class="txt">{{ __('圣遗物') }}</span>
            </router-link>
            <router-link :to="{ name: 'MonaFrame' }">
                <svg viewBox="0 0 1024 1024" class="svg-mona">
                    <path
                        d="M512 85.333333C323.861333 85.333333 170.666667 238.528 170.666667 426.666667c0 99.008 43.413333 187.136 110.997333 249.450666a32 32 0 0 0-4.288 10.24L192.682667 874.666667H181.333333a32 32 0 1 0 0 64h26.922667a32 32 0 0 0 9.813333 0h598.634667a32 32 0 0 0 9.813333 0h16.149334a32 32 0 1 0 0-64h-1.578667l-95.466667-190.954667a32 32 0 0 0-3.498666-7.424C809.813333 613.973333 853.333333 525.781333 853.333333 426.666667c0-188.138667-153.194667-341.333333-341.333333-341.333334z m0 64c153.536 0 277.333333 123.797333 277.333333 277.333334 0 99.626667-52.949333 185.706667-131.584 234.666666H366.250667C287.616 612.373333 234.666667 526.293333 234.666667 426.666667c0-153.536 123.797333-277.333333 277.333333-277.333334z m-117.824 106.218667A32 32 0 0 0 362.666667 288v10.666667h-10.666667a32 32 0 1 0 0 64h10.666667v10.666666a32 32 0 1 0 64 0V362.666667h10.666666a32 32 0 1 0 0-64H426.666667v-10.666667a32 32 0 0 0-32.490667-32.448z m213.333333 149.333333A32 32 0 0 0 576 437.333333V469.333333h-32a32 32 0 1 0 0 64H576v32a32 32 0 1 0 64 0V533.333333h32a32 32 0 1 0 0-64H640v-32a32 32 0 0 0-32.490667-32.448zM330.026667 725.333333h22.4a32 32 0 0 0 7.04 0h304.341333a32 32 0 0 0 7.466667 0h23.573333l74.666667 149.333334H262.784l67.264-149.333334z"
                    ></path>
                </svg>
                <span class="txt">{{ __('占卜铺') }}</span>
            </router-link>
            <router-link :to="{ name: 'Map' }">
                <svg class="svg-map" viewBox="0 0 1024 1024">
                    <path
                        d="M405.333333 555.392V821.12l213.333334 60.970667V555.392l-77.397334 72.981333a42.666667 42.666667 0 0 1-58.538666 0L405.333333 555.392z m357.333334-200.597333A259.114667 259.114667 0 0 1 704 473.472v407.424l192-59.093333V313.792l-133.333333 41.024z m-504.853334-21.888L128 372.842667v508.053333l192-59.093333V473.493333a259.626667 259.626667 0 0 1-62.186667-140.586666z m5.077334-90.837334a258.986667 258.986667 0 0 1 67.861333-123.221333 253.717333 253.717333 0 0 1 362.496 0 259.392 259.392 0 0 1 72.106667 145.834667l160.768-49.472A42.666667 42.666667 0 0 1 981.333333 256v597.333333a42.666667 42.666667 0 0 1-30.122666 40.789334l-277.333334 85.333333a42.666667 42.666667 0 0 1-24.256 0.234667l-286.506666-81.856-265.237334 81.621333A42.666667 42.666667 0 0 1 42.666667 938.666667V341.333333a42.666667 42.666667 0 0 1 30.122666-40.789333l190.08-58.474667z m369.557333-63.36a168.384 168.384 0 0 0-240.896 0c-66.965333 67.989333-66.965333 178.496-1.130667 245.354667L512 538.688l120.96-114.048c66.453333-68.032 66.261333-178.133333-0.512-245.930667zM512 362.666667a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"
                    ></path>
                </svg>
                <span class="txt">{{ __('大地图') }}</span>
            </router-link>
            <div class="options-btn">
                <el-badge is-dot class="item" :hidden="!bus.hasUpgrade" type="danger">
                    <router-link :to="{ name: 'Options' }">
                        <i class="el-icon-s-tools"></i>
                        <span class="txt">{{ __('设置') }}</span>
                    </router-link>
                </el-badge>
            </div>
        </div>
    </aside>

    <main>
        <router-view />
    </main>
    <firstrun-dialog :show="bus.config.options.firstRun" />
</template>
<style lang="scss">
html,
body,
#app {
    margin: 0;
    width: 100%;
    height: 100%;
    background: #eee;
    color: #333;
}

@import '~@/styles/fonts.scss';
* {
    font-family: GenshinImpact;
}
.el-notification.right {
    margin-top: 50px;
}
.el-message-box {
    margin-left: 80px;
}
.el-dialog {
    left: 30px;
}
.fullscreen-dialog {
    left: 0;
}
.el-loading-mask {
    z-index: 9998 !important;
}
.menubox {
    width: 30px;
    height: 30px;
    -webkit-appearance: none;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    box-sizing: border-box;
    transition: all 0.1s;
    margin-left: 8px;
    margin-right: -5px;
    outline: 0;
    border-color: #55baff;
    color: #55baff;
    border-radius: 2px;
    &:hover {
        background-color: #55baff;
        color: #f7fcff;
    }
}
#app > .el-overlay {
    z-index: 9998 !important;
}
.header-plain-dropdown {
    margin-left: 10px;
    .el-button {
        height: 29px;
        vertical-align: middle;
    }
    .el-button:focus,
    .el-button:hover {
        background: #fff;
        border-color: #409eff;
        color: #409eff;
    }
}
.el-button + .header-plain-dropdown,
.header-plain-dropdown + .el-button {
    margin-left: 10px;
}
</style>
<style lang="scss" scoped>
$main: #007acc;
$front: rgba(255, 255, 255, 0.75);
header {
    user-select: none;
    -webkit-app-region: drag;
    overflow: hidden;
    position: absolute;
    left: 0;
    padding-left: 100px;
    right: 0;
    top: 0;
    height: 50px;
    z-index: 9999;
    background: #fff;
    border-bottom: 0;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    .logo {
        position: absolute;
        top: 0;
        left: 0;
        width: 80px;
        height: 100%;
        background: #409eff;
        box-shadow: 2px 0 12px 0 rgb(0 0 0 / 10%);
        .cocogoat {
            width: 50px;
            margin: 0 auto;
            display: block;
            fill: #fff;
        }
    }
    .app-title {
        position: absolute;
        left: 100px;
        top: 0;
        bottom: 0;
        line-height: 50px;
        font-size: 20px;
    }
    .app-actions {
        -webkit-app-region: no-drag;
        height: 100%;
        position: absolute;
        right: 130px;
        line-height: 48px;
        vertical-align: middle;
    }
    .actions {
        -webkit-app-region: no-drag;
        position: absolute;
        top: 10px;
        right: 7px;
        display: inline-block;
        button {
            width: 30px;
            height: 30px;
            -webkit-appearance: none;
            background: transparent;
            border: 1px solid transparent;
            cursor: pointer;
            box-sizing: border-box;
            transition: all 0.1s;
            margin: 0 3px;
            outline: 0;
            &:hover {
                border-color: #55baff;
                border-radius: 2px;
                color: #55baff;
                background: #f7fcff;
            }
        }
    }
}
aside {
    user-select: none;
    box-shadow: 2px 0 12px 0 rgb(0 0 0 / 10%);
    position: fixed;
    z-index: 9998;
    width: 80px;
    left: 0;
    top: 0;
    bottom: 0;
    background: $main;
    color: $front;
    svg {
        transition: all 0.2s;
        fill: $front;
    }
    padding: 13px 10px;
    padding-top: 65px;
    box-sizing: border-box;
    .nav a {
        display: block;
        height: 60px;
        overflow: hidden;
        border-radius: 3px;
        box-sizing: border-box;
        text-align: center;
        color: $front;
        text-decoration: none;
        margin-bottom: 10px;
        padding: 10px 0;
        transition: all 0.2s;
        i {
            display: block;
            font-size: 25px;
        }
        span {
            font-size: 14px;
            padding-top: 4px;
            display: block;
        }
        &.router-link-active {
            background: #fff;
            color: $main;
            svg {
                fill: $main;
            }
        }
        &.pc-user {
            cursor: pointer;
            position: absolute;
            bottom: 5px;
            left: 5px;
            right: 5px;
            outline: 0;
        }
    }
}
main {
    position: absolute;
    top: 50px;
    left: 80px;
    right: 0;
    bottom: 0;
    padding: 20px;
    overflow-y: overlay;
}
.svg-artifact {
    width: 45px;
    margin-bottom: -7px;
    margin-top: -9px;
}
.svg-mona {
    width: 30px;
    margin-bottom: -6px;
    margin-top: -3px;
}
.svg-map {
    width: 30px;
    margin-bottom: -6px;
    margin-top: -3px;
}
.options-btn {
    position: absolute;
    bottom: 0;
    left: 10px;
    right: 10px;
    .el-badge {
        width: 100%;
    }
}
</style>
