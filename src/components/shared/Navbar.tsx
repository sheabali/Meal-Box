'use client';

import { Button } from '../ui/button';
import { Heart, LogOut } from 'lucide-react';
import logo from '@/assets/logo/final.png';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/services/AuthService';
import { useUser } from '@/context/UserContext';
import { usePathname, useRouter } from 'next/navigation';
import { protectedRoutes } from '@/constant';
import Image from 'next/image';

export default function Navbar() {
  const { user, setIsLoading } = useUser();

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    if (protectedRoutes.some((router) => pathname.match(router))) {
      router.push('/');
    }
    setIsLoading(true);
  };

  return (
    <header className="border-b w-full">
      <div className="container bg-[#00c951] flex justify-between items-center mx-auto h-[75px] px-3">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={160}
            height={160}
            className=" rounded object-cover mr-2"
          />
        </Link>
        <div className="max-w-md  flex-grow">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full max-w-6xl border bg-white border-gray-300 rounded-full py-2 px-5"
          />
        </div>
        <nav className="flex gap-2">
          <Button variant="outline" className="rounded-full p-0 size-10">
            <Heart />
          </Button>

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/profile/${user?.role}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/${user?.role}/dashboard`}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="bg-red-500 text-white cursor-pointer"
                  >
                    <LogOut className="text-white hover:text-black transition-colors duration-200" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
