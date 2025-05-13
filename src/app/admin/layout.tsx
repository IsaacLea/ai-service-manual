;
import AdminNavLinks from '../components/admin-nav-links';

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="grid justify-items-center min-h-screen bg-gray-100">
            <header className="text-3xl font-bold my-6 text-blue-600">Admin</header>
            <div className="flex space-x-4 mb-4">
                <AdminNavLinks />
            </div>
            <div className="w-full sm:w-100">{children}</div>
        </div>
    );
}