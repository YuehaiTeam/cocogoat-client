<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Artifact as ArtifactType } from '@/typings/Artifact'
import { ArtifactParamTypes, ArtifactSubParamTypes, ArtifactNames } from '@/typings/ArtifactMap'
import { __ } from '@/i18n'
export default defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<ArtifactType>,
        },
        show: Boolean,
        title: String,
    },
    emits: ['update:modelValue', 'update:show'],
    data() {
        const artifactNameOptions: { value: string; label: string }[] = []
        for (let i of ArtifactNames) {
            artifactNameOptions.push({
                value: i,
                label: __(i),
            })
        }
        return {
            ArtifactParamTypes,
            ArtifactSubParamTypes,
            artifactNameOptions,
            artifact: JSON.parse(JSON.stringify(this.modelValue)) as ArtifactType,
            levelMax: {
                5: 20,
                4: 16,
                3: 12,
                2: 4,
                1: 4,
            } as any,
        }
    },
    watch: {
        modelValue(newVal: ArtifactType) {
            this.artifact = JSON.parse(JSON.stringify(newVal)) as ArtifactType
        },
    },
    created() {},
    methods: {
        doSave() {
            this.$emit('update:modelValue', this.artifact)
        },
        doReset() {
            this.artifact = JSON.parse(JSON.stringify(this.modelValue)) as ArtifactType
        },
        doAddSub() {
            this.artifact.sub.push({
                name: '',
                value: '',
            })
        },
        doDeleteSub(key: number) {
            this.artifact.sub.splice(key, 1)
        },
        getImg(name: string): string | false {
            try {
                const imgUrl = require(`@/assets/artifacts/${name}.webp`)
                return `url(${imgUrl})`
            } catch (e) {
                return `none`
            }
        },
    },
})
</script>
<template>
    <el-dialog :title="title" width="400px" :model-value="show" @update:model-value="$emit('update:show', $event)">
        <article class="artiface-edit-panel">
            <div class="title">
                <el-select-v2
                    v-model="artifact.name"
                    class="title-select"
                    filterable
                    size="small"
                    :placeholder="__('圣遗物')"
                    :options="artifactNameOptions"
                >
                </el-select-v2>
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
            <div class="stars">
                <el-rate v-model="artifact.stars" />
            </div>
            <div class="image" :style="{ backgroundImage: getImg(artifact.name) }"></div>
            <div class="main">
                <el-select v-model="artifact.main.name" size="small" :placeholder="__('主词条名')">
                    <el-option v-for="(j, a) in ArtifactParamTypes" :key="a" :value="j" :label="__(j)"></el-option>
                </el-select>
                <el-input v-model="artifact.main.value" size="small" :placeholder="__('主词条值')"> </el-input>
            </div>
            <br />
            {{ __('副词条') }}<br />
            <el-empty v-if="artifact.sub.length <= 0" :image-size="80" :description="__('暂无副词条')"></el-empty>
            <ul v-else class="sub">
                <li v-for="(i, a) in artifact.sub" :key="a">
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
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    size="small"
                    plain
                    style="float: left"
                    :disabled="artifact.sub.length >= 4"
                    @click="doAddSub"
                >
                    {{ __('添加副词条') }}
                </el-button>
                <el-button size="small" type="danger" plain @click="doReset">{{ __('重置') }}</el-button>
                <el-button size="small" type="primary" @click="doSave">{{ __('保存') }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.artiface-edit-panel {
    position: relative;
    margin-top: -20px;
    &::v-deep(.el-select) .el-input {
        width: 150px;
    }
    .title-select {
        width: 180px;
        white-space: nowrap;
    }
    .image {
        position: absolute;
        top: -10px;
        right: 30px;
        width: 120px;
        height: 120px;
        background: transparent no-repeat center;
        background-size: contain;
    }
    .stars {
        position: absolute;
        top: 105px;
        right: 27px;
        z-index: 2;
    }
    .sub {
        height: 128px;
        margin-bottom: 0;
    }
    .el-empty {
        padding: 0;
        height: 128px;
        margin-top: 14px;
    }
    .title ::v-deep(.el-select) .el-input {
        width: 180px !important;
    }

    .level ::v-deep(.el-input-number) {
        width: 180px;
    }

    .main ::v-deep(.el-input) {
        width: 180px !important;
        display: block;
    }
}
</style>
