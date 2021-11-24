<script lang="ts">
import { Artifact as ArtifactType } from '@/typings/Artifact'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        artifact: {
            type: Object as PropType<ArtifactType>,
        },
        selected: {
            type: Boolean as PropType<boolean>,
        },
    },
    emits: ['edit', 'delete', 'update:selected', 'update:artifactlock'],
    data() {
        return {}
    },
    methods: {
        getImg(name: string): string | false {
            try {
                const imgUrl = require(`@/assets/artifacts/${name}.webp`)
                return `url(${imgUrl})`
            } catch (e) {
                return `none`
            }
        },
        updateSelected() {
            this.$emit('update:selected', !this.selected)
        },
        updateLock() {
            if (this.artifact) this.$emit('update:artifactlock', !this.artifact.lock)
        },
    },
})
</script>
<template>
    <el-card class="artifact" :class="`${$lang.lang} ${selected ? 'selected' : ''}`" @click="updateSelected">
        <div class="selected-icon" :class="{ selected }">
            <i class="el-icon-check"></i>
        </div>
        <div class="main-part" :class="`star${artifact.stars}`">
            <div class="image" :style="{ backgroundImage: getImg(artifact.name) }"></div>
            <div class="name">
                {{ __(artifact.name) }}
            </div>
            <div class="level">+{{ artifact.level }}</div>
            <el-rate class="stars" :modelValue="artifact.stars" disabled />
            <div class="main">
                <div class="name">{{ __(artifact.main.name) }}</div>
                <div class="value">{{ artifact.main.value }}</div>
            </div>
        </div>
        <ul class="sub-part">
            <li v-for="(i, a) in artifact.sub" :key="a">
                <span>{{ __(i.name) }}+{{ i.value }}</span>
            </li>
        </ul>
        <div class="lock" :style="artifact.lock ? 'background: rgb(73, 83, 102);' : ''" @click.stop="updateLock">
            <svg
                v-if="!artifact.lock"
                class="unlock-svg"
                t="1632123801675"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7299"
                width="200"
                height="200"
            >
                <path
                    d="M801.649 418.816H366.694V263.951c0-51.271 64.932-108.21 144.983-108.21 80.062 0 144.983 56.944 144.983 108.21v46.434h0.63c3.994 26.265 27.525 46.438 55.895 46.438 28.575 0 52.112-20.173 55.89-46.438h0.63v-46.439c0-119.562-115.354-216.637-257.818-216.637-142.249 0-257.607 97.075-257.607 216.637v154.87H221.92c-53.37 0-96.655 41.6-96.655 93.082V883.82c0 51.271 43.284 92.871 96.655 92.871h580.153c53.586 0 96.66-41.6 96.66-92.871V511.898c-0.22-51.482-43.924-93.082-97.085-93.082zM559.8 761.938v42.24c0 26.69-21.647 48.118-48.537 48.118a47.974 47.974 0 0 1-48.118-48.118v-42.24c-38.031-17.229-64.717-54.21-64.717-96.65 0-59.26 50.642-107.162 112.835-107.162s112.624 47.898 112.624 107.162c0.42 42.444-26.055 79.421-64.087 96.65z"
                    p-id="7300"
                    fill="rgb(158,161,168)"
                ></path>
            </svg>
            <svg
                v-else
                class="lock-svg"
                t="1632123812759"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7432"
                width="200"
                height="200"
            >
                <path
                    d="M801.649 418.816h-31.944V263.752h-0.005c-0.123-119.47-115.43-216.443-257.813-216.443-142.249 0-257.607 97.075-257.607 216.637v154.87H221.92c-53.37 0-96.655 41.6-96.655 93.082V883.82c0 51.271 43.284 92.871 96.655 92.871h580.147c53.592 0 96.666-41.6 96.666-92.871V511.898c-0.22-51.482-43.924-93.082-97.085-93.082zM559.8 761.938v42.24c0 26.69-21.652 48.113-48.537 48.113a47.974 47.974 0 0 1-48.118-48.113v-42.24c-38.031-17.229-64.717-54.21-64.717-96.65 0-59.26 50.642-107.167 112.835-107.167s112.63 47.898 112.63 107.167c0.42 42.444-26.061 79.421-64.093 96.65zM366.694 418.816V263.951c0-51.271 64.932-108.21 144.983-108.21 80.062 0 144.983 56.944 144.983 108.21v154.865H366.694z"
                    p-id="7433"
                    fill="rgb(255,138,117)"
                ></path>
            </svg>
        </div>
        <div class="action-area">
            <el-dropdown size="small" trigger="click" placement="bottom-end" @click.prevent.stop>
                <button class="actions" @click.prevent.stop>
                    <i class="el-icon-more"></i>
                </button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="$emit('edit', artifact.id)">{{ __('修改') }}</el-dropdown-item>
                        <el-dropdown-item @click="$emit('delete', artifact.id)">{{ __('删除') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-card>
</template>

<style lang="scss" scoped>
.artifact {
    width: 200px;
    height: 190px;
    position: relative;
    margin: 8px;
    display: inline-block;
    .main-part {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 90px;
        padding: 10px;
        background: #888;
        color: #fff;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        &.star2 {
            background: #51947c;
        }
        &.star3 {
            background: #5080ca;
        }
        &.star4 {
            background: #9e68ce;
        }
        &.star5 {
            background: #c4723a;
        }
        & > .name {
            position: absolute;
            top: 10px;
            left: 50px;
            z-index: 2;
        }
        .image {
            position: absolute;
            width: 75px;
            height: 75px;
            background: transparent no-repeat center;
            background-size: contain;
            top: 30px;
            right: 0;
        }
        .stars {
            position: absolute;
            top: 33px;
            left: 10px;
            &::v-deep(.el-rate__icon) {
                margin-right: 4px;
            }
        }

        .level {
            background: #fff;
            color: #555;
            padding: 1px 0;
            box-sizing: border-box;
            font-size: 13px;
            display: inline-block;
            border-radius: 2px;
            position: absolute;
            left: 10px;
            top: 10px;
            width: 32px;
            text-align: center;
        }

        .main {
            display: inline-block;
            position: absolute;
            left: 12px;
            top: 55px;
            padding-top: 2px;
            font-size: 13px;
            .value {
                padding-top: 3px;
                font-size: 22px;
            }
        }
    }
    .sub-part {
        padding-top: 105px;
        font-size: 13px;
        margin-top: 0;
        padding-left: 15px;
        li {
            span {
                margin-left: -3px;
            }
            padding-bottom: 2px;
        }
    }
    .lock {
        width: 19px;
        height: 19px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        bottom: 5px;
        right: 5px;
        svg {
            width: 15px;
            height: 15px;
        }
    }

    .selected-icon {
        position: absolute;
        bottom: -1px;
        left: 1px;
        width: 30px;
        height: 30px;
        border-bottom-left-radius: 3px;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transition: all 0.1s;
        &:before {
            position: absolute;
            left: 0;
            bottom: 0;
            box-sizing: border-box;
            border-bottom: solid 30px #007acc;
            border-right: solid 30px rgba(0, 0, 0, 0);
            content: '';
        }
        i {
            color: #fff;
            position: absolute;
            bottom: 2px;
            z-index: 2;
            font-size: 19px;
            font-weight: bold;
        }
        &.selected {
            opacity: 1;
        }
    }

    &.selected {
        box-shadow: 0 2px 12px 0 rgba(0, 122, 204, 0.5);
        border-color: #bce4ff;
    }

    &.en,
    &.ru,
    &.de,
    &.pt {
        .name {
            font-size: 12px;
            max-width: 125px;
        }
    }
}
.action-area {
    position: absolute;
    top: 7px;
    right: 5px;
    width: 80px;
    text-align: right;
    z-index: 5;
    .actions {
        background: transparent;
        color: #fff;
        border: 0;
        height: 25px;
        width: 25px;
        font-size: 13px;
        line-height: 26px;
        padding: 0;
        border-radius: 50%;
        transition: all 0.2s;
        cursor: pointer;
        outline: 0;
        &:hover {
            background: rgba(0, 0, 0, 0.2);
        }
    }
}
.artifact ::v-deep(.el-card) {
    height: 100%;
}

.artifact ::v-deep(.el-card__body) {
    padding: 10px;
    height: 100%;
    overflow: hidden;
}
</style>
