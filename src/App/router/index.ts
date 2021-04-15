import { createRouter, createWebHashHistory } from 'vue-router'
import ArtifactIndex from '../Views/Artifact/Index.vue'
import OptionsIndex from '../Views/Options/Index.vue'
import MonaFrame from '../Views/Frames/MonaFrame.vue'
const routes = [
    {
        path: '/',
        redirect: '/artifacts',
    },
    {
        path: '/artifacts',
        name: 'Artifacts',
        component: ArtifactIndex,
    },
    {
        path: '/mona',
        name: 'MonaFrame',
        component: MonaFrame,
    },
    {
        path: '/options',
        name: 'Options',
        component: OptionsIndex,
    },
]

export const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
})
