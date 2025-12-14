
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Sweet } from '@/types/sweet';
import Layout from '@/components/Layout';
import SweetCard from '@/components/SweetCard';
import AddSweetDialog from '@/components/AddSweetDialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Dashboard = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [searchName, setSearchName] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ role: string } | null>(null);

    const fetchSweets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            let query = `${apiUrl}/sweets/search?`;
            if (searchName) query += `name=${searchName}&`;

            const response = await axios.get(query, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSweets(response.data);
        } catch (error) {
            console.error('Failed to fetch sweets', error);
            toast.error("Could not load sweets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchSweets();
    }, [searchName]);

    const handlePurchase = async (sweetId: string) => {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        await axios.post(`${apiUrl}/sweets/${sweetId}/purchase`, { quantity: 1 }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchSweets();
    };

    const handleRestock = async (sweetId: string, quantity: number) => {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        await axios.post(`${apiUrl}/sweets/${sweetId}/restock`, { quantity }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchSweets();
    };

    const handleDelete = async (sweetId: string) => {
        if (!confirm("Are you sure you want to delete this sweet?")) return;
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        await axios.delete(`${apiUrl}/sweets/${sweetId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchSweets();
        toast.success("Sweet deleted");
    };

    const handleAddSweet = async (data: any) => {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        await axios.post(`${apiUrl}/sweets`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchSweets();
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card/30 p-4 rounded-xl border border-border/50 backdrop-blur-sm sticky top-20 z-10 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search for sweets..."
                        className="pl-10 bg-background/50 focus:bg-background transition-colors border-muted-foreground/20"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                {user?.role === 'admin' && <AddSweetDialog onAdd={handleAddSweet} />}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {sweets.length > 0 ? (
                            sweets.map((sweet) => (
                                <SweetCard
                                    key={sweet._id}
                                    sweet={sweet}
                                    userRole={user?.role}
                                    onPurchase={handlePurchase}
                                    onRestock={handleRestock}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-muted-foreground">
                                <p className="text-xl">No sweets found 🍭</p>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </Layout>
    );
};

export default Dashboard;
