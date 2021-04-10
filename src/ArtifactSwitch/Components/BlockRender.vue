<script>
export default {
    props: {
        blocks: {
            type: Array,
            default: () => [],
        },
    },
}
</script>
<template>
    <section class="block-render">
        <u
            v-for="(i, a) in blocks"
            :key="a"
            :style="{ top: i.y + 'px', left: i.x + 'px', width: i.width + 'px', height: i.height + 'px' }"
        ></u>
    </section>
</template>

<style lang="scss" scoped>
.block-render {
    position: absolute;
    top: 0;
    left: -2px;
    bottom: 0;
    right: 0;
    overflow: hidden;
    pointer-events: none;
}

u {
    position: absolute;
    z-index: 5;
    top: 701px;
    left: 844px;
    width: 8px;
    height: 8px;
    border: 2px solid #007acc;
    opacity: 0.4;
    background: #007acc;
}
</style>
