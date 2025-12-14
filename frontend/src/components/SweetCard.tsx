
import { Sweet } from '@/types/sweet';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Package } from 'lucide-react';
import { toast } from 'sonner';

interface SweetCardProps {
    sweet: Sweet;
    userRole?: string;
    onPurchase: (id: string) => Promise<void>;
    onRestock: (id: string, qty: number) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const SweetCard = ({ sweet, userRole, onPurchase, onRestock, onDelete }: SweetCardProps) => {
    const [restockQty, setRestockQty] = useState('');
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = async () => {
        setIsPurchasing(true);
        try {
            await onPurchase(sweet._id);
            toast.success(`Purchased ${sweet.name}!`);
        } catch (error) {
            toast.error('Purchase failed');
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleRestock = async () => {
        const qty = parseInt(restockQty);
        if (isNaN(qty) || qty <= 0) {
            toast.error('Valid quantity required');
            return;
        }
        try {
            await onRestock(sweet._id, qty);
            setRestockQty('');
            toast.success('Restocked successfully');
        } catch (error) {
            toast.error('Restock failed');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
        >
            <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all h-full flex flex-col group">
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center relative">
                    <span className="text-4xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">🍬</span>
                    <Badge variant={sweet.quantity > 0 ? "secondary" : "destructive"} className="absolute top-2 right-2">
                        {sweet.quantity > 0 ? `${sweet.quantity} left` : 'Sold Out'}
                    </Badge>
                </div>

                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg leading-tight line-clamp-1" title={sweet.name}>{sweet.name}</h3>
                            <p className="text-sm text-muted-foreground">{sweet.category}</p>
                        </div>
                        <div className="font-bold text-lg text-primary">
                            ${sweet.price.toFixed(2)}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 py-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">{sweet.description || "A delicious treat waiting for you!"}</p>

                    {userRole === 'admin' && (
                        <div className="mt-4 p-3 bg-secondary/30 rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">Admin Controls</span>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Qty"
                                    className="h-8 bg-background"
                                    type="number"
                                    value={restockQty}
                                    onChange={(e) => setRestockQty(e.target.value)}
                                />
                                <Button size="sm" variant="outline" className="h-8" onClick={handleRestock}>
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-4 gap-2 border-t bg-secondary/10">
                    <Button
                        className="w-full font-semibold shadow-sm"
                        disabled={sweet.quantity === 0 || isPurchasing}
                        onClick={handlePurchase}
                        variant={sweet.quantity === 0 ? "secondary" : "default"}
                    >
                        {isPurchasing ? 'Buying...' : (
                            <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {sweet.quantity === 0 ? 'Notify Me' : 'Buy Now'}
                            </>
                        )}
                    </Button>

                    {userRole === 'admin' && (
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => onDelete(sweet._id)}
                            title="Delete Sweet"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default SweetCard;
