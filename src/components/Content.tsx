import React, { useState, useEffect } from "react";
import LiveTable from "./LiveTable";
import LiveChart from "./LiveChart";
import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";
import { ChartEvent } from "../utils/interfaces/ChartEvent";

const Content: React.FC = () => {
  const { state, togglePause } = useLiveChartContext();

  const [editInfo, setEditInfo] = useState({
    index: null as number | null,
    type: null as keyof ChartEvent | null,
    data: {} as { [key: string]: any },
  });

  const pageSize = 20;
  const [startEventIndex, setStartEventIndex] = useState(
    Math.max(0, state.events.length - pageSize)
  );

  useEffect(() => {
    const updateIndex = state.paused
      ? startEventIndex
      : Math.max(0, state.events.length - pageSize);
    setStartEventIndex(updateIndex);
  }, [state.events.length, state.paused, pageSize, startEventIndex]);

  const handleChartPointClick = (data: any, index: number) => {
    setEditInfo({ data, index, type: "value1" });
  };

  const handlePrevious = () => {
    if (!state.paused) {
      togglePause();
    }
    setStartEventIndex((prevIndex) => Math.max(0, prevIndex - pageSize));
  };

  const handleNext = () => {
    if (!state.paused) {
      togglePause();
    }
    setStartEventIndex((prevIndex) =>
      Math.min(state.events.length - pageSize, prevIndex + pageSize)
    );
  };

  const isAtEnd = startEventIndex >= state.events.length - pageSize;

  return (
    <div className="mx-auto max-w-7xl px-8">
      <LiveChart
        onChartPointClick={handleChartPointClick}
        startEventIndex={startEventIndex}
        pageSize={pageSize}
      />
      <LiveTable
        editInfo={editInfo}
        startEventIndex={startEventIndex}
        pageSize={pageSize}
      />
      <div className="flex justify-center mt-4 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 mx-2 rounded"
          onClick={handlePrevious}
          disabled={startEventIndex === 0}>
          Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 mx-2 rounded"
          onClick={handleNext}
          disabled={isAtEnd}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Content;
