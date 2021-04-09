module.exports = {
    pages: {
        app: {
            entry: 'src/App/main.ts',
            template: 'public/index.html',
            filename: 'index.html',
        },
        ArtifactView: {
            entry: 'src/ArtifactView/main.ts',
            template: 'public/index.html',
            filename: 'ArtifactView.html',
        },
    },
    pluginOptions: {
        electronBuilder: {
            externals: ['iohook', 'bindings', 'robotjs', 'tesseract.js'],
            nodeIntegration: true,
            chainWebpackMainProcess: (config) => {
                // Chain webpack config for electron main process only
                config.externals({
                    robotjs: 'commonjs2 robotjs',
                    bindings: 'commonjs2 bindings',
                    iohook: 'commonjs2 iohook',
                    'tesseract.js': 'commonjs2 tesseract.js',
                    'electron-active-window/build/Release/wm.node':
                        'commonjs2 electron-active-window/build/Release/wm.node',
                })
            },
            builderOptions: {
                appId: 'work.cocogoat',
                productName: '椰羊cocogoat',
                copyright: '©2021 YuehaiTeam',
                win: {
                    target: ['dir'],
                    icon: 'build/cocogoat.ico',
                    requestedExecutionLevel: 'requireAdministrator',
                },
                asarUnpack: ['node_modules/robotjs', 'node_modules/iohook', 'node_modules/electron-active-window'],
                afterAllArtifactBuild: 'build/evb.js',
                extraResources: ['./data/**'],
            },
        },
    },
}
