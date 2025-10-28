export type Brand = {
  _id: string;
  brandName: string;
  description?: string;
  country?: string;
};

export type Member = {
  _id: string;
  name: string;
  email: string;
  yob?: number;
  gender?: boolean; // true = male, false = female
  isAdmin: boolean;
  createdAt?: string;
};

export type Comment = {
  _id: string;
  rating: number;
  content: string;
  author: Member;
  perfume: string; // perfume ID
  createdAt: string;
};

export type Perfume = {
  _id: string;
  perfumeName: string;
  uri: string;
  price: number;
  description: string;
  ingredients?: string;
  volume: number; // ml
  stock: number;
  concentration: string;
  targetAudience: 'male' | 'female' | 'unisex';
  brand: Brand | string;
  comments?: Comment[];
  averageRating: number;
  createdAt?: string;
};

export type AISummary = {
  perfumeId: string;
  summary: string;
  similarPerfumes: string[]; // array of perfume IDs
  lastUpdated: string;
};

// Mock Members/Users
export const mockMembers: Member[] = [
  {
    _id: 'm1',
    name: 'Admin User',
    email: 'admin@example.com',
    yob: 1990,
    gender: true,
    isAdmin: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: 'm2',
    name: 'John Doe',
    email: 'john@example.com',
    yob: 1995,
    gender: true,
    isAdmin: false,
    createdAt: '2024-02-15T00:00:00.000Z'
  },
  {
    _id: 'm3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    yob: 1992,
    gender: false,
    isAdmin: false,
    createdAt: '2024-03-10T00:00:00.000Z'
  },
  {
    _id: 'm4',
    name: 'Michael Brown',
    email: 'michael@example.com',
    yob: 1988,
    gender: true,
    isAdmin: false,
    createdAt: '2024-04-20T00:00:00.000Z'
  }
];

// Mock Brands
export const mockBrands: Brand[] = [
  {
    _id: 'b1',
    brandName: 'Chanel',
    description: 'French luxury fashion house specializing in haute couture and perfumes',
    country: 'France'
  },
  {
    _id: 'b2',
    brandName: 'Dior',
    description: 'Iconic French luxury goods company known for elegant fragrances',
    country: 'France'
  },
  {
    _id: 'b3',
    brandName: 'Tom Ford',
    description: 'American luxury brand offering bold and sophisticated scents',
    country: 'United States'
  },
  {
    _id: 'b4',
    brandName: 'Creed',
    description: 'Historic Anglo-French perfume house crafting artisanal fragrances',
    country: 'France'
  },
  {
    _id: 'b5',
    brandName: 'Jo Malone',
    description: 'British fragrance house known for elegant and understated scents',
    country: 'United Kingdom'
  },
  {
    _id: 'b6',
    brandName: 'Versace',
    description: 'Italian luxury fashion company with bold, glamorous fragrances',
    country: 'Italy'
  }
];

// Mock Perfumes
export const mockPerfumes: Perfume[] = [
  {
    _id: 'p1',
    perfumeName: 'Coco Mademoiselle',
    uri: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    price: 125.00,
    description: 'A fresh, oriental fragrance with a distinct personality and character. Vibrant orange immediately awakens the senses.',
    ingredients: 'Orange, Bergamot, Jasmine, Rose, Patchouli, Vanilla',
    volume: 100,
    stock: 45,
    concentration: 'EDP',
    targetAudience: 'female',
    brand: mockBrands[0],
    averageRating: 4.8,
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: 'p2',
    perfumeName: 'Sauvage',
    uri: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400',
    price: 110.00,
    description: 'Radically fresh composition, dictated by a name that has the ring of a manifesto. A powerful expression of freedom.',
    ingredients: 'Calabrian Bergamot, Pepper, Ambroxan, Patchouli',
    volume: 100,
    stock: 60,
    concentration: 'EDT',
    targetAudience: 'male',
    brand: mockBrands[1],
    averageRating: 4.6,
    createdAt: '2024-01-20T00:00:00.000Z'
  },
  {
    _id: 'p3',
    perfumeName: 'Black Orchid',
    uri: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400',
    price: 155.00,
    description: 'A luxurious and sensual fragrance of rich dark accords. Black Orchid is a bold, dramatic scent with an alluring depth.',
    ingredients: 'Black Orchid, Spice, Dark Chocolate, Patchouli, Vanilla',
    volume: 50,
    stock: 30,
    concentration: 'EDP',
    targetAudience: 'unisex',
    brand: mockBrands[2],
    averageRating: 4.7,
    createdAt: '2024-02-01T00:00:00.000Z'
  },
  {
    _id: 'p4',
    perfumeName: 'Aventus',
    uri: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400',
    price: 435.00,
    description: 'Celebrates strength, power and success. Perfect for the confident modern man who knows his worth.',
    ingredients: 'Pineapple, Birch, Musk, Oakmoss, Ambergris',
    volume: 100,
    stock: 15,
    concentration: 'EDP',
    targetAudience: 'male',
    brand: mockBrands[3],
    averageRating: 4.9,
    createdAt: '2024-02-10T00:00:00.000Z'
  },
  {
    _id: 'p5',
    perfumeName: 'Wood Sage & Sea Salt',
    uri: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400',
    price: 75.00,
    description: 'Escape to the windswept shore with this mineral fragrance. Fresh, clean and utterly unique.',
    ingredients: 'Ambrette Seeds, Sea Salt, Sage, Red Algae, Grapefruit',
    volume: 100,
    stock: 50,
    concentration: 'Cologne',
    targetAudience: 'unisex',
    brand: mockBrands[4],
    averageRating: 4.3,
    createdAt: '2024-02-15T00:00:00.000Z'
  },
  {
    _id: 'p6',
    perfumeName: 'Eros',
    uri: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6e?w=400',
    price: 95.00,
    description: 'Masculine and confident, the Eros fragrance fuses woody, oriental and fresh notes for a powerful perfume.',
    ingredients: 'Mint, Green Apple, Tonka Bean, Geranium, Vanilla',
    volume: 100,
    stock: 40,
    concentration: 'EDT',
    targetAudience: 'male',
    brand: mockBrands[5],
    averageRating: 4.5,
    createdAt: '2024-03-01T00:00:00.000Z'
  },
  {
    _id: 'p7',
    perfumeName: 'J\'adore',
    uri: 'https://images.unsplash.com/photo-1528821154947-1aa3d1b74941?w=400',
    price: 135.00,
    description: 'A timeless fragrance celebrating the joy of living. An extraordinarily sensual floral bouquet.',
    ingredients: 'Ylang-Ylang, Damascus Rose, Jasmine, Tuberose',
    volume: 100,
    stock: 55,
    concentration: 'EDP',
    targetAudience: 'female',
    brand: mockBrands[1],
    averageRating: 4.7,
    createdAt: '2024-03-10T00:00:00.000Z'
  },
  {
    _id: 'p8',
    perfumeName: 'Tobacco Vanille',
    uri: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
    price: 250.00,
    description: 'Opulent. Warm. Iconic. Reinventing classic tobacco with creamy tonka bean, vanilla, and dried fruits.',
    ingredients: 'Tobacco Leaf, Vanilla, Cocoa, Tonka Bean, Dried Fruits',
    volume: 50,
    stock: 20,
    concentration: 'EDP',
    targetAudience: 'unisex',
    brand: mockBrands[2],
    averageRating: 4.8,
    createdAt: '2024-03-20T00:00:00.000Z'
  },
  {
    _id: 'p9',
    perfumeName: 'Bleu de Chanel',
    uri: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400',
    price: 130.00,
    description: 'An ode to masculine freedom, an aromatic woody fragrance with a captivating trail.',
    ingredients: 'Grapefruit, Incense, Ginger, Cedar, Sandalwood',
    volume: 100,
    stock: 65,
    concentration: 'EDP',
    targetAudience: 'male',
    brand: mockBrands[0],
    averageRating: 4.6,
    createdAt: '2024-04-01T00:00:00.000Z'
  },
  {
    _id: 'p10',
    perfumeName: 'English Pear & Freesia',
    uri: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400',
    price: 75.00,
    description: 'The essence of autumn. The sensuous freshness of just-ripe pears wrapped in a bouquet of white freesias.',
    ingredients: 'Pear, Freesia, Patchouli, Amber, Rose',
    volume: 100,
    stock: 45,
    concentration: 'Cologne',
    targetAudience: 'female',
    brand: mockBrands[4],
    averageRating: 4.4,
    createdAt: '2024-04-10T00:00:00.000Z'
  },
  {
    _id: 'p11',
    perfumeName: 'La Vie Est Belle',
    uri: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400',
    price: 120.00,
    description: 'The fragrance of happiness. A sweet, floral perfume that makes you feel beautiful and confident.',
    ingredients: 'Iris, Patchouli, Praline, Vanilla, Orange Blossom',
    volume: 100,
    stock: 50,
    concentration: 'EDP',
    targetAudience: 'female',
    brand: mockBrands[1],
    averageRating: 4.5,
    createdAt: '2024-04-20T00:00:00.000Z'
  },
  {
    _id: 'p12',
    perfumeName: 'Silver Mountain Water',
    uri: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    price: 365.00,
    description: 'A fresh, modern scent evoking sparkling streams running through the Swiss Alps.',
    ingredients: 'Bergamot, Mandarin, Green Tea, Blackcurrant, Musk',
    volume: 100,
    stock: 25,
    concentration: 'EDP',
    targetAudience: 'unisex',
    brand: mockBrands[3],
    averageRating: 4.6,
    createdAt: '2024-05-01T00:00:00.000Z'
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    _id: 'c1',
    rating: 5,
    content: 'Absolutely stunning fragrance! Long-lasting and elegant. My new signature scent.',
    author: mockMembers[1],
    perfume: 'p1',
    createdAt: '2024-06-01T10:30:00.000Z'
  },
  {
    _id: 'c2',
    rating: 4,
    content: 'Great scent for daily wear. A bit strong at first but settles nicely.',
    author: mockMembers[2],
    perfume: 'p1',
    createdAt: '2024-06-05T14:20:00.000Z'
  },
  {
    _id: 'c3',
    rating: 5,
    content: 'The best masculine fragrance I\'ve ever owned. Gets compliments everywhere!',
    author: mockMembers[3],
    perfume: 'p2',
    createdAt: '2024-06-10T09:15:00.000Z'
  },
  {
    _id: 'c4',
    rating: 5,
    content: 'Sophisticated and unique. Perfect for evening wear.',
    author: mockMembers[1],
    perfume: 'p3',
    createdAt: '2024-06-12T16:45:00.000Z'
  },
  {
    _id: 'c5',
    rating: 5,
    content: 'Worth every penny! The scent is incredible and lasts all day.',
    author: mockMembers[2],
    perfume: 'p4',
    createdAt: '2024-06-15T11:00:00.000Z'
  },
  {
    _id: 'c6',
    rating: 4,
    content: 'Fresh and clean. Great for summer!',
    author: mockMembers[3],
    perfume: 'p5',
    createdAt: '2024-06-18T13:30:00.000Z'
  },
  {
    _id: 'c7',
    rating: 4,
    content: 'Bold and powerful. Not for the faint of heart!',
    author: mockMembers[1],
    perfume: 'p6',
    createdAt: '2024-06-20T15:20:00.000Z'
  },
  {
    _id: 'c8',
    rating: 5,
    content: 'Timeless classic. Always get compliments when wearing this.',
    author: mockMembers[2],
    perfume: 'p7',
    createdAt: '2024-06-22T10:10:00.000Z'
  }
];

// Mock AI Summaries
export const mockAISummaries: AISummary[] = [
  {
    perfumeId: 'p1',
    summary: 'Users love this elegant and sophisticated fragrance. Highly praised for its long-lasting nature and versatility. Perfect for both day and evening wear. 95% positive sentiment.',
    similarPerfumes: ['p7', 'p11'],
    lastUpdated: '2024-06-25T00:00:00.000Z'
  },
  {
    perfumeId: 'p2',
    summary: 'Consistently rated as one of the best masculine fragrances. Users appreciate its fresh yet woody character. Great longevity and projection. 92% positive sentiment.',
    similarPerfumes: ['p9', 'p6'],
    lastUpdated: '2024-06-25T00:00:00.000Z'
  },
  {
    perfumeId: 'p3',
    summary: 'A bold, statement fragrance that divides opinion. Those who love it really love it. Best for evening and special occasions. 88% positive sentiment.',
    similarPerfumes: ['p8', 'p4'],
    lastUpdated: '2024-06-25T00:00:00.000Z'
  },
  {
    perfumeId: 'p4',
    summary: 'Legendary status in the fragrance community. Premium quality with exceptional performance. Users note its confidence-boosting character. 97% positive sentiment.',
    similarPerfumes: ['p2', 'p9'],
    lastUpdated: '2024-06-25T00:00:00.000Z'
  }
];


