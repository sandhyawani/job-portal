import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
'Data Analyst',
  'Full Stack Developer'
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  };

  return (
    <div className="relative w-full py-10 bg-slate-50 border-y border-slate-200/80">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Explore by <span className="text-teal-600">Specialization</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select a domain to filter open opportunities
        </p>
      </div>

      <Carousel className="w-full max-w-4xl mx-auto px-4">
        <CarouselContent className="flex items-center -ml-2">
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="pl-2 basis-auto flex justify-center"
            >
              <Button
                variant="outline"
                onClick={() => searchJobHandler(cat)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/50 shadow-2xs transition"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex -left-4 top-1/2 -translate-y-1/2 bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:bg-slate-50 shadow-xs" />
        <CarouselNext className="hidden sm:flex -right-4 top-1/2 -translate-y-1/2 bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:bg-slate-50 shadow-xs" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
