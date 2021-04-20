<script lang="ts">
import Artifact from './Components/Artifact.vue'
import { Artifact as ArtifactType } from '@/typings/Artifact'
import ArtifactEditPanel from './Components/EditPanel.vue'
import { openArtifactView, showSaveDialog, checkDwmIsCompositionEnabled } from '../../ipc'
import { ElMessageBox, ElNotification } from 'element-plus'
import { artifactPush, bus } from '@/App/bus'
import { convertAsMona } from '../../export/Mona'
import { clipboard } from 'electron'
import { defineComponent } from 'vue'
import fsex from 'fs-extra'
import { __ } from '@/i18n'
export default defineComponent({
    components: {
        Artifact,
        ArtifactEditPanel,
    },
    data() {
        return {
            showEdit: false,
            editData: this.createEmptyArtifact(),
            isEdit: false,
            selectedIds: [] as number[],
        }
    },
    computed: {
        list() {
            return bus.artifacts
        },
    },
    methods: {
        createEmptyArtifact() {
            return {
                id: Date.now(),
                name: '',
                stars: 0,
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
            bus.artifacts = bus.artifacts.filter((e) => {
                return e.id !== id
            })
        },
        doDeleteSelected() {
            bus.artifacts = bus.artifacts.filter((e) => {
                return !this.selectedIds.includes(e.id)
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
            bus.artifacts = []
            this.selectedIds = []
        },
        doSelect(id: number, status: boolean) {
            if (status) {
                this.selectedIds.push(id)
            } else {
                this.selectedIds = this.selectedIds.filter((e) => e !== id)
            }
        },
        doExport() {
            const convertedJson = convertAsMona(JSON.parse(JSON.stringify(bus.artifacts)))
            clipboard.writeText(convertedJson)
            ElNotification({
                type: 'success',
                title: __('导出成功'),
                message: __('已复制到剪贴板'),
            })
        },
        async doExportToFile() {
            try {
                const { filePath, canceled } = await showSaveDialog({
                    title: __('导出'),
                    filters: [{ name: 'JSON Files', extensions: ['json'] }],
                })
                if (canceled || !filePath) return
                const convertedJson = convertAsMona(JSON.parse(JSON.stringify(bus.artifacts)))
                await fsex.writeFile(filePath, convertedJson)
                ElNotification({
                    type: 'success',
                    title: __('导出成功'),
                })
            } catch (e) {
                console.log(e)
            }
        },
    },
})
</script>
<template>
    <teleport to="#app-title"> {{ __('圣遗物仓库') }} </teleport>
    <teleport to="#app-actions">
        <div class="actions">
            <el-dropdown class="header-plain-dropdown" size="mini" split-button @click="doExport">
                {{ __('导出') }}
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="doExportToFile">{{ __('到文件') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
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
                <el-button size="mini" plain icon="el-icon-remove-outline" @click="selectedIds = []">
                    {{ __('取消选择') }}
                </el-button>
                <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="doDeleteSelected">
                    {{ __('删除选中') }}
                </el-button>
            </template>
            <el-button size="mini" type="primary" plain icon="el-icon-aim" @click="openArtifactView">
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
</style>
