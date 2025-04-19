export type IMeal = {
  mealProviderId: string; // Types.ObjectId এর পরিবর্তে string
  name: string;
  description: string;
  image?: string[];
  ingredients: string[]; // string array
  portionSize: string;
  price: number;
  availability?: boolean;
  ratings?: number;
  totalRatings?: number;
  isDeleted?: boolean;
};
