import type { ProductImage } from "@/types/product-image";

export type Product = {
  id: number;

  name: string;

  englishName: string;

  slug: string;

  shortDescription: string;

  description: string;

  regularPrice: number;

  salePrice?: number;

  discountEnabled?: boolean;

  discountPrice?: number;

  discountStartAt?: string;

  discountEndAt?: string;

  stock: number;

  badge?: string;

  category: string;

  size: string;

  sku: string;

  usageInfo: string;

  images?: ProductImage[];
};

export const allProducts: Product[] = [
  {
    id: 1,
    name: "হেয়ার কেয়ার টনিক",
    englishName: "Hair Care Tonic",
    slug: "hair-care-tonic",
    shortDescription:
      "চুলের নিয়মিত যত্নে ব্যবহারের জন্য একটি হোমিওপ্যাথিক প্রোডাক্ট।",
    description:
      "চুল ও স্ক্যাল্পের নিয়মিত যত্নের জন্য এই প্রোডাক্টটি রাখা হয়েছে। ব্যবহার করার আগে প্রয়োজন অনুযায়ী চিকিৎসক বা সংশ্লিষ্ট পেশাজীবীর পরামর্শ নেওয়া যেতে পারে।",
    regularPrice: 650,
    salePrice: 550,
    stock: 15,
    badge: "জনপ্রিয়",
    category: "Hair Care",
    size: "100 ml",
    sku: "HC-001",
    usageInfo:
      "ব্যবহারের সঠিক নিয়ম ও পরিমাণ Product Label অথবা চিকিৎসকের নির্দেশনা অনুযায়ী অনুসরণ করুন।",
  },
  {
    id: 2,
    name: "স্কিন কেয়ার ড্রপ",
    englishName: "Skin Care Drop",
    slug: "skin-care-drop",
    shortDescription:
      "ত্বকের যত্নে প্রয়োজন অনুযায়ী ব্যবহারের জন্য একটি নির্বাচিত প্রোডাক্ট।",
    description:
      "ত্বকের সাধারণ যত্নের জন্য প্রোডাক্টটি রাখা হয়েছে। ব্যক্তিভেদে প্রয়োজন ভিন্ন হতে পারে, তাই প্রয়োজন অনুযায়ী উপযুক্ত পরামর্শ নেওয়া ভালো।",
    regularPrice: 480,
    stock: 10,
    badge: "Best Seller",
    category: "Skin Care",
    size: "30 ml",
    sku: "SC-002",
    usageInfo:
      "ব্যবহারের আগে Product Label এবং প্রয়োজনীয় নির্দেশনা অনুসরণ করুন।",
  },
  {
    id: 3,
    name: "ডাইজেস্টিভ কেয়ার",
    englishName: "Digestive Care",
    slug: "digestive-care",
    shortDescription:
      "পেট ও হজমের সাধারণ যত্নের জন্য ব্যবহৃত একটি হোমিওপ্যাথিক প্রোডাক্ট।",
    description:
      "হজম ও দৈনন্দিন পেটের সাধারণ যত্নের উদ্দেশ্যে এই প্রোডাক্টটি রাখা হয়েছে। দীর্ঘস্থায়ী বা গুরুতর সমস্যার ক্ষেত্রে চিকিৎসকের পরামর্শ নেওয়া উচিত।",
    regularPrice: 520,
    salePrice: 460,
    stock: 8,
    badge: "Offer",
    category: "Digestive Care",
    size: "30 ml",
    sku: "DC-003",
    usageInfo:
      "প্রয়োজন অনুযায়ী চিকিৎসকের নির্দেশনা অথবা Product Label অনুসরণ করুন।",
  },
  {
    id: 4,
    name: "জেনারেল ওয়েলনেস ড্রপ",
    englishName: "General Wellness Drop",
    slug: "general-wellness-drop",
    shortDescription:
      "দৈনন্দিন স্বাস্থ্য ও সাধারণ সুস্থতার যত্নে ব্যবহারের জন্য।",
    description:
      "দৈনন্দিন wellness routine-এর অংশ হিসেবে ব্যবহারের জন্য এই প্রোডাক্টটি রাখা হয়েছে।",
    regularPrice: 390,
    stock: 20,
    category: "Wellness",
    size: "30 ml",
    sku: "GW-004",
    usageInfo:
      "Product Label-এ দেওয়া নির্দেশনা অনুসরণ করুন।",
  },
  {
    id: 5,
    name: "চিলড্রেন ওয়েলনেস ড্রপ",
    englishName: "Children Wellness Drop",
    slug: "children-wellness-drop",
    shortDescription:
      "শিশুদের সাধারণ wellness care-এর জন্য রাখা একটি প্রোডাক্ট।",
    description:
      "শিশুদের ক্ষেত্রে যেকোনো স্বাস্থ্যসংক্রান্ত প্রোডাক্ট ব্যবহারের আগে বয়স ও প্রয়োজন অনুযায়ী চিকিৎসকের পরামর্শ নেওয়া ভালো।",
    regularPrice: 450,
    stock: 12,
    category: "Children Care",
    size: "30 ml",
    sku: "CC-005",
    usageInfo:
      "শিশুদের ক্ষেত্রে চিকিৎসকের পরামর্শ ছাড়া ব্যবহার না করাই উত্তম।",
  },
  {
    id: 6,
    name: "বডি কেয়ার অয়েল",
    englishName: "Body Care Oil",
    slug: "body-care-oil",
    shortDescription:
      "শরীরের বাহ্যিক ও দৈনন্দিন যত্নের জন্য একটি Body Care Product।",
    description:
      "দৈনন্দিন body care routine-এর জন্য ব্যবহারযোগ্য একটি বাহ্যিক প্রোডাক্ট।",
    regularPrice: 720,
    salePrice: 650,
    stock: 7,
    badge: "New",
    category: "Body Care",
    size: "120 ml",
    sku: "BC-006",
    usageInfo:
      "শুধু বাহ্যিক ব্যবহারের ক্ষেত্রে Product Label-এর নির্দেশনা অনুসরণ করুন।",
  },
  {
    id: 7,
    name: "হারবাল হেয়ার অয়েল",
    englishName: "Herbal Hair Oil",
    slug: "herbal-hair-oil",
    shortDescription:
      "চুল ও স্ক্যাল্পের নিয়মিত পরিচর্যার জন্য একটি Hair Care Product।",
    description:
      "চুলের দৈনন্দিন পরিচর্যার জন্য প্রোডাক্টটি ব্যবহার করা যেতে পারে।",
    regularPrice: 590,
    stock: 16,
    category: "Hair Care",
    size: "100 ml",
    sku: "HC-007",
    usageInfo:
      "প্রয়োজন অনুযায়ী অল্প পরিমাণ ব্যবহার করুন এবং Product Label অনুসরণ করুন।",
  },
  {
    id: 8,
    name: "স্কিন কেয়ার ক্রিম",
    englishName: "Skin Care Cream",
    slug: "skin-care-cream",
    shortDescription:
      "দৈনন্দিন Skin Care Routine-এর জন্য একটি নির্বাচিত ক্রিম।",
    description:
      "ত্বকের বাহ্যিক যত্নের জন্য ব্যবহারযোগ্য একটি Skin Care Product।",
    regularPrice: 680,
    salePrice: 620,
    stock: 9,
    category: "Skin Care",
    size: "50 gm",
    sku: "SC-008",
    usageInfo:
      "ব্যবহারের আগে অল্প জায়গায় পরীক্ষা করুন এবং Product Label অনুসরণ করুন।",
  },
];

export const featuredProducts = allProducts.slice(0, 4);