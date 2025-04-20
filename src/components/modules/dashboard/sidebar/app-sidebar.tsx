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

// This is sample data for customer and provider.
const data = {
  customer: {
    navMain: [
      {
        title: 'Dashboard',
        url: '/customer/dashboard',
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: 'My Orders',
        url: '/customer/my-orders',
        icon: Bot,
        items: [
          {
            title: 'View Orders',
            url: '/customer/my-order',
          },
        ],
      },
      {
        title: 'Settings',
        url: '/customer/profile',
        icon: Settings,
        items: [
          {
            title: 'Profile',
            url: '/customer/settings',
          },
        ],
      },
    ],
  },
  provider: {
    navMain: [
      {
        title: 'Dashboard',
        url: '/provider/dashboard',
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: 'Manage-Menu',
        url: '/provider/manage-menu',
        icon: Bot,
        items: [
          {
            title: 'Add Meal',
            url: '/provider/manage-menu/add-meal',
          },
          {
            title: 'View Meal',
            url: '/provider/manage-menu/manage-meal',
          },
          {
            title: 'Manage Orders',
            url: '/provider/manage-orders',
          },
        ],
      },
      {
        title: 'Settings',
        url: '/provider/profile',
        icon: Settings,
        items: [
          {
            title: 'Profile',
            url: '/provider/settings',
          },
        ],
      },
    ],
  },
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

interface AppSidebarProps {
  role: 'customer' | 'provider';
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  // Get the sidebar data based on the role
  const sidebarData = data[role];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
