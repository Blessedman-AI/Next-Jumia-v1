import data from '@/lib/data';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import ProductModel from '@/lib/models/ProductModel';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { users, products } = data;

  try {
    await dbConnect();
    console.log('Database connection successful');
    await UserModel.deleteMany();
    await UserModel.insertMany(users);

    await ProductModel.deleteMany();
    await ProductModel.insertMany(products);
  } catch (error) {
    console.error('Error connecting to database', error);
  }

  return NextResponse.json({
    message: 'Seeded successfully!',
    users,
    products,
  });
};
