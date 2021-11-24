<script lang="ts">
import { __ } from '@/i18n'
import { status } from '../../status'
import { ArtifactParamTypes, ArtifactSubParamTypes, ArtifactNames } from '@/typings/ArtifactMap'
export default {
    data() {
        const artifactNameOptions: { value: string; label: string }[] = []
        for (let i of ArtifactNames) {
            artifactNameOptions.push({
                value: i,
                label: __(i),
            })
        }
        return {
            artifactNameOptions,
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
        doLock() {
            status.artifact.lock = !status.artifact.lock
        },
    },
}
</script>
<template>
    <article class="artiface-float-panel">
        <div class="title">
            <el-select-v2
                v-model="artifact.name"
                class="title-input"
                size="mini"
                filterable
                :options="artifactNameOptions"
            >
            </el-select-v2>
        </div>
        <div class="line2">
            <div class="stars">
                <el-rate v-model="artifact.stars" />
            </div>
            <div class="lock" :style="artifact.lock ? 'background: rgb(73, 83, 102);' : ''" @click="doLock">
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
            <el-input v-model="artifact.main.value" size="small" :placeholder="__('主词条值')">
                <template #prepend>
                    <el-select v-model="artifact.main.name" size="small" :placeholder="__('主词条名')">
                        <el-option v-for="(j, a) in ArtifactParamTypes" :key="a" :value="j" :label="__(j)"></el-option>
                    </el-select>
                </template>
                <template v-if="artifact.sub.length < 4" #append>
                    <el-button icon="el-icon-plus" @click="doAddSub"></el-button>
                </template>
            </el-input>
        </div>
        <ul class="sub">
            <li v-for="(i, a) in artifact.sub" :key="a" :class="{ 'maybe-wrong': potentialErrors.includes(i.value) }">
                <el-input v-model="i.value" size="small" :placeholder="__('属性值')">
                    <template #prepend>
                        <el-select v-model="i.name" size="small" :placeholder="__('属性名')">
                            <el-option
                                v-for="(j, a) in ArtifactSubParamTypes"
                                :key="a"
                                :value="j"
                                :label="__(j)"
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

    .lock {
        float: right;
        width: 20px;
        height: 20px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin: 2px;
        svg {
            width: 15px;
            height: 15px;
        }
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
    .title-input {
        width: 100%;
        margin-top: 10px;
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
