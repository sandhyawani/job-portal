import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
  {
    filterType: "Location",
        options: ["Delhi", "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Nashik"],
  },
  {
    filterType: "Job Role",
    options: [
    "Full Stack Developer",
     "Backend Developer",
     "Frontend Developer",
      "Data Analyst",
      "Data scientist",
      "Marketing Executive",
      "HR"
    ]
  }
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h1 className="font-extrabold text-2xl text-gray-900 mb-6">
        Filter <span className="text-pink-500">Jobs</span>
      </h1>

      <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
        {filterData.map((section, index) => (
          <div
            key={index}
            className="mb-6 p-4 rounded-xl bg-gray-50 hover:bg-pink-50 transition-colors duration-200"
          >
            {/* Section Title */}
            <h2 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2 mb-3">
              {section.filterType}
            </h2>

            {/* Options */}
            {section.options.map((option, idx) => {
              const itemId = `filter-${index}-${idx}`;
              return (
                <div
                  key={itemId}
                  className="flex items-center space-x-3 my-2 cursor-pointer hover:text-pink-500 transition-colors"
                >
                  <RadioGroupItem
                    value={option}
                    id={itemId}
                    className="w-5 h-5 rounded-full border border-pink-400 bg-gradient-to-r from-pink-400 to-pink-600 text-white focus:ring-2 focus:ring-pink-500"
                  />
                  <Label
                    htmlFor={itemId}
                    className="text-gray-700 font-medium cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
'iuytrewq. c'