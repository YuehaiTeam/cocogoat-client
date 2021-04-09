<script lang="ts">
import Artifact from './Components/Artifact.vue'
import { openArtifactView } from '../../ipc'
import { ElNotification } from 'element-plus'
import { bus } from '@/App/bus'
import { convertAsMona } from '../../export/Mona'
import { clipboard } from 'electron'
export default {
    components: {
        Artifact,
    },
    data() {
        return {}
    },
    computed: {
        list() {
            return bus.artifacts
        },
    },
    methods: {
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
}
</script>
<template>
    <teleport to="#app-title"> 圣遗物仓库 </teleport>
    <teleport to="#app-actions">
        <el-button size="mini" plain icon="el-icon-plus">添加</el-button>
        <el-tooltip class="item" effect="light" content="导出为兼容『莫娜占卜铺』的JSON格式" placement="bottom">
            <el-button size="mini" plain icon="el-icon-download" @click="doExport">导出</el-button>
        </el-tooltip>
        <el-button size="mini" type="primary" plain icon="el-icon-aim" @click="openArtifactView">
            圣遗物识别
        </el-button>
    </teleport>
    <div class="page-main">
        <artifact v-for="i in list" :key="i.id" :artifact="i" @delete="doDelete" />
        <div v-if="list.length <= 0" class="emptyState">
            <el-empty description="工作…工作还没做完…真的可以提前休息吗？"></el-empty>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.emptyState {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
