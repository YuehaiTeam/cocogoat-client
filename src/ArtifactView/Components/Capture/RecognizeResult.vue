<script lang="ts">
import { status } from '../../status'
import { ArtifactParamTypes, ArtifactSubParamTypes } from '@/typings/ArtifactMap'
export default {
    data() {
        return {
            ArtifactParamTypes,
            ArtifactSubParamTypes,
            levelMax: {
                5: 20,
                4: 16,
                3: 12,
                2: 4,
                1: 4,
            },
        }
    },
    computed: {
        artifact() {
            return status.artifact
        },
        potentialErrors() {
            return status.potentialErrors
        },
    },
    methods: {
        doAddSub() {
            status.artifact.sub.push({
                name: '',
                value: '',
            })
        },
        doDeleteSub(key: number) {
            status.artifact.sub.splice(key, 1)
        },
    },
}
</script>
<template>
    <article class="artiface-float-panel">
        <div class="title">
            <el-input v-model="artifact.name" size="small" />
        </div>
        <div class="line2">
            <div class="stars">
                <el-rate v-model="artifact.stars" />
            </div>
            <div class="level">
                <el-input-number
                    v-model="artifact.level"
                    size="small"
                    :min="0"
                    :max="levelMax[artifact.stars] || 20"
                    label="等级"
                ></el-input-number>
            </div>
        </div>
        <div class="main" :class="{ 'maybe-wrong': potentialErrors.includes(artifact.main.value) }">
            <el-input v-model="artifact.main.value" size="small" placeholder="属性值">
                <template #prepend>
                    <el-select v-model="artifact.main.name" size="small" placeholder="属性名">
                        <el-option v-for="(j, a) in ArtifactParamTypes" :key="a" :value="j" :label="j"></el-option>
                    </el-select>
                </template>
                <template v-if="artifact.sub.length < 4" #append>
                    <el-button icon="el-icon-plus" @click="doAddSub"></el-button>
                </template>
            </el-input>
        </div>
        <ul class="sub">
            <li v-for="(i, a) in artifact.sub" :key="a" :class="{ 'maybe-wrong': potentialErrors.includes(i.value) }">
                <el-input v-model="i.value" size="small" placeholder="属性值">
                    <template #prepend>
                        <el-select v-model="i.name" size="small" placeholder="属性名">
                            <el-option
                                v-for="(j, a) in ArtifactSubParamTypes"
                                :key="a"
                                :value="j"
                                :label="j"
                            ></el-option>
                        </el-select>
                    </template>
                    <template #append>
                        <el-button icon="el-icon-delete-solid" @click="doDeleteSub(a)"></el-button>
                    </template>
                </el-input>
            </li>
        </ul>
    </article>
</template>

<style lang="scss">
.artiface-float-panel {
    padding: 0 12px;
    .el-select .el-input {
        width: 150px;
    }
    .el-input-group__prepend {
        background-color: #fff;
    }
    .stars {
        display: inline-block;
    }

    .level {
        float: right;
    }

    .sub {
        margin: 0;
        li {
            color: #555;
            height: 23px;
        }
    }

    .el-input--small .el-input__inner {
        height: 23px;
        line-height: 23px;
    }

    .el-input-number__decrease {
        height: 23px;
    }

    .el-input-number.el-input-number--small {
        height: 23px;
        line-height: 23px;
    }
    .el-input-number.el-input-number--small span {
        height: 20.5px;
        line-height: 22px;
        margin-top: 1px;
        vertical-align: middle;
    }

    .el-input-number .el-input.el-input--small {
        vertical-align: middle;
        line-height: 23px;
    }
    .el-input--small .el-input__icon {
        line-height: 23px;
    }

    .el-input__suffix-inner {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        line-height: 23px;
    }

    .main {
        padding-top: 6px;
    }
    .title .el-input__inner {
        text-align: center;
    }
}
</style>
<style lang="scss" scoped>
.maybe-wrong ::v-deep(input) {
    border-color: #f56c6c;
    background: #ffdede;
}
</style>
