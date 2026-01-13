import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    // Fetch all jobs on page load
    useGetAllJobs();

    const { allJobs, searchedQuery } = useSelector((store) => store.job);
    const dispatch = useDispatch();

    // Clear search query when leaving the page
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(''));
        };
    }, [dispatch]);

    return (
        <div className="relative">
            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    {searchedQuery
                        ? `Search Results for "${searchedQuery}" (${allJobs.length})`
                        : `All Jobs (${allJobs.length})`}
                </h1>

                {/* Jobs list */}
                {allJobs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                ) : (
                    // Empty state
                    <div className="text-center py-20 text-gray-500">
                        No jobs found {searchedQuery && `for "${searchedQuery}"`}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Browse;
