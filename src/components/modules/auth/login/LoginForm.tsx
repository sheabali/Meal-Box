'use client';

import ReCAPTCHA from 'react-google-recaptcha';
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
import { loginUser, reCaptchaTokenVerification } from '@/services/AuthService';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { loginSchema } from './loginValidation';
import Loading from '@/components/shared/Loading';

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { setIsLoading } = useUser();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirectPath');
  const router = useRouter();
  const [reCaptchaStatus, setReCaptchaStatus] = useState(false);

  const {
    formState: { isSubmitting },
  } = form;

  const handleReCaptcha = async (value: string | null) => {
    try {
      const res = await reCaptchaTokenVerification(value!);
      if (res?.success) setReCaptchaStatus(true);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);
      setIsLoading(true);
      if (res?.success) {
        toast.success(res.message);
        router.push(redirect || '/');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <p className="text-sm text-gray-500">Welcome back! Please log in.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="py-6 "
                      type="password"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-center">
              <ReCAPTCHA
                className="py-6"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY || ''}
                onChange={handleReCaptcha}
              />
            </div>

            <Button
              type="submit"
              disabled={!reCaptchaStatus || isSubmitting}
              className="w-full  mt-4 py-6 loader"
            >
              {isSubmitting ? <Loading /> : 'Login'}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don t have an account?{' '}
          <Link
            href="/register"
            className=" text-green-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
