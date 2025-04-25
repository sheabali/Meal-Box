'use client';

import { Button } from '@/components/ui/button';
import { IMeal } from '@/types/meal';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const MealDetails = ({ product }: { product: IMeal }) => {
  const [leading, setLeading] = useState(0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      {/* Left: Images */}
      <div>
        {/* Main Image */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
          <Image
            src={product?.image?.[0] || '/placeholder.png'}
            fill
            alt="Main Meal Image"
            className="object-cover"
          />
        </div>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {product.image?.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              className="relative w-full h-28 rounded-lg overflow-hidden"
            >
              <Image
                src={img}
                fill
                alt={`Meal Thumbnail ${idx + 1}`}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Details */}
      {/* Right: Details */}
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="mt-2 text-sm text-gray-600 text-justify">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs mt-4">
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4" fill="orange" stroke="orange" />
              {product.totalRatings ?? 0} Ratings
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Portion: {product.portionSize}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Available: {product.availability ? 'Yes' : 'No'}
            </span>
          </div>

          {/* Ingredients */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Ingredients
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {product.ingredients?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing & Action */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 font-medium">Price</span>
            <div className="text-xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </div>
          </div>
          <Link href="/cart">
            <Button className="w-full">Order Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MealDetails;
