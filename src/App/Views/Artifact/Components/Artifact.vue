<script lang="ts">
import { Artifact as ArtifactType } from '@/typings/Artifact'
import { PropType } from 'vue'
export default {
    props: {
        artifact: {
            type: Object as PropType<ArtifactType>,
        },
    },
    emits: ['edit', 'delete'],
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
    },
}
</script>
<template>
    <el-card class="artifact">
        <div class="main-part" :class="`star${artifact.stars}`">
            <div class="image" :style="{ backgroundImage: getImg(artifact.name) }"></div>
            <div class="name">
                {{ artifact.name }}
            </div>
            <div class="level">+{{ artifact.level }}</div>
            <el-rate class="stars" :modelValue="artifact.stars" disabled />
            <div class="main">
                <div class="name">{{ artifact.main.name }}</div>
                <div class="value">{{ artifact.main.value }}</div>
            </div>
        </div>
        <ul class="sub-part">
            <li v-for="(i, a) in artifact.sub" :key="a">
                <span>{{ i.name }}+{{ i.value }}</span>
            </li>
        </ul>
        <div class="action-area">
            <el-dropdown size="small" trigger="click" placement="bottom-end">
                <button class="actions">
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
}
.action-area {
    position: absolute;
    top: 7px;
    right: 5px;
    width: 80px;
    text-align: right;
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
