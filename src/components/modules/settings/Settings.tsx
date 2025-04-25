'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { changePassword } from '@/services/AuthService';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type TPasswordData = {
  oldPassword: string;
  newPassword: string;
};

const AccountSettings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TPasswordData>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const onSubmit: SubmitHandler<TPasswordData> = async (data) => {
    try {
      const res = await changePassword(data);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res?.success) {
        toast.success('Password changed successfully');
        reset(); // <- This will work only if res.success is truly true
        return;
      }

      toast.error('Something went wrong');
    } catch (err) {
      console.error('Error in submission:', err);
      toast.error('Unexpected error occurred');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Password</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Modify your current password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              type="password"
              placeholder="Current password"
              {...register('oldPassword', {
                required: 'Current password is required',
              })}
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-500 mt-1">
                {String(errors.oldPassword.message)}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="New password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {String(errors.newPassword.message)}
              </p>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
