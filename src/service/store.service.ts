import { createStore } from "redux";
import { combineReducers } from "redux";

enum actionsType {
    ADD_USER,
    DELETE_USER,
    ADD_SOCKET,
    DELET_SOCKET
}

const initialState = {};

function Auth(state = initialState, action) { // reduce
    switch (action.type) {
        case actionsType.ADD_USER: {
            
            return action.params;
        }
        case actionsType.DELETE_USER:{
            return initialState
        }
        default:
            return state;
    }
}

function Socket(state = initialState, action) { // reduce
    switch (action.type) {
        case actionsType.ADD_SOCKET:{
            return action.params
        }
        case actionsType.DELET_SOCKET:{
            return initialState
        }
        default:
            return state;
    }
}

export const addUser = (params) => ({
    type: actionsType.ADD_USER,
    params:params
})

export const deleteUser = () => ({
    type: actionsType.DELETE_USER
})

export const getStore = (store)=> {
    return store;
}

export const addSocket = (params) => ({
    type: actionsType.ADD_SOCKET,
    params:params
})

export const deleteSocket = () => ({
    type: actionsType.DELET_SOCKET
})

export const store =createStore(combineReducers({Auth,Socket}));
