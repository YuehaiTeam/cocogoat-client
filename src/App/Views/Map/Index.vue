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
    <div class="page-main"></div>
</template>

<style lang="scss" scoped></style>
