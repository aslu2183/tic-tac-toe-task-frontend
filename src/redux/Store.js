import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer,FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import rootReducer from './Reducers';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['game']
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: pReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    })
})
export const persistor = persistStore(store);
