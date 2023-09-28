export type ISValidPlatforms = 'Game Boy' | 'Game Boy Classic' | 'Retro Console' | 'Sega Game Gear' | 'Sony PSP 2000';
export type ValidTypes = 'console' | 'art';
export type ValidSizes = 'small' | 'medium' | 'large'; // Nueva definición para los tamaños

export interface IProduct {
    _id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    platform: ISValidPlatforms[];
    slug: string;
    tags: string[];
    title: string;
    type: ValidTypes;
    size?: ValidSizes[]; // 'size' es un array de tamaños válidos
    subject?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ISeedData {
    products: IProduct[];
}
