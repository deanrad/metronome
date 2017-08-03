import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import './index.css';
import { default as App, makeAppProps, defaultKey } from './App';
import registerServiceWorker from './registerServiceWorker';
import { AntaresInit } from 'antares-protocol';
import { metronomeReducer, metronomeInitialState, viewReducer } from './reducer'
import { Speech } from './actions'

// target every action to a key called
const assignKey = () => ({ key: defaultKey })

// Let's Initialize Antares!
//
// ReducerForKey: provides our reducer to Antares whenever it is asked
// MetaEnhancers: functions which, in our case, add routing information
//                to the outgoing actions - namely the key of the record
//                we are acting upon.

// An action object is a JavaScript literal with fields:
//    type: string - indicates what action to be taken
//    payload: object - the parameters of this action, as an Object
//    meta: object - the routing info (key), and any other metadata
//        Not intended to become part of the store
//
// We reduce an action into the store (aka dispatch) by calling 'process'

// Let's Initialize Antares, already !
const Antares = AntaresInit({
    ReducerForKey: () => metronomeReducer,
    MetaEnhancers: [assignKey],
    ViewReducer: viewReducer
})

// And get these fields back for calling and debugging
const { process, announce } = Antares

let recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition()
    let finalTranscript = ''
    recognition.onresult = function (event) {

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript
            }
        }
    }
    recognition.onend = () => {
        process( Speech.stop({ lastResult: finalTranscript }) )
    }

            // hook it up to antares
    Antares.subscribeRenderer(({ action: { type } }) => {
        if (!type.startsWith('View.Speech.')) return

        if (type === 'View.Speech.start') {
            // turn it on
            recognition.start()
        }
    })
}

Object.assign(window, {
    Antares,
    metronomeReducer
})

// Let's tell Antares to store our initialState
process({
    type: 'Antares.store',
    payload: metronomeInitialState
})

// The State Shape of an Antares store has two top-level immutable objects:
//   antares - in which shared client/server data are stored under keys
//   view - in which any non-shared view parameters of those data under antares are stored
const ConnectedApp = connect(makeAppProps, () => ({ process, announce }))(App)
ReactDOM.render(<ConnectedApp store={Antares.store} />, document.getElementById('root'));
registerServiceWorker();