import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";

const LiveChart = ({ onChartPointClick, pageSize, startEventIndex }) => {
  const { data, togglePause, resetEvents } = useLiveChartContext();

  const handleClick = (data, index) => {
    if (onChartPointClick) {
      onChartPointClick(data, index);
    }
  };

  const eventsFiltered = data.events.slice(
    startEventIndex,
    startEventIndex + pageSize
  );

  return (
    <div className="mb-8">
      <ResponsiveContainer height={250}>
        <div className="flex justify-center mb-4">
          <button
            onClick={togglePause}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded">
            {data.paused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={() => resetEvents()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded self-end">
            Reset
          </button>
        </div>

        <AreaChart
          onClick={(e) => {
            if (e && e.activePayload && e.activePayload.length > 0) {
              handleClick(e.activePayload[0].payload, e.activeTooltipIndex);
            }
          }}
          data={eventsFiltered}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="index" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="value1"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="value2"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

LiveChart.propTypes = {};

export default LiveChart;

