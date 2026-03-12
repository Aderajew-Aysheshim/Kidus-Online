'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    home: 'Home',
    instruments: 'Instruments',
    classes: 'Classes',
    contact: 'Contact',
    myAccount: 'My Account',
    orderNow: 'Order Now',
    shop: 'Shop',
    learn: 'Learn',
    welcome: 'Welcome to Kidus Online',
    heroTitle: 'Learn and Own Order Ethiopian Instruments',
    heroDesc: 'Discover the Kirar and Begena—instruments with centuries of cultural heritage. Learn from experienced musicians and own handcrafted pieces delivered worldwide.',
    shopInstruments: 'Shop Instruments',
    exploreClasses: 'Explore Classes',
    studentsWorldwide: 'Students Worldwide',
    countriesServed: 'Countries Served',
    yearsOfExcellence: 'Years of Excellence',
    ourInstruments: 'Our Instruments',
    handcrafted: 'Handcrafted by Master Artisans',
    handcraftedDesc: 'Each instrument is crafted with traditional techniques and premium materials, ready for immediate worldwide delivery.',
    kirar: 'Kirar',
    traditionalLyre: 'Traditional Ethiopian Lyre',
    kiraDesc: '5-10 stringed instrument perfect for beginners and musicians seeking authentic Ethiopian sound and spiritual connection.',
    addToCart: 'Add to Cart',
    begena: 'Begena',
    grandHarp: 'Grand Ethiopian Harp',
    begenaDesc: '10-13 stringed instrument with deep spiritual significance. A masterpiece of traditional Ethiopian craftsmanship and artistry.',
    onlineCourses: 'Online Courses',
    learnTraditional: 'Learn Traditional Techniques',
    learnDesc: 'Expert-led courses designed to teach you authentic Ethiopian instrument techniques from the comfort of your home.',
    begenaCourseName: 'Begena Course',
    kiraCourseName: 'Kirar Course',
    masterBegeana: 'Master the ancient 10-13 stringed Ethiopian harp. Learn traditional techniques and spiritual music practices.',
    learnKirar: 'Learn the 5-10 stringed Ethiopian lyre. Ideal for beginners and musicians of all levels.',
    duration: 'Duration',
    classSize: 'Class Size',
    enrollNow: 'Enroll Now',
    qualityCraftsmanship: 'Quality & Craftsmanship',
    masterArtisanTech: 'Master Artisan Techniques',
    meticulouslyCrafted: 'Each instrument is meticulously crafted by experienced artisans using sustainable materials and traditional Ethiopian techniques perfected over generations.',
    sustainableWood: 'Premium sustainably-sourced wood',
    handCarving: 'Traditional hand-carving techniques',
    qualityTested: 'Quality tested before shipment',
    careGuide: 'Care guide and lifetime support included',
    worldwideShipping: 'Worldwide Shipping',
    secureDelivery: 'Secure delivery to 50+ countries in 5-10 days',
    groupDiscounts: 'Group Discounts',
    specialRates: 'Special rates for groups and educational institutions',
    culturalHeritage: 'Cultural Heritage',
    spiritualPractice: 'Instruments for spiritual practice and cultural connection',
    connectWithUs: 'Connect With Us',
    reachOut: 'Reach out through your preferred channel for inquiries or support',
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    email: 'Email',
    account: 'Account',
    contactForm: 'Contact form',
    viewOrders: 'View orders',
    allRightsReserved: 'All rights reserved. Preserving Ethiopian musical traditions.',
    cart: 'Cart',
    checkout: 'Checkout',
    confirmation: 'Order Confirmation',
    shippingInfo: 'Shipping Information',
    paymentInfo: 'Payment Information',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    tax: 'Tax',
    shipping: 'Shipping',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    placeOrder: 'Place Order',
    enrollmentConfirm: 'Enrollment Confirmed',
    courseDetails: 'Course Details',
    studentInfo: 'Student Information',
    schedule: 'Schedule',
    startDate: 'Start Date',
    contactSupport: 'Contact Support',
    viewMyOrders: 'View My Orders',
    noOrders: 'No orders yet',
    startShopping: 'Start Shopping',
    noEnrollments: 'No course enrollments yet',
    browseCourses: 'Browse Courses',
    contactUsForm: 'Contact Us',
    message: 'Message',
    sendMessage: 'Send Message',
    messageSent: 'Message sent successfully!',
    fillRequired: 'Please fill in all required fields',
    deliveryDays: '5-10 days delivery',
    groupDiscount: 'Available for groups and families',
    preservingHeritage: 'Preserving Ethiopian musical heritage through authentic instruments and expert education worldwide.'
  },
  am: {
    home: 'መነሻ',
    instruments: 'መሳሪያዎች',
    classes: 'ክፍሎች',
    contact: 'ግንኙነት',
    myAccount: 'ሂሳቤ',
    orderNow: 'አሁን ይዘዙ',
    shop: 'ይግዙ',
    learn: 'ይማሩ',
    welcome: 'ወደ Kidus Online እንኳን ደህና መጡ',
    heroTitle: 'እውነተኛ ኢትዮጵያዊ መሳሪያዎችን ይማሩ እና ይዘዙ',
    heroDesc: 'ክራር እና በገናን - ከመቶ ሐYear ዓመታት ባህላዊ ሂሳብ ያላቸው መሳሪያዎችን ይወቅሙ። ከተለያዩ ሙዚቀኞች ይማሩ እና ሙሉ ዓለም ሊደርሳችሁ በሚችሉ የእጅ-ሰሪ ክፍሎች ይዘዙ።',
    shopInstruments: 'መሳሪያዎችን ይግዙ',
    exploreClasses: 'ክፍሎችን ይመልከቱ',
    studentsWorldwide: 'ሙሉ ዓለም ተማሪዎች',
    countriesServed: 'ተገልግሉ ሀገሮች',
    yearsOfExcellence: 'ምርጥ ዓመታት',
    ourInstruments: 'የእኛ መሳሪያዎች',
    handcrafted: 'ከ Master Artisans የተሠሩ',
    handcraftedDesc: 'እያንዳንዱ መሣሪያ ባህላዊ ቴክኒኮችን እና ከፍ ያለ ጥራት ያላቸው ነገሮችን በመጠቀም የተሰሩ ናቸው፣ ወዲያውኑ ሙሉ ዓለም ሊደርሳቸው ይችላሉ።',
    kirar: 'ክራር',
    traditionalLyre: 'ባህላዊ ኢትዮጵያዊ ሊይር',
    kiraDesc: '5-10 የተዋይኖ መሣሪያ፣ አዲስ ጡረታ ወደ ሙዚቃ ከሚታደገሞ ሙዚቀኞች ጋር ትክክለኛ ኢትዮጵያዊ ድምጽ የሚያስተምር እና ሊሆን ይችላል።',
    addToCart: 'ወደ ሳጥንሕ ያክሉ',
    begena: 'በገና',
    grandHarp: 'ታላቅ ኢትዮጵያዊ Harp',
    begenaDesc: '10-13 የተዋይኖ መሣሪያ ጠቅላላ መንፈሳዊ ጠቀሞት ያለበት። የባህላዊ ኢትዮጵያዊ ጭበቃ መበርታትና ዱካ ምርምርነት ምክንያት።',
    onlineCourses: 'ኦንላይን ኮርሶች',
    learnTraditional: 'ባህላዊ ቴክኒኮችን ይማሩ',
    learnDesc: 'ከ Expert-ተሪ ሰርተዩ ኢትዮጵያዊ መሳሪያ ቴክኒኮችን ከ ቤተሰቦ ምቾ ኮንቴይነር ተመልከት ውስጥ ተዳላሪ ለመሆን ዲዛይን ተደርጎ።',
    begenaCourseName: 'በገና ኮርስ',
    kiraCourseName: 'ክራር ኮርስ',
    masterBegeana: 'ጥንታዊ 10-13 የተዋይኖ ኢትዮጵያዊ harp ላይ ያስከበሩ። ባህላዊ ቴክኒኮችን እና መንፈሳዊ ሙዚቃ ልምምድ ይማሩ።',
    learnKirar: 'ባህላዊ 5-10 ተዋይኖ ኢትዮጵያዊ ሊይር ይማሩ። ለአዲስ ሙዚቀኞች እና ሁሉም ደረጃ ሙዚቀኞች ተስማሚ።',
    duration: 'ጊዜ',
    classSize: 'ክፍል መጠን',
    enrollNow: 'አሁን ተመዝገቡ',
    qualityCraftsmanship: 'ጥራት እና ጭበቃ',
    masterArtisanTech: 'Master Artisan ቴክኒኮች',
    meticulouslyCrafted: 'እያንዳንዱ መሣሪያ ከተሞክሮ ያላቸው ጭበቃ-ኤሞን ሙሉ ቁሳቁስ በሚጠቀሙበት ቅደም ተከተል ባህላዊ ኢትዮጵያዊ ቴክኒኮች በመጠቀም ላይ ነው።',
    sustainableWood: 'ከፍ ያለ ጥራት ተሸካሚ-ምንጭ እንጨት',
    handCarving: 'ባህላዊ ሥራ-የተነሳ ቴክኒኮች',
    qualityTested: 'ወደ ፍትሕ ከመላክ በፊት ጥራት በተሞክሮ ተቸላሽ ነበር',
    careGuide: 'ተደግ ስብሰባ መመሪያ እና የቅድም ትብብር ይገናበታል',
    worldwideShipping: 'ዓለም ሙሉ ማሰከሪ',
    secureDelivery: 'ደህንነቱን ለማስጠበቅ ከ50+ ሀገሮች ወደ 5-10 ቀን ውስጥ ማጠጋገዝ',
    groupDiscounts: 'ሩብ ቅናሾች',
    specialRates: 'ሩብ እና ትምህርት ተቋሞች ያላቸው ልዩ ታሪፎች',
    culturalHeritage: 'ባህላዊ ውርስ',
    spiritualPractice: 'መንፈሳዊ ልምምድ እና ባህላዊ ግንኙነት ለሚለው መሳሪያዎች',
    connectWithUs: 'ከእኛ ጋር ይገናኙ',
    reachOut: 'ጥያቄ ወይም ድጋፍ ለመጠየቅ ምርጥ ቻናሎ በኩል ይገናኙ',
    telegram: 'ቴሌግራም',
    whatsapp: 'ዋትስአፕ',
    email: 'ኢሜይል',
    account: 'መግለጫ',
    contactForm: 'ግንኙነት ፎርም',
    viewOrders: 'ትዕዛዞችን ይመልከቱ',
    allRightsReserved: 'ሁሉም መብቶች የተጠበቁ ናቸው። ኢትዮጵያዊ ሙዚቃ ውርስ ይጠብቃል።',
    cart: 'ሳጥን',
    checkout: 'ስሌት',
    confirmation: 'ትዕዛዝ ማረጋገጫ',
    shippingInfo: 'የመላክ መረጃ',
    paymentInfo: 'የክፍያ መረጃ',
    orderSummary: 'ትዕዛዝ ማጠቃለያ',
    subtotal: 'ንዑስ ድምር',
    tax: 'ግ세',
    shipping: 'ማሰከር',
    total: 'ሙሉ',
    proceedToCheckout: 'ስሌት ወደ ተግባር',
    name: 'ስም',
    email: 'ኢሜይል',
    phone: 'ስልክ',
    address: 'አድራሻ',
    cardNumber: 'ካርድ ቁጥር',
    expiryDate: 'የስብሰባ ታሪክ',
    cvv: 'CVV',
    placeOrder: 'ትዕዛዝ ያስቀምጡ',
    enrollmentConfirm: 'ምዝገባ ያረጋግጡ',
    courseDetails: 'ኮርስ ዝርዝር',
    studentInfo: 'ተማሪ መረጃ',
    schedule: 'መርሐግብር',
    startDate: 'የመጀመር ቀን',
    deliveryDays: '5-10 ቀን ማሰከር',
    groupDiscount: 'ለቡድን እና ምሁራኖች አለ',
    preservingHeritage: 'ኢትዮጵያዊ ሙዚቃ ውርስ ሙሉ ዓለም ውስጥ ነገር ገብ ሰሪ መሳሪያዎች እና ስሌት እንደገና አግኝ።'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'am' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
