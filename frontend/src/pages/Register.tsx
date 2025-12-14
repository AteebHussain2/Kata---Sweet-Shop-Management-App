
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await axios.post(`${apiUrl}/auth/register`, formData);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
                toast.success("Account created successfully!");
                navigate('/');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <span className="text-6xl">🍬</span>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Sweet Shop</h1>
                </div>
                <Card className="shadow-xl border-border/50 bg-card/80 backdrop-blur">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Sign Up</CardTitle>
                        <CardDescription>
                            Create a new account to start shopping
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="bg-background/50"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating Account..." : "Sign Up"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
