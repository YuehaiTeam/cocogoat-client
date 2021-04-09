<script>
import { status, STATUS } from '../../status'
export default {
    emits: ['modify', 'delete', 'reset'],
    data() {
        return {
            STATUS,
        }
    },
    computed: {
        status() {
            return status
        },
    },
}
</script>
<template>
    <section>
        <div class="loading" :class="{ show: status.status === STATUS.LOADING }">
            <div class="loading-wrapper">
                <i class="el-icon-loading"></i>
                识别中
            </div>
        </div>
        <div class="box">
            <div
                v-if="status.status === STATUS.SUCCESS && status.potentialErrors.length <= 0"
                class="status status-success"
            >
                <i class="el-icon-success"></i> 识别成功
            </div>
            <div v-if="status.status === STATUS.MODIFIED" class="status status-success">
                <i class="el-icon-success"></i> 修改成功
            </div>
            <div v-if="status.status === STATUS.DELETED" class="status status-success">
                <i class="el-icon-success"></i> 删除成功
            </div>

            <div
                v-if="status.status === STATUS.SUCCESS && status.potentialErrors.length > 0"
                class="status status-maybe-wrong"
            >
                <i class="el-icon-question"></i> 疑似有误
            </div>
            <div v-if="status.status === STATUS.ERROR" class="status status-error">
                <i class="el-icon-error"></i> 识别失败
            </div>
            <div class="actions-btn">
                <el-button @click="$emit('delete')"> 删除 </el-button>
                <el-button @click="$emit('reset')"> 重置 </el-button>
                <el-button @click="$emit('modify')"> 保存 </el-button>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.loading {
    z-index: 3;
    text-align: center;
    background: #e4dcd0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 25px;
    line-height: 100%;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s;
    &.show {
        opacity: 1;
        pointer-events: all;
    }
    .loading-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        margin-top: -13px;
    }
}

.box {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin-top: -20px;
    padding: 0px 15px;
    z-index: 1;
}

.status {
    display: inline-block;
    vertical-align: middle;
    height: 40px;
    line-height: 40px;
    font-size: 5vw;
    i {
        font-size: 7vw;
        position: relative;
        top: 5px;
    }
}

.actions-btn {
    vertical-align: middle;
    float: right;
}

.status-success {
    color: #008033;
}

.status-error {
    color: #e94766;
}

.status-maybe-wrong {
    color: #b86935;
}
</style>
