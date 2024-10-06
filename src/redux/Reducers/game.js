import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
    board: Array(3).fill(Array(3).fill(0)),
    currentPlayer: "",
    status: "Ongoing",
    selectedPlayer:""
};

const gameSlice = createSlice({
    name: "playboard",
    initialState: initialState,
    reducers: {
        move_position: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                board: payload.board,
                currentPlayer: payload.nextPlayer,
            }
        },
        update_status: (state,action) => {
            return {
                ...state,
                status: action.payload.status
            }
        },
        set_player:(state,action) => {
            return {
                ...state,
                selectedPlayer: action.payload.set_player
            }
        },
        reset: (state, action) => {
            return initialState;
        },
    }
})

export const { move_position, update_status, reset, set_player } = gameSlice.actions
export default gameSlice.reducer
