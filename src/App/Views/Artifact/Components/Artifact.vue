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
    emits: ['edit', 'delete', 'update:selected'],
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

    &.en {
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
