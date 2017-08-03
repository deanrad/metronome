export const Timer = {
    start() {
        return {
            type: 'Timer.start'
        }
    },
    pause() {
        return {
            type: 'Timer.pause'
        }

    },
    stop() {
        return {
            type: 'Timer.stop'
        }

    }
}

export const Speech = {
    start() {
        return {
            type: 'View.Speech.start'
        }
    },
    stop(payload) {
        return {
            type: 'View.Speech.stop',
            payload
        }
    }
}