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
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from './registerValidation';
import { registerUser } from '@/services/AuthService';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';

export default function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const { setIsLoading } = useUser();

  const {
    formState: { isSubmitting },
  } = form;

  const password = form.watch('password');
  const passwordConfirm = form.watch('passwordConfirm');

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await registerUser(data);
      setIsLoading(true);
      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Register</h1>
          <p className="text-sm text-gray-600">
            Join us today and start your journey!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="py-6"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="py-6"
                      type="email"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      className="py-6"
                      type="tel"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="py-6"
                      type="password"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className="py-6"
                      type="password"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  {passwordConfirm && password !== passwordConfirm ? (
                    <FormMessage>Password does not match</FormMessage>
                  ) : (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={passwordConfirm !== password || isSubmitting}
              className="w-full py-6 mt-4"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
