'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'View Metadata', href: '/admin' },
  { name: 'Upload', href: '/admin/upload' }
];

export default function AdminNavLinks() {

  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        // const LinkIcon = link.icon;
        return (
          // Using the Link component from next/link to handle client-side navigation and to avoid full page reloads.
          // It also allows us to use the prefetching feature of Next.js so it loads the page in the background and when the user clicks on a link it will be near instant since it's already loaded.
          // https://nextjs.org/learn/dashboard-app/navigating-between-pages
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            {/* <LinkIcon className="w-6" /> */}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
