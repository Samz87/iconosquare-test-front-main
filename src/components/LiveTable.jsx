import React, { useState, useEffect } from "react";
import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";

const LiveTable = ({ editInfo }) => {
  const { data, updateEvent, togglePause } = useLiveChartContext();
  const [wasPausedBeforeEdit, setWasPausedBeforeEdit] = useState(false);
  const nbTotalEvents = data?.events?.length;
  const eventsFiltered = data.events.slice(nbTotalEvents - 20, nbTotalEvents);

  const [editState, setEditState] = useState({
    index: null,
    type: null,
    value: "",
  });

  const handleEdit = (index, type, value) => {
    if (!data.paused) {
      togglePause();
      setWasPausedBeforeEdit(false);
    } else {
      setWasPausedBeforeEdit(true);
    }
    setEditState({ index, type, value });
  };

  useEffect(() => {
    if (editInfo.index !== null) {
      handleEdit(editInfo.index, editInfo.type, editInfo.data[editInfo.type]);
    }
    //eslint-disable-next-line
  }, [editInfo]);

  const handleSave = (index, valueType) => {
    const realIndex = data.events.length - 20 + index;
    updateEvent(realIndex, valueType, editState.value);
    setEditState({ index: null, type: null, value: "" });

    if (!wasPausedBeforeEdit) {
      togglePause();
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
                type="text"
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
                type="text"
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

