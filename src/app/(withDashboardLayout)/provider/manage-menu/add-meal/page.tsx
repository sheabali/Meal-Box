'use server';

import AddMealsForm from '@/components/modules/provider/AddMealsForm';
import { getCurrentUser } from '@/services/AuthService';

const AddProductPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="flex items-center justify-center">
      <AddMealsForm user={user} />
    </div>
  );
};

export default AddProductPage;
