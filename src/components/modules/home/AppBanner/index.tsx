import NMContainer from '@/components/ui/core/MBContainer';
import Image from 'next/image';
import React from 'react';

const DownloadApp = () => {
  return (
    <NMContainer>
      <div className="flex justify-between items-center">
        <div className="bg-green-400 rounded-2xl w-full h-1/2 bg-opacity-50 py-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between">
              <div className="p-4">
                <h2 className="font-bold text-2xl">
                  Download the food and groceries you love
                </h2>
                <div className="flex gap-4 items-center mt-4">
                  <Image
                    src="https://i.ibb.co.com/0jbzs5br/batqr-qrcode.png"
                    alt="Apple App Store"
                    width={100}
                    height={100}
                    className="h-auto"
                  />

                  <p className="text-base ">
                    It s all at your fingertips – the restaurants and shops you
                    love. Find the right food and <br /> groceries to suit your
                    mood, and make the first bite last. Go ahead, download us.
                  </p>
                </div>
                <div className="flex items-center mt-5">
                  <Image
                    src="https://i.ibb.co.com/V0JMyVpy/get-it-on-google-play-300x88-2.png"
                    alt="Google Play Store"
                    width={150}
                    height={50}
                    className="h-auto mr-3"
                  />
                  <Image
                    src="https://i.ibb.co.com/RkWtrNM8/AppStore.png"
                    alt="Apple App Store"
                    width={150}
                    height={50}
                    className="h-auto"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 my-5">
              <Image
                src="https://i.ibb.co.com/XkJVJSxz/home-foodpanda-apps.webp"
                alt="App Banner"
                width={400}
                height={400}
                className=" h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </NMContainer>
  );
};

export default DownloadApp;
