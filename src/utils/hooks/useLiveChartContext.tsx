import React, { useContext, useReducer, createContext, ReactNode } from "react";
import { createRandomEvent } from "../utils";

interface Event {
  index: number;
  value1: number;
  value2: number;
  comment: string;
}

interface State {
  events: Event[];
  paused: boolean;
  currentPage?: number;
}

type Action =
  | { type: "new_event"; payload: Event }
  | { type: "toggle_pause" }
  | { type: "update_event"; payload: { index: number; update: Partial<Event> } }
  | { type: "reset_events" }
  | { type: "change_page"; payload: { page: number } };

interface ContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  togglePause: () => void;
  updateEvent: (index: number, valueType: keyof Event, newValue: any) => void;
  resetEvents: () => void;
}

const LiveChartContext = createContext<ContextType | undefined>(undefined);

const initialEvents: Event[] = Array.from({ length: 50 }, (_, ix) =>
  createRandomEvent(ix)
);

const initialState: State = {
  events: initialEvents,
  paused: false,
};

const liveChartReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "new_event":
      if (!state.paused) {
        return { ...state, events: [...state.events, action.payload] };
      }
      return state;

    case "toggle_pause":
      return { ...state, paused: !state.paused };

    case "update_event":
      const updatedEvents = state.events.map((event, index) =>
        index === action.payload.index
          ? { ...event, ...action.payload.update }
          : event
      );
      return { ...state, events: updatedEvents };

    case "change_page":
      return { ...state, currentPage: action.payload.page };

    case "reset_events":
      return { ...state, events: initialEvents };

    default:
        throw new Error(`Unhandled action type: ${(action as Action).type}`);
  }
};

const LiveChartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(liveChartReducer, initialState);

  const togglePause = () => dispatch({ type: "toggle_pause" });

  const updateEvent = (
    index: number,
    valueType: keyof Event,
    newValue: any
  ) => {
    dispatch({
      type: "update_event",
      payload: {
        index,
        update: { [valueType]: newValue },
      },
    });
  };

  const resetEvents = () => dispatch({ type: "reset_events" });

  return (
    <LiveChartContext.Provider
      value={{ state, dispatch, togglePause, updateEvent, resetEvents }}>
      {children}
    </LiveChartContext.Provider>
  );
};

const useLiveChartContext = (): ContextType => {
  const context = useContext(LiveChartContext);
  if (!context) {
    throw new Error(
      "useLiveChartContext must be used within a LiveChartProvider"
    );
  }
  return context;
};

export { LiveChartProvider, useLiveChartContext };
