import { App } from 'vue'
import * as Sentry from '@sentry/electron'
import { IConfig, EBuild } from '@/typings/config'
import { Vue as VueIntegration } from '@sentry/integrations'

export function initSentry(config: IConfig, app: App) {
    if (config.options.sendErrorReports && process.env.NODE_ENV !== 'development') {
        // @ts-ignore
        Sentry.init({
            dsn: process.env.VUE_APP_SENTRY,
            environment: config.build?.type,
            release: config.build?.type === EBuild.REL ? config.version : undefined,
            integrations: [
                // @ts-ignore
                new VueIntegration({
                    // @ts-ignore
                    Vue: app,
                    attachProps: true,
                }),
            ],
        })
    }
}
