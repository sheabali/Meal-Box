'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { addProduct } from '@/redux/features/cartSlice';
import { useAppDispatch } from '@/redux/hooks';

// import { IProduct } from '@/types';
import { IMeal } from '@/types/meal';
import { Scaling, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }: { product: IMeal }) => {
  const dispatch = useAppDispatch();

  const handleAddProduct = (product: IMeal) => {
    dispatch(addProduct(product));
  };

  return (
    <Card className="p-3 w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <CardHeader className="relative p-0 h-48 overflow-hidden rounded-lg">
        <Image
          src={
            product?.image?.[0] ??
            'https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png'
          }
          width={500}
          height={500}
          alt="product image"
          className="rounded-md h-48 w-full object-cover"
        />
        {product?.availability === false && (
          <div className="absolute left-2 top-2 bg-red-500 text-white px-3 py-1 text-xs rounded-full">
            Out of Stock
          </div>
        )}
      </CardHeader>

      <CardContent className="p-2 mt-2">
        <Link href={`/meals/${product?._id}`} passHref>
          <CardTitle
            title={product?.name}
            className="font-semibold cursor-pointer text-sm sm:text-base truncate"
          >
            {product?.name.length > 40
              ? product?.name?.slice(0, 40) + '...'
              : product?.name}
          </CardTitle>
        </Link>

        <div className="flex items-center justify-between my-2">
          {/* <p className="text-sm sm:text-base text-gray-600">
            {product?.offerPrice ? (
              <>
                <span className="font-semibold mr-2 text-orange-400">
                  $ {product?.offerPrice.toFixed(2)}
                </span>
                <del className="font-semibold text-xs">
                  $ {product?.price.toFixed(2)}
                </del>
              </>
            ) : (
              <span className="font-semibold">
                $ {product?.price.toFixed(2)}
              </span>
            )}
          </p> */}
          <span className="font-semibold">$ {product?.price.toFixed(2)}</span>

          <div className="flex items-center justify-center gap-1">
            <Star
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="orange"
              stroke="orange"
            />
            <span className="text-sm font-medium text-gray-700">
              {product?.totalRatings}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2">
        <div className="flex gap-2 items-center justify-between w-full">
          <Link href="/cart">
            <Button
              onClick={() => handleAddProduct(product)}
              disabled={product?.availability === false}
              variant="outline"
              size="sm"
              className=" flex items-center justify-center rounded-full"
            >
              Order Now
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 flex items-center justify-center rounded-full"
          >
            <Link href={`/meals/${product?._id}`}>
              <Scaling />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
