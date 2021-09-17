const SentryPlugin = require('@sentry/webpack-plugin')
const path = require('path')
const fsex = require('fs-extra')
const packageJSON = fsex.readJSONSync(path.join(__dirname, 'package.json'))
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
        ArtifactSwitch: {
            entry: 'src/ArtifactSwitch/main.ts',
            template: 'public/index.html',
            filename: 'ArtifactSwitch.html',
        },
        MapView: {
            entry: 'src/MapView/main.ts',
            template: 'public/index.html',
            filename: 'MapView.html',
        },
        MapScan: {
            entry: 'src/MapScan/main.ts',
            template: 'public/index.html',
            filename: 'MapScan.html',
        },
    },
    pluginOptions: {
        electronBuilder: {
            externals: ['iohook', 'bindings', 'robotjs', 'ffi-napi', 'ref-napi'],
            nodeIntegration: true,
            chainWebpackMainProcess: (config) => {
                // source map
                config.devtool('sourcemap')
                // worker entry
                config.entry('background_worker').add('./src/background_worker.ts').end()
                // Chain webpack config for electron main process only
                config.externals({
                    iohook: 'commonjs2 iohook',
                    'ffi-napi': 'commonjs2 ffi-napi',
                    'ref-napi': 'commonjs2 ref-napi',
                    'electron-active-window/build/Release/wm.node':
                        'commonjs2 electron-active-window/build/Release/wm.node',
                    // make binary out for viggemclient
                    'vigemclient/build/Release/vigemclient': 'commonjs2 vigemclient/build/Release/vigemclient.node',
                    '../build/Release/vigemclient': 'commonjs2 vigemclient/build/Release/vigemclient.node',
                    // make binary out for robotjs
                    './build/Release/robotjs.node': 'commonjs2 robotjs/build/Release/robotjs.node',
                })
                /* Sentry: source map uploading */
                if (process.env.NODE_ENV === 'production' && process.env.BUILD_TYPE === 'REL') {
                    config.plugin('sentry').use(SentryPlugin, [
                        {
                            url: process.env.SENTRY_URL,
                            authToken: process.env.SENTRY_KEY,
                            org: 'yuehaiteam',
                            project: 'cocogoat',
                            ignore: ['node_modules'],
                            include: './dist_electron/bundled',
                            release: packageJSON.version,
                            setCommits: {
                                auto: true,
                            },
                            urlPrefix: '~/',
                        },
                    ])
                }
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
                asarUnpack: [
                    'node_modules/robotjs',
                    'node_modules/iohook',
                    'node_modules/ref-napi',
                    'node_modules/ffi-napi',
                    'node_modules/vigemclient',
                    'node_modules/electron-active-window',
                    'background_worker.js',
                ],
                afterAllArtifactBuild: 'build/evb.js',
                extraResources: ['./data/**'],
                files: [
                    '**/*',
                    '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
                    '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
                    '!**/node_modules/*.d.ts',
                    '!**/node_modules/.bin',
                    '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj,vcxproj,pdb,ipdb,tlog,iobj}',
                    '!.editorconfig',
                    '!**/._*',
                    '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
                    '!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output,.vscode,.github}',
                    '!**/{appveyor.yml,.travis.yml,circle.yml}',
                    '!**/.github/**',
                    '!**/deps/libffi/**', // ffi's source code is not needed
                    '!**/*.map', // source map is not important
                    '!**/zlibjs/**', // zlibjs is not used during runtime
                    '!**/node_modules/nan/**', // nan is not used during runtime
                    '!**/prebuild-install/**', // prebuild-install is not used during runtime

                    '!**/node_modules/vigemclient/**', // js of vigem is packed by webpack
                    '**/node_modules/vigemclient/**/*.node', // but node is not
                    '**/node_modules/vigemclient/**/*.dll', // and dll

                    '!**/node_modules/robotjs/**', // js of robotjs is packed by webpack
                    '**/node_modules/robotjs/**/*.node', // but node is not

                    '!**/node_modules/electron-active-window/**', // js of electron-active-window is packed by webpack
                    '**/node_modules/electron-active-window/**/*.node', // but node is not
                ],
            },
        },
    },
    chainWebpack: (config) => {
        /* 阻止webpack自作主张预处理emcc编译的wasm */
        config.module
            .rule('wasm')
            .test(/opencv\.wasm$/)
            .type('javascript/auto')
            .use('file-loader')
            .loader('file-loader')
            .end()
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap((options) => {
                options.compilerOptions = options.compilerOptions || {}
                options.compilerOptions.isCustomElement = (tag) => {
                    return tag === 'webview'
                }
                return options
            })
    },
}
