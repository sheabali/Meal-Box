import { Loader2 } from 'lucide-react';

const Loading = ({ label = 'Loading...' }: { label?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Loading;
