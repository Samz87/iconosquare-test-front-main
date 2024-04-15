import React, { useState, useEffect } from "react";
import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";
import { ChartEvent } from "../utils/interfaces/ChartEvent"; 
interface LiveTableProps {
  editInfo: {
    index: number | null;
    type: keyof ChartEvent | null;
    data: { [key: string]: any };
  };
  pageSize: number;
  startEventIndex: number;
}

const LiveTable: React.FC<LiveTableProps> = ({
  editInfo,
  pageSize,
  startEventIndex,
}) => {
  const { state, updateEvent, togglePause } = useLiveChartContext();
  const [wasPausedBeforeEdit, setWasPausedBeforeEdit] = useState(false);
  const eventsFiltered = state.events.slice(
    startEventIndex,
    startEventIndex + pageSize
  );

  const [editState, setEditState] = useState({
    index: null as number | null,
    type: null as keyof ChartEvent | null,
    value: "" as any,
  });

  const handleEdit = (index: number, type: keyof ChartEvent, value: any) => {
    if (!state.paused) {
      togglePause();
      setWasPausedBeforeEdit(false);
    } else {
      setWasPausedBeforeEdit(true);
    }
    setEditState({ index, type, value });
  };

  useEffect(() => {
    if (editInfo.index !== null && editInfo.type !== null) {
      handleEdit(editInfo.index, editInfo.type, editInfo.data[editInfo.type]);
    }
  }, [editInfo, editInfo.index, editInfo.type, editInfo.data]);

  const handleSave = (index: number, valueType: keyof ChartEvent) => {
    if (!isNaN(Number(editState.value))) {
      const realIndex = state.events.length - pageSize + index;
      updateEvent(realIndex, valueType, Number(editState.value));
      setEditState({ index: null, type: null, value: "" });
      if (!wasPausedBeforeEdit) {
        togglePause();
      }
    } else {
      alert("Please enter a valid number.");
    }
  };

  return (
    <div className="flex border border-gray-300 rounded">
      <div></div>
      <div>
        <div className="p-2">Index</div>
        <div className="p-2 border-t border-gray-300">Value 1</div>
        <div className="p-2 border-t border-gray-300">Value 2</div>
      </div>

      {eventsFiltered.map((event, index) => (
        <div key={event.index} className="border-l border-gray-300 flex-1">
          <div className="p-2">{event.index}</div>
          <div className="p-2 border-t border-gray-300">
            {editState.index === index && editState.type === "value1" ? (
              <input
                type="number"
                value={editState.value}
                onChange={(e) =>
                  setEditState({ ...editState, value: e.target.value })
                }
                onBlur={() => handleSave(index, "value1")}
                autoFocus
              />
            ) : (
              <div onClick={() => handleEdit(index, "value1", event.value1)}>
                {event.value1}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-300">
            {editState.index === index && editState.type === "value2" ? (
              <input
                type="number"
                value={editState.value}
                onChange={(e) =>
                  setEditState({ ...editState, value: e.target.value })
                }
                onBlur={() => handleSave(index, "value2")}
                autoFocus
              />
            ) : (
              <div onClick={() => handleEdit(index, "value2", event.value2)}>
                {event.value2}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveTable;
