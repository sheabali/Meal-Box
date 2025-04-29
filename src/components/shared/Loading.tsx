import { Loader } from 'lucide-react';

const Loading = ({ label = '' }: { label?: string }) => {
  return (
    <div className="flex items-center justify-center py-10 gap-4">
      <Loader className="size-6 animate-spin text-3xl text-black" />
      <p className="text-muted-foreground text-xl">{label}</p>
    </div>
  );
};

export default Loading;
