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
    <div className="relative w-full py-12 bg-gradient-to-b from-white via-pink-50/40 to-white">
      <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8">
        Explore <span className="text-pink-500">Categories</span>
      </h2>

      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent className="flex items-center">
          {category.map((cat, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3 flex justify-center"
            >
              <Button
                onClick={() => searchJobHandler(cat)}
                className="rounded-full px-6 py-3 text-lg font-medium 
                  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
                  hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600
                  shadow-lg shadow-pink-500/20 text-white transition-all duration-300 transform hover:scale-105"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-lg shadow-md hover:scale-105 transition-all rounded-full" />
        <CarouselNext className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-lg shadow-md hover:scale-105 transition-all rounded-full" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
