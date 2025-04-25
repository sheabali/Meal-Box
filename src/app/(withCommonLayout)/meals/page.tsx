import AllProducts from '@/components/modules/products/productDetails';
import ProductBanner from '@/components/modules/products/banner';
import CategoryCard from '@/components/ui/core/CategoryCard';
import NMContainer from '@/components/ui/core/MBContainer';
import { getAllMeal, getAllMeals } from '@/services/meal';
import AllMeals from '@/components/modules/products';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const AllMealsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const query = await searchParams;

  // const { data: categories } = await getAllMeal();
  const { data: meals } = await getAllMeals();

  return (
    <NMContainer>
      <ProductBanner title="All Products" path="Home - Products" />
      <h2 className="text-xl font-bold my-5">Featured Collection </h2>
      {/* <div className="grid grid-cols-6 gap-6">
        {categories?.slice(0, 6).map((category: ICategory, idx: number) => (
          <CategoryCard key={idx} category={category} />
        ))}
      </div> */}
      <AllMeals meals={meals?.meals} />
    </NMContainer>
  );
};

export default AllMealsPage;
