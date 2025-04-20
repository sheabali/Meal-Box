import { Button } from '@/components/ui/button';
import styles from './HeroSection.module.css';
import NMContainer from '@/components/ui/core/MBContainer';

const HeroSection = () => {
  return (
    <NMContainer>
      <div
        className={`${styles.banner} relative h-[90vh] w-full rounded-3xl overflow-hidden mt-10`}
      >
        {/* Overlay Card */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="bg-black opacity-[80%] rounded-2xl p-8 md:p-12 text-center max-w-xl mx-4">
            <h1 className="text-white  text-3xl md:text-4xl font-extrabold leading-tight">
              CHEF COOKED, <span className="text-lime-400">HEALTHY</span> <br />
              MEALS DELIVERED TO YOUR DOOR.
            </h1>

            <p className="text-lime-300 mt-4 text-lg font-semibold">
              See our available plans and menu!
            </p>

            <Button
              variant="outline"
              className="mt-6 cursor-pointer text-black font-semibold border-white "
            >
              GET STARTED
            </Button>
          </div>
        </div>
      </div>
    </NMContainer>
  );
};

export default HeroSection;
