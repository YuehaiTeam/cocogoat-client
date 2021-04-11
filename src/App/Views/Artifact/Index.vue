<script lang="ts">
import Artifact from './Components/Artifact.vue'
import { Artifact as ArtifactType } from '@/typings/Artifact'
import ArtifactEditPanel from './Components/EditPanel.vue'
import { openArtifactView } from '../../ipc'
import { ElNotification } from 'element-plus'
import { artifactPush, bus } from '@/App/bus'
import { convertAsMona } from '../../export/Mona'
import { clipboard } from 'electron'
import { defineComponent } from 'vue'
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
        openArtifactView() {
            ElNotification({
                type: 'info',
                title: '正在打开圣遗物识别工具',
                message: '请确保原神已经运行',
                duration: 5000,
            })
            openArtifactView()
        },
        doDelete(id: number) {
            bus.artifacts = bus.artifacts.filter((e) => {
                return e.id !== id
            })
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
        },
        doExport() {
            const convertedJson = convertAsMona(JSON.parse(JSON.stringify(bus.artifacts)))
            clipboard.writeText(convertedJson)
            ElNotification({
                type: 'success',
                title: '导出成功',
                message: '已复制到剪贴板',
            })
        },
    },
})
</script>
<template>
    <teleport to="#app-title"> 圣遗物仓库 </teleport>
    <teleport to="#app-actions">
        <el-button size="mini" plain icon="el-icon-plus" @click="doCreate">添加</el-button>
        <el-tooltip class="item" effect="light" content="导出为兼容『莫娜占卜铺』的JSON格式" placement="bottom">
            <el-button size="mini" plain icon="el-icon-download" @click="doExport">导出</el-button> </el-tooltip
        ><el-popconfirm
            confirmButtonText="确定"
            cancelButtonText="算了"
            icon="el-icon-warning"
            title="真的要清空吗？"
            confirmButtonType="danger"
            @confirm="doClear"
        >
            <template #reference>
                <el-button size="mini" type="danger" plain icon="el-icon-delete">清空</el-button>
            </template>
        </el-popconfirm>
        <el-button size="mini" type="primary" plain icon="el-icon-aim" @click="openArtifactView"> 识别 </el-button>
    </teleport>
    <div class="page-main">
        <artifact v-for="i in list" :key="i.id" :artifact="i" @delete="doDelete" @edit="doEdit" />
        <div v-if="list.length <= 0" class="emptyState">
            <el-empty description="工作…工作还没做完…真的可以提前休息吗？"></el-empty>
        </div>
    </div>
    <artifact-edit-panel
        v-model:show="showEdit"
        :title="isEdit ? '编辑圣遗物' : '添加圣遗物'"
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
