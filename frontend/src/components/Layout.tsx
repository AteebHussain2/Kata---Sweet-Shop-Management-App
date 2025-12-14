
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-50 transition-colors">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
