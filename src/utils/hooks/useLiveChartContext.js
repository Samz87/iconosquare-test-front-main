import React, { useContext, useReducer, createContext } from 'react';
import { createRandomEvent } from '../utils';

const LiveChartContext = createContext();

const initialEvents = Array.from(Array(50)).map((_, ix) => createRandomEvent(ix));

const initialData = {
    events: initialEvents,
    paused: false,
}

const liveChartReducer = (state, action) => {
    switch (action.type) {
        case 'new_event':
            if (!state.paused) {
                return {
                    events: [...state.events, action.payload],
                }
            }
            return state;

        // Add a new case to handle the 'toggle_pause' action type
        case 'toggle_pause':
            return {
                ...state,
                paused: !state.paused
            };

        // Add a new case to handle the 'update_event' action type
        case 'update_event':
            const updatedEvents = state.events.map((event, index) => {
                if (index === action.payload.index) {
                    return { ...event, ...action.payload.update };
                }
                return event;
            });
            return {
                ...state,
                events: updatedEvents
            };

        // Add a new case to handle the 'change_page' action type
        case 'change_page':
            return {
                ...state,
                currentPage: action.payload.page,
            };
            
        // Add a new case to handle the 'reset_events' action type    
        case 'reset_events':
            return {
                ...state,
                events: initialEvents
            };

        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

const LiveChartProvider = ({ children }) => {
    const [data, dispatch] = useReducer(liveChartReducer, initialData);

    const togglePause = () => {
        dispatch({ type: 'toggle_pause' });
    }

    const updateEvent = (index, valueType, newValue) => {
        dispatch({
            type: 'update_event',
            payload: {
                index,
                update: {
                    [valueType]: newValue
                }
            }
        });
    };

    const resetEvents = () => {
        dispatch({ type: 'reset_events' });
    };

    return (
        <LiveChartContext.Provider
            value={{
                data,
                dispatch,
                togglePause,
                updateEvent,
                resetEvents
            }}>
            {children}
        </LiveChartContext.Provider>
    );
};

const useLiveChartContext = () => {
    const context = useContext(LiveChartContext);
    if (!context) {
        throw new Error('useLiveChartContext should be used within an LiveChartProvider');
    }

    return context;
};

export { LiveChartProvider, useLiveChartContext };
