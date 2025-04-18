'use client';

import * as React from 'react';
import {
  Bot,
  GalleryVerticalEnd,
  LifeBuoy,
  Send,
  Settings,
  SquareTerminal,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { TeamSwitcher } from './team-switcher';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/user/dashboard',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Shop',
      url: '/user/shop/products',
      icon: Bot,
      items: [
        {
          title: 'Manage Products',
          url: '/user/shop/products',
        },
        {
          title: 'Manage Categories',
          url: '/user/shop/category',
        },
        {
          title: 'Manage Coupon',
          url: '/user/shop/manage-coupon',
        },
        {
          title: 'Manage Brands',
          url: '/user/shop/brand',
        },
      ],
    },

    {
      title: 'Settings',
      url: '#',
      icon: Settings,
      items: [
        {
          title: 'Profile',
          url: '/profile',
        },
      ],
    },
  ],
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
