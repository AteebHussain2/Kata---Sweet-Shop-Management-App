
import { Request, Response } from 'express';
import Sweet from '../models/Sweet';

export const getAllSweets = async (req: Request, res: Response) => {
    try {
        const sweets = await Sweet.find();
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const searchSweets = async (req: Request, res: Response) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        let query: any = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (category) query.category = { $regex: category, $options: 'i' };

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweet.find(query);
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createSweet = async (req: Request, res: Response) => {
    try {
        const sweet = new Sweet(req.body);
        await sweet.save();
        res.status(201).json(sweet);
    } catch (error) {
        res.status(400).json({ message: 'Bad request', error });
    }
};

export const updateSweet = async (req: Request, res: Response) => {
    try {
        const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteSweet = async (req: Request, res: Response) => {
    try {
        const sweet = await Sweet.findByIdAndDelete(req.params.id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.json({ message: 'Sweet deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const purchaseSweet = async (req: Request, res: Response) => {
    try {
        const { quantity } = req.body;
        const qtyToPurchase = Number(quantity) || 1;

        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

        if (sweet.quantity < qtyToPurchase) {
            return res.status(400).json({ message: 'Insufficient quantity' });
        }

        sweet.quantity -= qtyToPurchase;
        await sweet.save();

        res.json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const restockSweet = async (req: Request, res: Response) => {
    try {
        const { quantity } = req.body;
        const qtyToAdd = Number(quantity);

        if (!qtyToAdd || qtyToAdd <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        const sweet = await Sweet.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: qtyToAdd } },
            { new: true }
        );

        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
