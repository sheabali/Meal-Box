/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

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
