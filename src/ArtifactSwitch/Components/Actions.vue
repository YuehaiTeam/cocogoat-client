<script>
import { bus, STATUS } from '../bus'
export default {
    emits: ['pagedown', 'detectonce', 'startauto'],
    computed: {
        bus: () => bus,
        STATUS: () => STATUS,
        statusText() {
            switch (bus.status) {
                case STATUS.CAPTURE:
                    return '正在检测'
                case STATUS.CLICK:
                    return '正在切换'
                case STATUS.PAGING:
                    return '正在翻页'
                default:
                    return '准备中'
            }
        },
    },
}
</script>
<template>
    <div class="actions">
        <div class="left-btn">
            <button v-if="bus.status === STATUS.CAPTURE && !bus.auto" size="mini">
                <i class="el-icon-loading"></i>
                检测中
            </button>
            <button v-if="bus.status !== STATUS.CAPTURE && !bus.auto" size="mini" @click="$emit('detectonce')">
                <i class="el-icon-location-information"></i>
                尝试检测
            </button>
            <button v-if="!bus.intro && !bus.auto" size="mini" @click="$emit('startauto')">
                <i class="el-icon-s-flag"></i>
                开始切换
            </button>
            <div v-if="bus.auto" class="autotext">
                <i class="el-icon-loading"></i>
                {{ statusText }}，按热键(~)停止
            </div>
        </div>
        <div class="right-status">
            <div v-if="bus.status === STATUS.ERROR" class="error">检测失败</div>
            <div v-else>
                当前页
                <span class="num">{{ bus.currentCount }}</span> 个 &nbsp;&nbsp; 总第
                <span class="num">{{ bus.checkedCount }}</span> / <span class="num">{{ bus.totalCount }}</span> 个
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.actions {
    background: #007acc;
    position: absolute;
    top: 30px;
    left: 2px;
    right: 2px;
    height: 50px;
    box-sizing: border-box;
    .right-status {
        position: absolute;
        right: 10px;
        top: 0;
        bottom: 0;
        line-height: 50px;
        color: #fff;
        font-size: 17px;
        .num {
            font-size: 1.5rem;
        }
    }
    .left-btn {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        .autotext {
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            line-height: 50px;
            color: #fff;
            font-size: 17px;
            width: 50vw;
        }
        button {
            width: 125px;
            outline: 0;
            background: transparent;
            color: #fff;
            height: 100%;
            display: inline-block;
            border: 0;
            font-size: 17px;
            padding: 0px 15px;
            cursor: pointer;
            user-select: none;
            &:hover {
                background: rgba(255, 255, 255, 0.15);
            }
        }
    }
}
</style>
