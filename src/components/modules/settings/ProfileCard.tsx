// import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Button } from '@/components/ui/button';

import { protectedRoutes } from '@/constant';
import { useUser } from '@/context/UserContext';

import { logout } from '@/services/AuthService';
import { usePathname, useRouter } from 'next/navigation';
// import Swal from 'sweetalert2';

const ProfileCard = () => {
  const { user, setIsLoading } = useUser();

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsLoading(true);

    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push('/');
    }
  };
  return (
    <div className="max-w-[100%] mx-auto w-80">
      <div className="rounded-lg border-2 border-primary bg-transparent px-4 py-8 text-center shadow-lg">
        <figure className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            className="bi bi-person-fill text-white dark:text-white-300"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          </svg>
          <span className="sr-only">{user?.name}</span>
        </figure>
        <h2 className="mt-4 text-xl font-bold text-primary dark:text-white-400">
          {user?.name}
        </h2>
        <p className="mb-4 text-gray-600">
          Profile Type:{' '}
          <span className="font-bold text-primary">
            {(user?.role ?? '').charAt(0).toUpperCase() +
              user?.role.slice(1).toLowerCase()}
          </span>
        </p>
        <div className="flex items-center justify-center">
          <Button onClick={() => handleLogout()}>Log out</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
