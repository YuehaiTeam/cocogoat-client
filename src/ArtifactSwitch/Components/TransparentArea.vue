<script>
import { bus, STATUS } from '../bus'
import BlockRender from './BlockRender'
import { setTransparent } from '../ipc'
export default {
    components: {
        BlockRender,
    },
    computed: {
        blocks() {
            return bus.blocks
        },
        showBlocks() {
            return bus.status !== STATUS.CAPTURE && bus.status !== STATUS.PAGING
        },
    },
    methods: {
        setTransparent,
    },
}
</script>
<template>
    <div class="transparent" @mouseenter="setTransparent(true)" @mouseleave="setTransparent(false)">
        <block-render v-show="showBlocks" :blocks="blocks" />
    </div>
</template>

<style lang="scss" scoped>
.transparent {
    position: absolute;
    top: 80px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    z-index: 1;
}
</style>
