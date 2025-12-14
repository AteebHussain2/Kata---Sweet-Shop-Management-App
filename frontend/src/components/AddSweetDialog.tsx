
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AddSweetDialogProps {
    onAdd: (sweet: any) => Promise<void>;
}

const AddSweetDialog = ({ onAdd }: AddSweetDialogProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '', description: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAdd(formData);
            setOpen(false);
            setFormData({ name: '', category: '', price: '', quantity: '', description: '' });
            toast.success('Sweet added to inventory');
        } catch (error) {
            toast.error('Failed to add sweet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                    <PlusCircle className="h-4 w-4" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Sweet</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" className="col-span-3" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Input id="category" className="col-span-3" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input id="price" type="number" step="0.01" className="col-span-3" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="qty" className="text-right">Qty</Label>
                        <Input id="qty" type="number" className="col-span-3" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">Desc</Label>
                        <Input id="desc" className="col-span-3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Save Product'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSweetDialog;
