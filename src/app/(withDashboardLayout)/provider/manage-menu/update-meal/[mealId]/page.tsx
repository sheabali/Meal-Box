import UpdateMealsForm from '@/components/modules/provider/UpdateMealsForm';

const UploadMeal = async ({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) => {
  const { mealId } = await params;

  return (
    <div className="flex justify-center items-center">
      <UpdateMealsForm mealId={mealId} />
    </div>
  );
};

export default UploadMeal;
