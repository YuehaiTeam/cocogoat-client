<script lang="ts">
import Artifact from './Components/Artifact.vue'
import { Artifact as ArtifactType } from '@/typings/Artifact'
import { ArtifactFilter, ArtifactFilter as ArtifactFilterClass } from '@/typings/ArtifactFilter'
import ArtifactEditPanel from './Components/EditPanel.vue'
import ArtifactFilterPanel from './Components/FilterPanel.vue'
import {
    openArtifactView,
    showSaveDialog,
    openExternal,
    checkDwmIsCompositionEnabled,
    checkVCRedistInstalled,
} from '../../ipc'
import { ElMessageBox, ElNotification } from 'element-plus'
import { loadData, artifactClear, artifactDelete, artifactPush, bus } from '@/App/bus'
import { convertAsMona } from '../../export/Mona'
import { convertAsMingyulab } from '../../export/Mingyulab'
// @ts-ignore
import monaToGO from '@mr-quin/mona_to_go'
import { clipboard } from 'electron'
import { defineComponent } from 'vue'
import fsex from 'fs-extra'

import { __ } from '@/i18n'
export default defineComponent({
    components: {
        Artifact,
        ArtifactEditPanel,
        ArtifactFilterPanel,
    },
    data() {
        return {
            showEdit: false,
            editData: this.createEmptyArtifact(),
            isEdit: false,
            selectedIds: [] as number[],
            showFilter: false,
            isFiltering: false,
            artifactFilter: new ArtifactFilterClass(),
        }
    },
    computed: {
        list(): ArtifactType[] {
            if (this.isFiltering) {
                let result = []
                for (const artifact of bus.artifacts) if (this.artifactFilter.filter(artifact)) result.push(artifact)
                return result
            }
            return bus.artifacts
        },
    },
    methods: {
        createEmptyArtifact() {
            return {
                id: Date.now(),
                name: '',
                stars: 0,
                lock: false,
                level: 0,
                main: {
                    name: '',
                    value: '',
                },
                sub: [],
                user: '',
            } as ArtifactType
        },
        async openArtifactView() {
            try {
                if (!(await checkVCRedistInstalled())) {
                    await ElMessageBox.confirm(
                        __(
                            '您的系统似乎没有安装微软运行库 (下载地址：https://aka.ms/vs/16/release/vc_redist.x64.exe) ，识别功能将无法正常使用。',
                        ),
                        __('提示'),
                        {
                            confirmButtonText: __('前往下载'),
                            cancelButtonText: __('仍然尝试'),
                            type: 'warning',
                        },
                    )
                    openExternal('https://aka.ms/vs/16/release/vc_redist.x64.exe')
                    return
                }
            } catch (e) {}
            try {
                if (!(await checkDwmIsCompositionEnabled())) {
                    await ElMessageBox.confirm(__('您的系统似乎没有启用Aero，识别功能可能无法正常使用。'), __('提示'), {
                        confirmButtonText: __('确认'),
                        cancelButtonText: __('仍然尝试'),
                        type: 'warning',
                    })
                    return
                }
            } catch (e) {}
            ElNotification({
                type: 'info',
                title: __('正在打开圣遗物识别工具'),
                message: __('请确保原神已经运行'),
                duration: 5000,
            })
            openArtifactView()
        },
        doDelete(id: number) {
            artifactDelete(id)
        },
        doDeleteSelected() {
            this.selectedIds.forEach((id) => {
                artifactDelete(id)
            })
            this.selectedIds = []
        },
        doCreate() {
            this.editData = this.createEmptyArtifact()
            this.showEdit = true
            this.isEdit = false
        },
        doEdit(id: number) {
            for (let i of bus.artifacts) {
                if (i.id === id) {
                    this.editData = i
                    this.showEdit = true
                    this.isEdit = true
                }
            }
        },
        doEditSave(artifact: ArtifactType) {
            artifactPush(artifact)
            this.showEdit = false
        },
        doClear() {
            artifactClear()
            this.selectedIds = []
        },
        doSelect(id: number, status: boolean) {
            if (status) {
                this.selectedIds.push(id)
            } else {
                this.selectedIds = this.selectedIds.filter((e) => e !== id)
            }
        },
        getExport(format: string) {
            let artifacts = JSON.parse(JSON.stringify(bus.artifacts))
            if (this.selectedIds.length > 0) {
                artifacts = artifacts.filter((e: ArtifactType) => this.selectedIds.includes(e.id))
            }
            switch (format) {
                case 'GO':
                    return JSON.stringify(
                        {
                            version: 0,
                            characterDatabase: {},
                            artifactDatabase: monaToGO(convertAsMona(artifacts), 0, 3),
                            artifactDisplay: {
                                filterArtSetKey: '',
                                filterStars: [3, 4, 5],
                                filterLevelLow: 0,
                                filterLevelHigh: 20,
                                filterSlotKey: '',
                                filterMainStatKey: '',
                                filterSubstats: ['', '', '', ''],
                                filterLocation: '',
                                filterLocked: '',
                                ascending: false,
                                sortType: 'quality',
                                maxNumArtifactsToDisplay: 50,
                                effFilter: [
                                    'hp',
                                    'hp_',
                                    'atk',
                                    'atk_',
                                    'def_',
                                    'def',
                                    'eleMas',
                                    'enerRech_',
                                    'critRate_',
                                    'critDMG_',
                                ],
                            },
                            characterDisplay: {},
                            buildsDisplay: {},
                        },
                        null,
                        4,
                    )
                case 'Mingyulab':
                    return JSON.stringify(convertAsMingyulab(artifacts), null, 4)
                default:
                    return JSON.stringify(convertAsMona(artifacts), null, 4)
            }
        },
        doExport(format: string) {
            clipboard.writeText(this.getExport(format))
            ElNotification({
                type: 'success',
                title: __('导出成功'),
                message: __('已复制到剪贴板'),
            })
        },
        async doExportToFile(format: string) {
            try {
                const { filePath, canceled } = await showSaveDialog({
                    title: __('导出'),
                    filters: [{ name: 'JSON Files', extensions: ['json'] }],
                })
                if (canceled || !filePath) return
                const convertedJson = this.getExport(format)
                await fsex.writeFile(filePath, convertedJson)
                ElNotification({
                    type: 'success',
                    title: __('导出成功'),
                })
            } catch (e) {
                console.log(e)
            }
        },
        doFilter() {
            if (this.isFiltering) this.isFiltering = false
            else this.showFilter = true
        },
        updateArtifactFilter(filter: ArtifactFilter) {
            this.artifactFilter = filter
            this.isFiltering = true
            this.selectedIds = []
        },
        doSelectAll() {
            this.selectedIds = []
            for (const artifact of this.list) this.selectedIds.push(artifact.id)
        },
        doLockSelected(lock: boolean) {
            const artifactLists = []
            for (const artifact of this.list) if (this.selectedIds.includes(artifact.id)) artifactLists.push(artifact)
            for (let artifact of artifactLists) artifact.lock = lock
        },
        doLoad() {
            this.selectedIds = []
            this.isFiltering = false
            loadData()
        },
    },
})
</script>
<template>
    <teleport to="#app-title"> {{ __('圣遗物仓库') }} </teleport>
    <teleport to="#app-actions">
        <div class="actions">
            <el-button size="mini" type="primary" plain @click="doLoad">{{ __('更新圣遗物信息') }}</el-button>
            <el-dropdown class="header-plain-dropdown" size="mini" split-button @click="doExport">
                {{ __(selectedIds.length > 0 ? '导出选中' : '导出') }}
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item disabled class="export-title">
                            {{ __('莫娜占卜铺') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="doExport('Mona')">{{ __('复制') }}</el-dropdown-item>
                        <el-dropdown-item @click="doExportToFile('Mona')">{{ __('到文件') }}</el-dropdown-item>
                        <el-dropdown-item divided disabled class="export-title">
                            {{ __('Mingyulab') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="doExport('Mingyulab')">{{ __('复制') }}</el-dropdown-item>
                        <el-dropdown-item @click="doExportToFile('Mingyulab')">{{ __('到文件') }}</el-dropdown-item>
                        <el-dropdown-item divided disabled class="export-title">
                            {{ __('Genshin Optimizer') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="doExport('GO')">{{ __('复制') }}</el-dropdown-item>
                        <el-dropdown-item @click="doExportToFile('GO')">{{ __('到文件') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown class="header-plain-dropdown" size="mini">
                <el-button size="mini"> {{ __('操作') }}<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="doSelectAll"
                            ><i class="el-icon-check"></i>{{ __('全部选择') }}</el-dropdown-item
                        >
                        <el-dropdown-item @click="selectedIds = []"
                            ><i class="el-icon-close"></i>{{ __('全部不选') }}</el-dropdown-item
                        >
                        <el-dropdown-item @click="doLockSelected(true)"
                            ><i class="el-icon-lock"></i>{{ __('加锁已选') }}</el-dropdown-item
                        >
                        <el-dropdown-item @click="doLockSelected(false)"
                            ><i class="el-icon-unlock"></i>{{ __('解锁已选') }}</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-button size="mini" plain @click="doFilter">{{ __(isFiltering ? '取消过滤' : '过滤') }}</el-button>
            <template v-if="selectedIds.length <= 0">
                <el-button size="mini" plain icon="el-icon-plus" @click="doCreate">{{ __('添加') }}</el-button>
                <el-popconfirm
                    :confirmButtonText="__('确定')"
                    :cancelButtonText="__('算了')"
                    icon="el-icon-warning"
                    :title="__('真的要清空吗？')"
                    confirmButtonType="danger"
                    @confirm="doClear"
                >
                    <template #reference>
                        <el-button size="mini" type="danger" plain icon="el-icon-delete">{{ __('清空') }}</el-button>
                    </template>
                </el-popconfirm>
            </template>
            <template v-else>
                <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="doDeleteSelected">
                    {{ __('删除选中') }}
                </el-button>
            </template>
            <el-button size="mini" plain icon="el-icon-aim" @click="openArtifactView">
                {{ __('识别') }}
            </el-button>
        </div>
    </teleport>
    <div class="page-main">
        <artifact
            v-for="i in list"
            :key="i.id"
            :artifact="i"
            :selected="selectedIds.includes(i.id)"
            @update:selected="doSelect(i.id, $event)"
            @update:artifactlock="i.lock = $event"
            @delete="doDelete"
            @edit="doEdit"
        />
        <div v-if="list.length <= 0" class="emptyState">
            <el-empty :description="__('工作…工作还没做完…真的可以提前休息吗？')"></el-empty>
        </div>
    </div>
    <artifact-edit-panel
        v-model:show="showEdit"
        :title="__(isEdit ? '编辑圣遗物' : '添加圣遗物')"
        :model-value="editData"
        @update:model-value="doEditSave"
    />
    <artifact-filter-panel
        v-model:show="showFilter"
        v-model:filter="artifactFilter"
        :title="__('圣遗物过滤器')"
        @update:filter="updateArtifactFilter($event)"
    />
</template>

<style lang="scss" scoped>
.page-main {
    width: 100%;
    height: 100%;
}
.emptyState {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.export-title {
    cursor: default !important;
}
</style>
