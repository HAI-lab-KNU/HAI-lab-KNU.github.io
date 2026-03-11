import React from 'react';
import { FaCheck } from "react-icons/fa";

interface YearFilterProps {
  startYear: string;
  endYear: string;
  selectedTypes: string[];
  onStartYearChange: (year: string) => void;
  onEndYearChange: (year: string) => void;
  onTypeChange: (type: string) => void;
  availableYears: string[];
  availableTypes: string[];
  typeLabel?: string;
}

const YearFilter: React.FC<YearFilterProps> = ({
  startYear,
  endYear,
  selectedTypes,
  onStartYearChange,
  onEndYearChange,
  onTypeChange,
  availableYears,
  availableTypes,
  typeLabel = "Publication Type"
}) => {
  // Start에는 endYear 이하만, End에는 startYear 이상만 표시 (Start > End 선택 불가)
  const startYearOptions = React.useMemo(() => {
    if (!endYear) return availableYears
    const end = parseInt(endYear, 10)
    return availableYears.filter(y => parseInt(y, 10) <= end)
  }, [availableYears, endYear])

  const endYearOptions = React.useMemo(() => {
    if (!startYear) return availableYears
    const start = parseInt(startYear, 10)
    return availableYears.filter(y => parseInt(y, 10) >= start)
  }, [availableYears, startYear])

  return (
    <div className="mb-2 md:mb-6">
      <div className="bg-gray-50 rounded-lg p-1.5 md:p-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">
          {/* 왼쪽: 타입 필터 */}
          <div className="flex-1 text-center">
            <h3 className="text-xs font-normal text-gray-700 mb-1 md:mb-2">{typeLabel}</h3>
            <div className="flex flex-wrap justify-center gap-0.5 md:gap-2">
              {availableTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => onTypeChange(type)}
                  className={`px-1 py-0.5 rounded-md font-normal transition-all duration-300 text-xs whitespace-nowrap flex items-center gap-0.5 ${
                    selectedTypes.includes(type)
                      ? "bg-white text-blue-600 border border-blue-400"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-white hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  {selectedTypes.includes(type) && (
                    <FaCheck className="w-2 h-2" />
                  )}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 오른쪽: 연도 선택기 */}
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <h3 className="text-xs font-normal text-gray-700 mb-1 md:mb-2">Start</h3>
                <select
                  id="startYear"
                  value={startYear}
                  onChange={(e) => onStartYearChange(e.target.value)}
                  className="px-1 py-0.5 bg-white border border-gray-300 rounded-md text-xs font-normal text-gray-600 focus:outline-none focus:border-blue-400 hover:border-blue-300 transition-all duration-300 min-w-[70px] md:min-w-[100px]"
                >
                  {startYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              <span className="text-sm md:text-xl text-gray-400 font-light mt-3 md:mt-6">—</span>
              
              <div className="text-center">
                <h3 className="text-xs font-normal text-gray-700 mb-1 md:mb-2">End</h3>
                <select
                  id="endYear"
                  value={endYear}
                  onChange={(e) => onEndYearChange(e.target.value)}
                  className="px-1 py-0.5 bg-white border border-gray-300 rounded-md text-xs font-normal text-gray-600 focus:outline-none focus:border-blue-400 hover:border-blue-300 transition-all duration-300 min-w-[70px] md:min-w-[100px]"
                >
                  <option value="">Today</option>
                  {endYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearFilter; 