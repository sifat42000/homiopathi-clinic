export type TreatmentIcon =
  | "stethoscope"
  | "sparkles"
  | "heartPulse"
  | "baby"
  | "heart"
  | "activity";

export type Treatment = {
  id: number;
  title: string;
  englishTitle: string;
  slug: string;
  description: string;
  fullDescription: string;
  icon: TreatmentIcon;
  fee: number;
  duration: number;
  availability: string;
};

export const treatments: Treatment[] = [
  {
    id: 1,
    title: "সাধারণ স্বাস্থ্য পরামর্শ",
    englishTitle: "General Consultation",
    slug: "general-consultation",
    description:
      "সাধারণ স্বাস্থ্য সমস্যা ও প্রয়োজন অনুযায়ী চিকিৎসকের পরামর্শ নেওয়ার সুবিধা।",
    fullDescription:
      "দৈনন্দিন বিভিন্ন সাধারণ স্বাস্থ্য সমস্যা, শারীরিক অস্বস্তি এবং প্রয়োজনীয় স্বাস্থ্যসংক্রান্ত বিষয়ে চিকিৎসকের সাথে সরাসরি পরামর্শ নেওয়ার জন্য এই Consultation Service রাখা হয়েছে। রোগীর বর্তমান অবস্থা ও প্রয়োজন অনুযায়ী চিকিৎসক প্রয়োজনীয় দিকনির্দেশনা প্রদান করবেন।",
    icon: "stethoscope",
    fee: 500,
    duration: 20,
    availability: "Appointment অনুযায়ী",
  },

  {
    id: 2,
    title: "ত্বক ও চুলের পরামর্শ",
    englishTitle: "Skin & Hair Consultation",
    slug: "skin-hair",
    description:
      "ত্বক ও চুল সম্পর্কিত বিভিন্ন সমস্যায় চিকিৎসকের সাথে পরামর্শের সুবিধা।",
    fullDescription:
      "চুল, স্ক্যাল্প এবং ত্বক সম্পর্কিত বিভিন্ন সমস্যা বা দৈনন্দিন যত্নের বিষয়ে চিকিৎসকের সাথে বিস্তারিত আলোচনা ও পরামর্শ নেওয়ার সুবিধা এখানে থাকবে।",
    icon: "sparkles",
    fee: 600,
    duration: 25,
    availability: "Appointment অনুযায়ী",
  },

  {
    id: 3,
    title: "হজম ও পেটের সমস্যা",
    englishTitle: "Digestive Health",
    slug: "digestive-health",
    description:
      "পেট, হজম ও সংশ্লিষ্ট সমস্যার ক্ষেত্রে প্রয়োজনীয় চিকিৎসা পরামর্শ।",
    fullDescription:
      "হজম, পেটের অস্বস্তি এবং সংশ্লিষ্ট সাধারণ স্বাস্থ্য সমস্যা নিয়ে চিকিৎসকের সাথে আলোচনা ও প্রয়োজনীয় পরামর্শ নেওয়া যাবে। দীর্ঘস্থায়ী বা গুরুতর সমস্যার ক্ষেত্রে প্রয়োজন অনুযায়ী উপযুক্ত চিকিৎসা সেবা গ্রহণের পরামর্শ দেওয়া হতে পারে।",
    icon: "heartPulse",
    fee: 550,
    duration: 20,
    availability: "Appointment অনুযায়ী",
  },

  {
    id: 4,
    title: "শিশুদের স্বাস্থ্য পরামর্শ",
    englishTitle: "Children Consultation",
    slug: "children",
    description:
      "শিশুদের সাধারণ স্বাস্থ্য সমস্যা নিয়ে চিকিৎসকের পরামর্শ নেওয়ার ব্যবস্থা।",
    fullDescription:
      "শিশুদের সাধারণ স্বাস্থ্য, দৈনন্দিন যত্ন এবং বিভিন্ন স্বাস্থ্যসংক্রান্ত বিষয়ে অভিভাবক চিকিৎসকের সাথে প্রয়োজনীয় আলোচনা করতে পারবেন।",
    icon: "baby",
    fee: 600,
    duration: 25,
    availability: "Appointment অনুযায়ী",
  },

  {
    id: 5,
    title: "নারীদের স্বাস্থ্য পরামর্শ",
    englishTitle: "Women's Health",
    slug: "womens-health",
    description:
      "নারীদের বিভিন্ন স্বাস্থ্য বিষয় নিয়ে ব্যক্তিগতভাবে পরামর্শের সুবিধা।",
    fullDescription:
      "নারীদের বিভিন্ন সাধারণ স্বাস্থ্য বিষয় নিয়ে ব্যক্তিগত ও সম্মানজনক পরিবেশে চিকিৎসকের সাথে পরামর্শের সুবিধা থাকবে।",
    icon: "heart",
    fee: 650,
    duration: 30,
    availability: "Appointment অনুযায়ী",
  },

  {
    id: 6,
    title: "জয়েন্ট ও শরীরের ব্যথা",
    englishTitle: "Joint & Body Care",
    slug: "joint-body-care",
    description:
      "শরীর ও জয়েন্টের বিভিন্ন অস্বস্তি বা ব্যথার বিষয়ে চিকিৎসা পরামর্শ।",
    fullDescription:
      "জয়েন্ট, শরীরের বিভিন্ন অংশের অস্বস্তি বা ব্যথা সম্পর্কে চিকিৎসকের সাথে বিস্তারিত আলোচনা এবং প্রয়োজন অনুযায়ী পরামর্শ নেওয়ার সুবিধা থাকবে।",
    icon: "activity",
    fee: 550,
    duration: 20,
    availability: "Appointment অনুযায়ী",
  },
];