import _ from 'lodash'
const en = require('./locales/en_artifacts.json')
export const ArtifactReverse = {
    names: {
        ..._.invert(en.names),
    },
    params: {
        ..._.invert(en.params),
    },
}
