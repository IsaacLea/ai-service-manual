;
import AdminNavLinks from '../components/admin-nav-links';

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center" >
            <header className="flex flex-col items-center justify-center text-3xl font-bold text-blue-600">
                <span>Admin</span>
                <div className="flex space-x-4 mb-4">
                    <AdminNavLinks />
                </div>
            </header>
            <div className="w-full sm:w-100 flex-1">{children}</div>
        </div>
    );
}