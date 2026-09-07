import type { LegalSection } from "@/components/legal/LegalPageContent";

export const privacyPolicySections: LegalSection[] = [
  {
    title: "১. আমরা কী তথ্য সংগ্রহ করতে পারি",
    paragraphs: [
      "Account Registration, Appointment, Product Order, Contact Form বা Review Submit করার সময় নাম, মোবাইল নম্বর, Email, Delivery Address এবং প্রয়োজনীয় অন্যান্য তথ্য সংগ্রহ করা হতে পারে।",
      "Backend চালু হওয়ার পর Website ব্যবহারের নিরাপত্তা ও কার্যকারিতার জন্য সীমিত Technical Information সংরক্ষণ করা হতে পারে।",
    ],
  },
  {
    title: "২. তথ্য কীভাবে ব্যবহার করা হবে",
    paragraphs: [
      "আপনার তথ্য Order Processing, Delivery, Appointment Management, Customer Support এবং প্রয়োজনীয় Account Service পরিচালনার জন্য ব্যবহার করা হবে।",
      "ব্যবহারকারীর অনুমতি ছাড়া অপ্রয়োজনীয় উদ্দেশ্যে ব্যক্তিগত তথ্য ব্যবহার করা উচিত নয়।",
    ],
  },
  {
    title: "৩. তথ্যের নিরাপত্তা",
    paragraphs: [
      "Backend Phase-এ Password সরাসরি Plain Text হিসেবে সংরক্ষণ করা হবে না। Authentication System-এর নিরাপদ পদ্ধতি ব্যবহার করা হবে।",
      "Website পরিচালনার জন্য প্রয়োজনীয় যুক্তিসঙ্গত Security Practice অনুসরণ করার পরিকল্পনা রয়েছে।",
    ],
  },
  {
    title: "৪. Third-party Services",
    paragraphs: [
      "Image Hosting, Email, Payment বা অন্যান্য প্রয়োজনের জন্য ভবিষ্যতে Cloudinary, Email Provider বা Payment Gateway-এর মতো Third-party Service ব্যবহার করা হতে পারে।",
    ],
  },
  {
    title: "৫. যোগাযোগ",
    paragraphs: [
      "Privacy সম্পর্কিত কোনো প্রশ্ন থাকলে Contact Page-এর মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারবেন।",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    title: "১. Website ব্যবহার",
    paragraphs: [
      "এই Website চিকিৎসকের তথ্য, Appointment Booking, Product Information এবং Product Order Service সহজভাবে ব্যবহারের জন্য তৈরি করা হচ্ছে।",
      "ইচ্ছাকৃতভাবে ভুল তথ্য প্রদান, Website-এর অপব্যবহার বা অন্য ব্যবহারকারীর ক্ষতি করার চেষ্টা গ্রহণযোগ্য নয়।",
    ],
  },
  {
    title: "২. Account Information",
    paragraphs: [
      "Account তৈরি করার সময় সঠিক ও নিজের তথ্য ব্যবহার করার দায়িত্ব ব্যবহারকারীর।",
      "নিজের Login Credential নিরাপদ রাখার দায়িত্বও Account Holder-এর।",
    ],
  },
  {
    title: "৩. Product Order",
    paragraphs: [
      "Product Price, Stock, Delivery Charge এবং Availability সময়ের সাথে পরিবর্তিত হতে পারে। Final Order Confirmation-এর সময় প্রযোজ্য তথ্য বিবেচিত হবে।",
      "Backend Phase-এ Order Admin Confirmation-এর পর চূড়ান্ত হিসেবে বিবেচিত করার ব্যবস্থা থাকবে।",
    ],
  },
  {
    title: "৪. Appointment",
    paragraphs: [
      "Online Appointment Request জমা দেওয়া মানেই Appointment চূড়ান্তভাবে Confirm হওয়া নয়। Doctor বা Admin-এর Confirmation প্রয়োজন হতে পারে।",
      "জরুরি চিকিৎসা প্রয়োজন হলে Website Appointment-এর জন্য অপেক্ষা না করে উপযুক্ত জরুরি চিকিৎসা সেবা গ্রহণ করা উচিত।",
    ],
  },
  {
    title: "৫. পরিবর্তন",
    paragraphs: [
      "Website-এর Feature, Terms, Product Information এবং Service Process প্রয়োজন অনুযায়ী পরিবর্তিত হতে পারে।",
    ],
  },
];

export const medicalDisclaimerSections: LegalSection[] = [
  {
    title: "১. সাধারণ স্বাস্থ্য তথ্য",
    paragraphs: [
      "এই Website-এর Health Tips, Product Description এবং অন্যান্য স্বাস্থ্যসংক্রান্ত লেখা সাধারণ তথ্য ও সচেতনতার জন্য। এগুলো ব্যক্তিগত রোগ নির্ণয় বা চিকিৎসা পরিকল্পনার বিকল্প নয়।",
    ],
  },
  {
    title: "২. চিকিৎসকের পরামর্শ",
    paragraphs: [
      "ব্যক্তিভেদে উপসর্গ, রোগ, ওষুধের ব্যবহার এবং চিকিৎসার প্রয়োজন ভিন্ন হতে পারে। ব্যক্তিগত চিকিৎসা সিদ্ধান্তের জন্য যোগ্য স্বাস্থ্যসেবা পেশাজীবীর পরামর্শ গ্রহণ করা উচিত।",
    ],
  },
  {
    title: "৩. Homeopathic Product",
    paragraphs: [
      "কোনো Product বা Homeopathic পদ্ধতি নির্দিষ্ট রোগ সম্পূর্ণ নিরাময়ের নিশ্চয়তা দেয়—এমন দাবি এই Website-এর উদ্দেশ্য নয়।",
      "গুরুতর বা দীর্ঘস্থায়ী সমস্যার ক্ষেত্রে প্রয়োজনীয় প্রমাণভিত্তিক চিকিৎসা বা জরুরি সেবা বিলম্বিত করা উচিত নয়।",
    ],
  },
  {
    title: "৪. জরুরি অবস্থা",
    paragraphs: [
      "তীব্র শ্বাসকষ্ট, অচেতনতা, গুরুতর আঘাত, বুকে তীব্র ব্যথা, অতিরিক্ত রক্তপাত বা অন্য কোনো জরুরি অবস্থায় Website-এর মাধ্যমে Appointment নেওয়ার অপেক্ষা না করে দ্রুত উপযুক্ত জরুরি চিকিৎসা সেবা গ্রহণ করুন।",
    ],
  },
  {
    title: "৫. Website Content",
    paragraphs: [
      "স্বাস্থ্যসংক্রান্ত তথ্য যথাসম্ভব সতর্কতার সাথে প্রকাশ করা হলেও তা ব্যক্তিগত Medical Evaluation-এর বিকল্প নয়।",
    ],
  },
];