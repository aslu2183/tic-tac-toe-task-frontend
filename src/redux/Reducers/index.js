import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './authenticate'
import gameReducer from './game'

const rootReducer = combineReducers({
    auth: authReducer,
    game: gameReducer
})

export default rootReducer
