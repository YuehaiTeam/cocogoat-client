<script>
export default {
    emits: ['start'],
}
</script>
<template>
    <section class="intro">
        <div class="left"></div>
        <div class="right">
            {{
                __(
                    '请以窗口模式打开游戏背包圣遗物界面， 将本窗口拖动至游戏上方并调节大小，使圣遗物每项属性恰好位于对应框内。完成调整后，请点击下方按钮或者使用热键（~）开始识别。',
                )
            }}
            <br />
            <el-button @click="$emit('start')">{{ __('开始') }}</el-button>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.right {
    color: #333;
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    bottom: 0;
    padding: 20px;
    box-sizing: border-box;
    text-align: left;
    button {
        width: 100%;
    }
}
</style>
