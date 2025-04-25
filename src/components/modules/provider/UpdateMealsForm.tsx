/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  FieldValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import NMImageUploader from '@/components/ui/core/NMImageUploader';
import ImagePreviewer from '@/components/ui/core/ImagePreviewer';
import { updateMeal } from '@/services/meal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function UpdateMealsForm({ mealId }: any) {
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      image: '',
      ingredients: [] as { value: string }[],
      portionSize: '',
      price: 0,
      availability: true,
      ratings: 0,
      totalRatings: 0,
      isDeleted: false,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: 'ingredients',
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const ingredients = data.ingredients
      .map((item: { value: string }) => item.value)
      .filter((v: string) => v.trim() !== '')
      .reverse();

    const modifiedData = {
      ...data,
      ingredients,
      price: parseFloat(data.price),
      isDeleted: false,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(modifiedData));

    for (const file of imageFiles) {
      formData.append('images', file);
    }

    try {
      const res = await updateMeal(formData, mealId);

      if (res.success) {
        toast.success(res.message);
        router.push('/provider/manage-menu/manage-meal');
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Something went wrong while adding the meal.');
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-xl flex-grow max-w-2xl p-5 ">
      <div className="flex items-center space-x-4 mb-5 ">
        <h1 className="text-xl font-bold">Update Meal</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center border-t border-b py-3 my-5">
            <p className="text-primary font-bold text-xl">Basic Information</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 mt-5 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="portionSize"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Portion Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select portion size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Small', 'Medium', 'Large'].map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ingredients */}
            <div className="my-5 col-span-full">
              <div className="flex justify-between items-center border-t border-b py-3 my-5">
                <p className="text-primary font-bold text-xl">Ingredients</p>
              </div>

              {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-3">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Ingredient ${index + 1}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                onClick={() => appendIngredient({ value: '' })}
                variant="outline"
                className="mt-2"
              >
                + Add Ingredient
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="my-5">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-36 resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div>
            <div className="flex justify-between items-center border-t border-b py-3 my-5">
              <p className="text-primary font-bold text-xl">Images</p>
            </div>
            <div className="flex gap-4 ">
              <NMImageUploader
                setImageFiles={setImageFiles}
                setImagePreview={setImagePreview}
                label="Upload Image"
                className="w-fit mt-0"
              />
              <ImagePreviewer
                className="flex flex-wrap gap-4"
                setImageFiles={setImageFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </div>
          </div>

          <Button type="submit" className="mt-5 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Update Meal..' : 'Update Meal'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
