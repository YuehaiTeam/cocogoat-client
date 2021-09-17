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
        createRouteExtractView() {
            ipcRenderer.send('createRouteExtractView')
        },
    },
})
</script>
<template>
    <teleport to="#app-title">
        <span>{{ __('地图') }}</span>
    </teleport>

    <teleport to="#app-actions">
        <div class="actions">
            <el-button size="mini" type="primary" plain icon="el-icon-map-location" @click="createMapView">
                {{ __('悬浮地图') }}
            </el-button>
        </div>
    </teleport>
    <div class="page-main">
        <div class="placeholder">
            <div>
                {{ __('点击右上角按钮，打开悬浮地图') }}
                <!--el-button
                    class="createRouteExtractView"
                    size="mini"
                    plain
                    icon="el-icon-video-camera-solid"
                    @click="createRouteExtractView"
                >
                    {{ __('视频导航数据提取') }}
                </el-button-->
            </div>
        </div>
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
.createRouteExtractView {
    display: block;
    margin: 0 auto;
    margin-top: 10px;
}

.page-main {
    height: 100%;
}
</style>
