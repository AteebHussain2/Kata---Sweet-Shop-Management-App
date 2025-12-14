
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ username: string, role: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
                <Link to="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
                    <span className="text-primary text-2xl">🍬</span>
                    <span>Sweet Shop</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                                <User className="h-4 w-4" />
                                <span className="font-medium text-foreground">{user.username}</span>
                                <span className="text-xs uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1 font-bold tracking-wider">
                                    {user.role}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                                <LogOut className="h-5 w-5" />
                                <span className="sr-only">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/register">Register</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
