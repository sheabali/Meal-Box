'use client';

import Image from 'next/image';

const ProductBanner = ({ title, path }: { title: string; path: string }) => {
  return (
    <div className="relative mt-10 my-4 rounded-3xl overflow-hidden border-2 border-white shadow-md">
      {/* Background Image */}
      <Image
        src="https://i.ibb.co.com/vCLG2gtV/20128.jpg" // replace with your own image path
        alt="Banner"
        fill
        className="object-cover w-full h-full "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 " />

      {/* Text Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-[250px] text-white text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold drop-shadow-md mb-2">
          {title}
        </h2>
        <p className="text-sm md:text-base tracking-wide">{path}</p>
      </div>
    </div>
  );
};

export default ProductBanner;
