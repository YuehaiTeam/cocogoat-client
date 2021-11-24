<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
    ArtifactParamTypes,
    ArtifactSubParamTypes,
    ArtifactPositionNames,
    ArtifactSetNames,
} from '@/typings/ArtifactMap'
import { SubFilterEquation, SubFilter, ArtifactFilter } from '@/typings/ArtifactFilter'
export default defineComponent({
    props: {
        inputFilter: {
            type: Object as PropType<ArtifactFilter>,
        },
        show: Boolean,
        title: String,
    },
    emits: ['update:filter', 'update:show'],
    data() {
        let availableSubFilterEquations: any[] = []
        for (let i in SubFilterEquation)
            if (isNaN(Number(i))) availableSubFilterEquations.push({ value: SubFilterEquation[i], label: i })
        const filter = this.inputFilter || new ArtifactFilter()
        return {
            ArtifactParamTypes,
            ArtifactSubParamTypes,
            ArtifactSetNames,
            ArtifactPositionNames,
            availableSubFilterEquations,
            filter,
        }
    },
    watch: {},
    created() {},
    methods: {
        doSave() {
            this.$emit('update:filter', this.filter)
            this.$emit('update:show', false)
        },
        doAddIncludeSub() {
            this.filter.includeSub.push(new SubFilter())
        },
        doAddExcludeSub() {
            this.filter.excludeSub.push(new SubFilter())
        },
        doDeleteIncludeSub(key: number) {
            this.filter.includeSub.splice(key, 1)
        },
        doDeleteExcludeSub(key: number) {
            this.filter.excludeSub.splice(key, 1)
        },
        onSubClick(sub: SubFilter) {
            if (sub.name === '元素精通' && sub.value.indexOf('%') > -1) sub.value = sub.value.replace('%', '')
            if (
                ['暴击率', '暴击伤害', '元素充能效率'].indexOf(sub.name.toString()) > -1 &&
                sub.value.indexOf('%') === -1
            )
                sub.value += '%'
        },
    },
})
</script>
<template>
    <el-dialog :title="title" width="800px" :model-value="show" @update:model-value="$emit('update:show', $event)">
        <article class="artiface-edit-panel">
            <el-select v-model="filter.position" multiple :placeholder="__('位置')">
                <el-option v-for="(item, a) in ArtifactPositionNames" :key="a" :label="__(item)" :value="item">
                </el-option>
            </el-select>
            <el-select v-model="filter.set" multiple :placeholder="__('套装')">
                <el-option v-for="(item, a) in ArtifactSetNames" :key="a" :label="__(item)" :value="item"> </el-option>
            </el-select>
            <el-select v-model="filter.level" multiple :placeholder="__('等级')">
                <el-option
                    v-for="(item, a) in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]"
                    :key="a"
                    :label="item"
                    :value="item"
                >
                </el-option>
            </el-select>
            <el-select v-model="filter.stars" multiple :placeholder="__('星级')">
                <el-option v-for="(item, a) in [1, 2, 3, 4, 5]" :key="a" :label="item" :value="item"> </el-option>
            </el-select>
            <el-select v-model="filter.main" multiple :placeholder="__('主词条')">
                <el-option v-for="(item, a) in ArtifactParamTypes" :key="a" :label="__(item)" :value="item">
                </el-option>
            </el-select>
            <br />
            {{ __('需要包含的副词条') }}<br />
            {{ __('最少包含条数') }}<br />
            <el-select v-model="filter.includeSubCount">
                <el-option v-for="(item, a) in [0, 1, 2, 3, 4]" :key="a" :label="item" :value="item"> </el-option>
            </el-select>
            <el-empty v-if="filter.includeSub.length <= 0" :image-size="80" :description="__('暂无副词条')"></el-empty>
            <ul v-else class="sub">
                <li v-for="(i, a) in filter.includeSub" :key="a">
                    <el-input v-model="i.value" size="small" :placeholder="__('属性值')">
                        <template #prepend>
                            <el-select v-model="i.name" size="small" :placeholder="__('属性名')">
                                <el-option
                                    v-for="(j, a) in ArtifactSubParamTypes"
                                    :key="a"
                                    :value="j"
                                    :label="__(j)"
                                    @click="onSubClick(i)"
                                ></el-option>
                            </el-select>
                            <el-select v-model="i.equation" size="small" style="margin-left: 0px">
                                <el-option
                                    v-for="(j, a) in availableSubFilterEquations"
                                    :key="a"
                                    :value="j.value"
                                    :label="j.label"
                                ></el-option>
                            </el-select>
                        </template>
                        <template #append>
                            <el-button icon="el-icon-delete-solid" @click="doDeleteIncludeSub(a)"></el-button>
                        </template>
                    </el-input>
                </li>
            </ul>
            {{ __('不想包含的副词条') }}<br />
            {{ __('最多包含条数') }}<br />
            <el-select v-model="filter.excludeSubCount">
                <el-option v-for="item in [0, 1, 2, 3, 4]" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
            <el-empty v-if="filter.excludeSub.length <= 0" :image-size="80" :description="__('暂无副词条')"></el-empty>
            <ul v-else class="sub">
                <li v-for="(i, a) in filter.excludeSub" :key="a">
                    <el-input v-model="i.value" size="small" :placeholder="__('属性值')">
                        <template #prepend>
                            <el-select v-model="i.name" size="small" :placeholder="__('属性名')">
                                <el-option
                                    v-for="(j, a) in ArtifactSubParamTypes"
                                    :key="a"
                                    :value="j"
                                    :label="__(j)"
                                    @click="onSubClick(i)"
                                ></el-option>
                            </el-select>
                            <el-select v-model="i.equation" size="small" style="margin-left: 0px">
                                <el-option
                                    v-for="(j, a) in availableSubFilterEquations"
                                    :key="a"
                                    :value="j.value"
                                    :label="j.label"
                                ></el-option>
                            </el-select>
                        </template>
                        <template #append>
                            <el-button icon="el-icon-delete-solid" @click="doDeleteExcludeSub(a)"></el-button>
                        </template>
                    </el-input>
                </li>
            </ul>
        </article>
        <template #footer>
            <span class="dialog-footer">
                <el-button size="small" plain style="float: left" @click="doAddIncludeSub">
                    {{ __('添加想包含副词条') }}
                </el-button>
                <el-button size="small" plain style="float: left" @click="doAddExcludeSub">
                    {{ __('添加不包含副词条') }}
                </el-button>
                <el-button size="small" type="primary" @click="doSave">{{ __('确定') }}</el-button>
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
        min-height: 128px;
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
