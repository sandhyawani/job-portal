import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-4 flex gap-6">
        {/* Sidebar */}
        <div className="w-[20%] hidden lg:flex flex-col">
          <div className="sticky top-32 flex-1">
            <div className="h-full bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
              <div className="flex-1">
                <FilterCard />
              </div>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-5rem)]">
          {filterJobs.length <= 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <img
                src="https://illustrations.popsy.co/gray/work-from-home.svg"
                alt="No Jobs"
                className="w-60 mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-700">No jobs found</h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or filter to find more opportunities.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pb-6 pr-2">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                <AnimatePresence>
                  {filterJobs.map((job, index) => (
                    <motion.div
                      key={job?._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="hover:scale-[1.02] transition-transform"
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
