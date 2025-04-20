'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Settings from './Settings';
import ProfileCard from './ProfileCard';

const SettingsPage = () => {
  return (
    <div
      style={{ minHeight: 'calc(100vh - 160px)' }}
      className="mb-5 flex flex-col justify-center items-center"
    >
      <Tabs defaultValue="profile" className="w-full max-w-xl my-10">
        <TabsList className="grid w-full mb-7 grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileCard />
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
