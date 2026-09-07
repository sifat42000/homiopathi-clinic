export type Review = {
  id: number;
  name: string;
  review: string;
  rating: number;
  service: string;
  verified: boolean;
  initials: string;
  date: string;
};

export const reviews: Review[] = [
  {
    id: 1,
    name: "রহিমা আক্তার",
    review:
      "চেম্বারে যোগাযোগ এবং অ্যাপয়েন্টমেন্ট নেওয়ার প্রক্রিয়াটি সহজ ছিল। চিকিৎসকও বিষয়গুলো সুন্দরভাবে বুঝিয়ে বলেছেন।",
    rating: 5,
    service: "General Consultation",
    verified: true,
    initials: "রা",
    date: "০৫ সেপ্টেম্বর ২০২৬",
  },
  {
    id: 2,
    name: "মো. হাসান",
    review:
      "প্রোডাক্ট সম্পর্কে প্রয়োজনীয় তথ্য সহজভাবে জানতে পেরেছি। অর্ডারের পুরো প্রক্রিয়াটাও বেশ সহজ ছিল।",
    rating: 5,
    service: "Product Customer",
    verified: true,
    initials: "হা",
    date: "০২ সেপ্টেম্বর ২০২৬",
  },
  {
    id: 3,
    name: "সাবিহা ইসলাম",
    review:
      "ওয়েবসাইট থেকে সময় দেখে অ্যাপয়েন্টমেন্ট নেওয়া বেশ সুবিধাজনক। প্রয়োজনীয় তথ্যগুলোও পরিষ্কারভাবে দেওয়া আছে।",
    rating: 5,
    service: "Appointment",
    verified: true,
    initials: "সা",
    date: "৩০ আগস্ট ২০২৬",
  },
  {
    id: 4,
    name: "মাহমুদুল হাসান",
    review:
      "সেবাগুলো সুন্দরভাবে সাজানো থাকায় প্রয়োজনীয় তথ্য খুব দ্রুত খুঁজে পেয়েছি।",
    rating: 4,
    service: "General Consultation",
    verified: true,
    initials: "মা",
    date: "২৬ আগস্ট ২০২৬",
  },
  {
    id: 5,
    name: "নাসরিন সুলতানা",
    review:
      "Appointment নেওয়ার ধাপগুলো সহজ ছিল এবং মোবাইল থেকেও Website ব্যবহার করতে কোনো সমস্যা হয়নি।",
    rating: 5,
    service: "Appointment",
    verified: true,
    initials: "না",
    date: "২২ আগস্ট ২০২৬",
  },
  {
    id: 6,
    name: "সোহেল রানা",
    review:
      "Product Page-এ প্রয়োজনীয় তথ্য ও দাম পরিষ্কারভাবে দেওয়া ছিল। Overall experience ভালো।",
    rating: 4,
    service: "Product Customer",
    verified: true,
    initials: "সো",
    date: "১৯ আগস্ট ২০২৬",
  },
];