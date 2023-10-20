'use server';
import { revalidatePath } from 'next/cache';

export const refreshPath = async (path: string) => {
  revalidatePath(path);
};
