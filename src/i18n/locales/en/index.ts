export default {
    __name: 'English',
    '': {
        language: 'en',
        plurals: {
            text: 'nplurals = 2; plural = (n > 1)',
            func(n: number) {
                return n > 1
            },
        },
    },
    '语言(Language)': 'Language(语言)',

    /* Main app */

    // Title
    椰羊cocogoat: 'Cocogoat',

    // Menu
    圣遗物: 'Artifacts',
    占卜铺: 'Optimizer',
    设置: 'Options',

    // Artifact page
    添加: 'Add',
    导出: 'Export',
    修改: 'Edit',
    删除: 'Delete',
    清空: 'Delete all',
    识别: 'Recognize',
    确定: 'YES',
    保存: 'Save',
    重置: 'Reset',
    算了: 'Later',
    圣遗物仓库: 'Artifacts',
    '真的要清空吗？': 'Do you really want to delete all?',
    正在打开圣遗物识别工具: 'Opening artifact scanning tool',
    请确保原神已经运行: 'Please ensure genshin impact is running.',
    导出成功: 'Data exported',
    已复制到剪贴板: 'Results copied to clipboard.',
    编辑圣遗物: 'Edit artifact',
    添加圣遗物: 'Add artifact',
    副词条: 'Substats',
    添加副词条: 'Add substat',

    // Options page
    基础: 'Basic',
    检查更新: 'Check for updates',
    已经是最新版本: `You're already on the latest version`,
    '这些选项将在程序重启后生效。': 'The options below will take effects after a reload.',
    '发送错误日志，协助我们改进程序': 'Send error reports to help us fixing bugs',
    启用OCR识别错误反馈功能: 'Show feedback button on OCR page',
    '这些选项将在下次打开识别器或切换器时生效。':
        'The options below will take effects when you open recognizor or switcher next time.',
    保留重复识别: 'Keep same artifacts',
    '得到两个完全一致的圣遗物的概率是多少呢？': 'Enable this if you have two same artifacts.',
    独立切换模式: 'Standalone switcher',
    '允许在关闭识别器时，保留切换器窗口以配合其他工具使用。':
        'Enable this to use the switcher standalone or work with third party softwares.',
    '圣遗物切换器每次点击（并识别完成）后切换到下一个的间隔。':
        'The delay before switching to the next artifact after scanning one.',
    '可用于人工检查识别准确性，或关闭识别器窗口并配合其他工具使用。':
        'Useful if you want to check errors manually or use standalone switcher with other tools. ',
    自动切换延迟: 'Auto switching delay',
    关于: 'About us',
    秒: 'second(s)',

    '一个简单的原神工具箱，保证每一行代码都是加班打造。是半仙之兽。':
        'A simple toolbox for Genshin Impact with every line of code made by working overtime.',

    // sayings
    '工作…工作还没做完…真的可以提前休息吗？':
        'Should we really be off work this early? There is still a lot left to do...',
    '趴在草地上，能听见大地的心跳...': 'If you lie on the grass, you can feel the heartbeat of the world.',
    开发模式无法自动更新: 'Autoupgrade is disabled in development mode.',
}
