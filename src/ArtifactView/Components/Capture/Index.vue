<script>
import { status, STATUS } from '../../status'
import Intro from './Intro'
import Actions from './Actions'
import RecognizeResult from './RecognizeResult'
export default {
    components: {
        Intro,
        Actions,
        RecognizeResult,
    },
    emits: ['start', 'modify', 'delete', 'reset', 'feedback', 'transparent'],
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
    methods: {
        getPosition() {
            const pos = {}
            for (let i in this.$refs) {
                if (i.indexOf('overlay.') === 0) {
                    const key = i.replace('overlay.', '')
                    const el = this.$refs[i]
                    const { left, top, right, bottom } = el.getBoundingClientRect()
                    pos[key] = {
                        x: Math.floor(left + 2.5),
                        y: Math.floor(top + 2.5),
                        w: Math.floor(right - left - 4),
                        h: Math.floor(bottom - top - 4),
                    }
                }
            }
            return pos
        },
    },
}
</script>

<template>
    <section ref="overlay.title" class="overlay overlay-title"></section>
    <section ref="overlay.color" class="overlay overlay-color"></section>
    <section class="overlay overlay-type"></section>
    <section ref="overlay.main" class="overlay overlay-main"></section>
    <section ref="overlay.level" class="overlay overlay-level"></section>
    <section ref="overlay.sub" class="overlay overlay-sub"></section>
    <section
        ref="overlay.lock"
        class="overlay overlay-lock"
        @mouseenter="$emit('transparent', true)"
        @mouseleave="$emit('transparent', false)"
    ></section>
    <section class="overlay overlay-user">
        <section ref="overlay.user" class="overlay-user-in"></section>
    </section>
    <section class="float">
        <intro :class="{ show: status.status === STATUS.INTRO }" @start="$emit('start')" />
        <recognize-result class="recognize-result" :class="{ show: status.status !== STATUS.LOADING }" />
        <button
            v-if="status.status !== STATUS.LOADING && status.options.sendWrongOCRReports && status.wrongReportData"
            class="feedback"
            @click="$emit('feedback')"
        >
            {{ __('识别错了？点此反馈') }}
        </button>
    </section>
    <section class="actions">
        <actions
            v-show="status.status !== STATUS.INTRO"
            @modify="$emit('modify')"
            @delete="$emit('delete')"
            @reset="$emit('reset')"
        />
    </section>
</template>

<style lang="scss" scoped>
.recognize-result {
    display: none;
    &.show {
        display: block;
    }
}
.overlay-title {
    top: 0;
    left: 0;
    right: 0;
    height: 6.5%;
    border-bottom: 2px solid;
}

.overlay {
    position: absolute;
    border-color: #007acc !important;
}

.overlay-type {
    top: 7%;
    left: 2.2%;
    width: 20%;
    height: 3.5%;
    border: 2px solid;
}
.overlay-color {
    top: 2%;
    right: 12%;
    width: 2%;
    height: 1.3%;
    border: 2px solid;
    border-color: transparent !important;
}
.overlay-user {
    left: 0;
    right: 0;
    bottom: 9.5%;
    height: 6.5%;
    border-top: 2px solid;
    border-bottom: 2px solid;
    section.overlay-user-in {
        position: absolute;
        left: 15%;
        top: 0;
        right: 0;
        bottom: 0;
    }
}
.overlay-sub {
    left: 9%;
    right: 0;
    top: 37%;
    height: 17.5%;
    border-top: 2px solid;
    border-bottom: 2px solid;
    border-left: 2px solid;
}
.overlay-lock {
    left: 86.2%;
    right: 4.6%;
    top: 32.3%;
    height: 4.7%;
    border-top: 2px solid;
    border-right: 2px solid;
    border-left: 2px solid;
}

.overlay-level {
    width: 16%;
    top: 32.3%;
    height: 4%;
    left: 3%;
    border: 2px solid;
}

.overlay-main {
    top: 14%;
    left: 2.5%;
    width: 42%;
    height: 11%;
    border: 2px solid;
}

.float {
    position: absolute;
    left: 0;
    right: 0;
    background: #ece5d8;
    top: 55%;
    height: 28.5%;
    .intro {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 2;
        transition: all 0.5s;
        background: #ece5d8;
        pointer-events: none;
        opacity: 0;
        &.show {
            pointer-events: all;
            opacity: 1;
        }
    }
}

.actions {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 9.5%;
    background: #ece5d8;
}
.feedback {
    background: #007acc;
    color: #fff;
    border: 0;
    padding: 3px 8px;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: pointer;
    outline: 0;
    &:hover {
        opacity: 0.9;
    }
}
</style>
