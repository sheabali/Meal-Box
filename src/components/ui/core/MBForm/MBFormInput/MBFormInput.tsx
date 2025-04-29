/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Input } from '@/components/ui/input';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const MBFormInput = ({ value, name, placeHolder }: any) => {
  const { register, setValue } = useFormContext();

  useEffect(() => {
    if (value !== undefined) {
      setValue(name, value);
    }
  }, [value, name, setValue]);

  return (
    <Input
      {...register(name)}
      placeholder={placeHolder}
      className="input-style"
    />
  );
};

export default MBFormInput;
