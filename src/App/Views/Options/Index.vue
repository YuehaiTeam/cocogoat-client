<script>
import { ipcRenderer } from 'electron'
export default {
    data() {
        return {}
    },
    methods: {
        checkUpdate() {
            this.$alert('请自行前往 https://github.com/YuehaiTeam/cocogoat 查看新版本', '暂未开放', {
                confirmButtonText: '知道了',
            })
        },
        openDevTools() {
            ipcRenderer.send('devtoolsApp')
        },
    },
}
</script>
<template>
    <teleport to="#app-title"> 设置 </teleport>
    <teleport to="#app-actions"> </teleport>
    <div class="page-main">
        <article>
            <h3>基础</h3>
            <div class="content">
                <div class="opt">
                    <el-switch active-text="发送错误日志，协助我们改进程序"> </el-switch>
                </div>
                <div class="opt">
                    <el-switch active-text="上传圣遗物识别错误与修改日志，帮助我们提高识别率"> </el-switch>
                </div>
            </div>
        </article>
        <article>
            <h3>关于</h3>
            <div class="content">
                <div class="opt title">椰羊cocogoat</div>
                <div class="opt">一个简单的原神工具箱，保证每一行代码都是加班打造。是半仙之兽。</div>
                <div class="opt">&copy; 2021 月海亭 YuehaiTeam</div>
                <br />
                <div class="opt">版本 : v0.2.0 (<a href="javascript:" @click="checkUpdate">检查更新</a>)</div>
            </div>
        </article>
        <article>
            <h3>开发</h3>
            <div class="content">
                <div class="opt">以下功能仅作调试使用</div>
                <el-button size="mini" @click="openDevTools">打开DevTools</el-button>
            </div>
        </article>
    </div>
</template>

<style lang="scss" scoped>
h3 {
    font-weight: normal;
    padding-left: 5px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
}
.content {
    padding: 5px;
    font-size: 13px;
    .opt {
        margin-bottom: 7px;
    }
    .title {
        font-size: 17px;
    }
}
</style>
