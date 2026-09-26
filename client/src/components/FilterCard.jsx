import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

const filterData = [
  {
    filterType: "Location",
    options: ["Delhi", "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Remote"],
  },
  {
    filterType: "Job Type",
    options: ["Full-Time", "Part-Time", "Internship", "Contract"],
  },
  {
    filterType: "Job Role",
    options: [
      "Full Stack Developer",
      "Backend Developer",
      "Frontend Developer",
      "Data Analyst",
      "Marketing Executive",
      "HR",
    ],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  // Sync state if searchedQuery is cleared externally
  useEffect(() => {
    if (!searchedQuery && selectedValue) {
      setSelectedValue('');
    }
  }, [searchedQuery, selectedValue]);

  useEffect(() => {
    if (selectedValue) {
      dispatch(setSearchedQuery(selectedValue));
    }
  }, [selectedValue, dispatch]);

  const clearFilterHandler = () => {
    setSelectedValue('');
    dispatch(setSearchedQuery(''));
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-200/80">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-pink-600" />
          Filter Jobs
        </h2>

        {selectedValue && (
          <button
            onClick={clearFilterHandler}
            className="flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-full transition-colors"
          >
            <RotateCcw size={12} /> Clear
          </button>
        )}
      </div>

      <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
        {filterData.map((section, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">
              {section.filterType}
            </h3>

            <div className="space-y-1">
              {section.options.map((option, idx) => {
                const itemId = `filter-${index}-${idx}`;
                return (
                  <label
                    key={itemId}
                    htmlFor={itemId}
                    className="flex items-center space-x-2.5 py-1 px-2 rounded-lg hover:bg-pink-50/50 cursor-pointer text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <RadioGroupItem
                      value={option}
                      id={itemId}
                      className="border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="font-medium text-xs sm:text-sm">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;