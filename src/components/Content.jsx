import React, { useState, useEffect } from "react";
import LiveTable from "./LiveTable";
import LiveChart from "./LiveChart";
import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";

const Content = () => {
  const { data, togglePause } = useLiveChartContext();
  const [editInfo, setEditInfo] = useState({ index: null, type: null });

  const pageSize = 20;

  const [startEventIndex, setStartEventIndex] = useState(
    Math.max(0, data.events.length - pageSize)
  );

  useEffect(() => {
    const updateIndex = data.paused
      ? startEventIndex
      : Math.max(0, data.events.length - pageSize);
    setStartEventIndex(updateIndex);
  }, [data.events.length, data.paused, pageSize]);

  const handleChartPointClick = (data, index) => {
    setEditInfo({ data, index, type: "value1" });
  };

  const handlePrevious = () => {
    if (!data.paused) {
      togglePause();
    }
    setStartEventIndex((prevIndex) => Math.max(0, prevIndex - pageSize));
  };

  const handleNext = () => {
    if (!data.paused) {
      togglePause();
    }
    setStartEventIndex((prevIndex) =>
      Math.min(data.events.length - pageSize, prevIndex + pageSize)
    );
  };

  const isAtEnd = startEventIndex >= data.events.length - pageSize;

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

