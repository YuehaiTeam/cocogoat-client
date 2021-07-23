<script lang="ts">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {},
    data() {
        return {
            loading: true,
        }
    },
    methods: {
        createMapView() {
            ipcRenderer.send('createMapView')
        },
    },
})
</script>
<template>
    <teleport to="#app-title">
        <span>地图</span>
    </teleport>

    <teleport to="#app-actions">
        <div class="actions">
            <el-button size="mini" type="primary" plain icon="el-icon-map-location" @click="createMapView">
                {{ __('悬浮地图') }}
            </el-button>
        </div>
    </teleport>
    <div class="page-main">
        <div class="placeholder">点击右上角按钮，打开悬浮地图</div>
    </div>
</template>

<style lang="scss" scoped>
.placeholder {
    color: #999;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
}

.page-main {
    height: 100%;
}
</style>
