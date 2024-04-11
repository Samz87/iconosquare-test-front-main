import React, { useState } from "react";
import LiveTable from "./LiveTable";
import LiveChart from "./LiveChart";

const Content = () => {
  const [editInfo, setEditInfo] = useState({ index: null, type: null });

  const handleChartPointClick = (data, index) => {
    setEditInfo({ data, index, type: "value1" });
  };

  return (
    <div className="mx-auto max-w-7xl px-8">
      <LiveChart onChartPointClick={handleChartPointClick} />
      <LiveTable editInfo={editInfo} />
    </div>
  );
};

export default Content;

