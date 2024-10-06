import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { move_position as MoveDispatch, set_player } from 'src/redux/Reducers/game'
import {reset as ResetDispatch, set_player as SetPlayerDispatch } from 'src/redux/Reducers/game'
import Api from 'src/helpers/Api'
import { dangerAlert, successAlert } from 'src/helpers/Alerts'
import { customizeErrors } from 'src/helpers/Utils'
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography'


const PlayGround = () => {
    const board = useSelector(state => state.game.board);
    const currentPlayer = useSelector(state => state.game.currentPlayer);
    const selectedPlayer = useSelector(state => state.game.selectedPlayer);
    const dispatch = useDispatch();

    const handleClick = async(row, col) => {
        const newBoard = [...board];
        if (newBoard[row][col] === 0) {
            const cell = [...newBoard[row]]
            cell[col]  = selectedPlayer === 'X' ? -1 : 1 
            newBoard[row] = [...cell]
            await handle_cursor(newBoard, selectedPlayer)
        }
    } 
    
    const reset = () => {
        dispatch(ResetDispatch());
    };

    const startGame = async(selectedUser) => {
        dispatch(SetPlayerDispatch({set_player:selectedUser}))
        if(selectedUser === 'O'){
            await handle_cursor(board, 'O')
        }
    }

    const handle_cursor = async(board,currentPlayer) =>  {
        try{
            const { data } = await Api().post('user/v1/move-position',{board, player:currentPlayer})
            const newBoard = [...board]
            if(data?.nextMove){
                const row  = data.nextMove[0]
                const col  = data.nextMove[1]
            
                console.log("Row ",row, "Column ",col)
                console.log("Board ",board)

                const cell     = [...newBoard[row]]
                cell[col]      = data.nextPlayer === 'X' ? -1 : 1
                newBoard[row]  = [...cell]

                console.log("Board ",newBoard)
            }    
            const values = {
                nextPlayer : data.nextPlayer,
                board      : newBoard
            }
            dispatch(MoveDispatch(values));
        }
        catch(error){
            const message = (error?.response ? error.response.data.message : error?.message||'Undefined Error')
            dangerAlert('Network Error',message)
        }
    }

    
 
    return (
        <Box className='content-center'>
            {!selectedPlayer && (<Box sx={{display: 'flex', flexDirection:'column',alignItems: 'center', justifyContent: 'center',py:2}}>
                <Typography
                    variant='h6'
                    sx={{
                        ml: 3,
                        lineHeight: 1,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '1.5rem !important',
                        mb:5
                    }}>
                    Who will start first ?    
                </Typography>
                <Box sx={{display: 'flex'}}>
                    <LoadingButton
                        size='large'
                        variant='contained'
                        sx={{ marginTop:2, marginBottom:2,marginRight:2 }}
                        onClick={() => startGame('X')}>
                        Player
                    </LoadingButton>
                    <LoadingButton
                        size='large'
                        variant='contained'
                        sx={{ marginTop:2, marginBottom:2,backgroundColor:'red' }}
                        onClick={() => startGame('O')}>
                        Computer
                    </LoadingButton>
                </Box>
            </Box>  )}  

            {selectedPlayer && (<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center',flexDirection:'column'}}>
                {board.map((row, rowIndex) => (
                    <Box key={rowIndex} sx={{border:'1px solid #ccc',display:'flex',flexDirection:'row'}}>
                        {row.map((cell, colIndex) => (
                        <Box 
                            key={colIndex} 
                            sx={{width:100,height:100,borderRight:'1px solid #ccc',justifyContent:'center',alignItems:'center',display:'flex'}}
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                            {cell === -1 ? 'X' : cell === 1 ? 'O' : ""}
                        </Box>
                        ))}
                    </Box>
                ))}
                <LoadingButton
                    size='large'
                    variant='contained'
                    sx={{ marginTop:2, marginBottom:2 }}
                    onClick={() => reset()}>
                    Reset Game
                </LoadingButton>
            </Box>)}
        </Box>
    )
}

export default PlayGround