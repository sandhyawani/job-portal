import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search } from 'lucide-react';

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

    // Filter jobs client-side based on searchedQuery matching title, description, location, or requirements
    const filterJobs = (allJobs || []).filter((job) => {
        if (!searchedQuery) return true;
        const query = searchedQuery.toLowerCase().trim();
        const titleMatch = job?.title?.toLowerCase().includes(query);
        const descMatch = job?.description?.toLowerCase().includes(query);
        const locMatch = job?.location?.toLowerCase().includes(query);
        const reqMatch = Array.isArray(job?.requirements)
            ? job.requirements.some((r) => r?.toLowerCase().includes(query))
            : job?.requirements?.toLowerCase().includes(query);
        return titleMatch || descMatch || locMatch || reqMatch;
    });

    return (
        <div className="min-h-screen bg-slate-50/70 pb-16">
            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                        {searchedQuery ? (
                            <span>
                                Results for &ldquo;<span className="text-pink-600">{searchedQuery}</span>&rdquo;
                            </span>
                        ) : (
                            "Explore All Openings"
                        )}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({filterJobs.length} {filterJobs.length === 1 ? "opening" : "openings"})
                        </span>
                    </h1>

                    {searchedQuery && (
                        <button
                            onClick={() => dispatch(setSearchedQuery(""))}
                            className="flex items-center gap-1.5 text-xs font-semibold text-pink-700 bg-pink-100 hover:bg-pink-200 px-3 py-1.5 rounded-full transition-colors"
                        >
                            <span>Filtered: &ldquo;{searchedQuery}&rdquo;</span>
                            <span className="font-bold text-sm leading-none">&times;</span>
                        </button>
                    )}
                </div>

                {/* Jobs list */}
                {!allJobs || allJobs.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-2 pt-2">
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                    <div className="h-3 bg-gray-100 rounded w-full" />
                                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filterJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm my-6">
                        <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 mb-4 shadow-2xs">
                            <Search size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No matching jobs found</h3>
                        <p className="text-gray-500 mt-1 max-w-sm text-sm">
                            We couldn&apos;t find any openings matching &ldquo;{searchedQuery}&rdquo;. Try another keyword or clear the filter.
                        </p>
                        <button
                            onClick={() => dispatch(setSearchedQuery(""))}
                            className="mt-5 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:scale-105"
                        >
                            Reset Filter & View All Jobs
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Browse;
