// ============================================================================
//  Seed Data — Persian Villa & Hotel Booking Platform
// ============================================================================
import { db } from "../src/lib/db";

const categories = [
  { name: "ویلا", slug: "villa", icon: "home", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80" },
  { name: "هتل", slug: "hotel", icon: "building", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" },
  { name: "آپارتمان", slug: "apartment", icon: "building2", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" },
  { name: "اقامتگاه", slug: "resort", icon: "palmtree", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80" },
  { name: "کلبه", slug: "cottage", icon: "trees", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80" },
];

const destinations = [
  { name: "کیش", province: "هرمزگان", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80" },
  { name: "تهران", province: "تهران", image: "https://images.unsplash.com/photo-1565374395542-0ce18882c857?w=800&q=80" },
  { name: "اصفهان", province: "اصفهان", image: "https://sfile.chatglm.cn/images-ppt/021803365a05.jpg" },
  { name: "شیراز", province: "فارس", image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&q=80" },
  { name: "یزد", province: "یزد", image: "https://sfile.chatglm.cn/images-ppt/81ebebb4308d.jpg" },
  { name: "قشم", province: "هرمزگان", image: "https://sfile.chatglm.cn/images-ppt/984720cb3481.jpg" },
  { name: "مازندران", province: "مازندران", image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800&q=80" },
  { name: "گیلان", province: "گیلان", image: "https://sfile.chatglm.cn/images-ppt/2ab6bca167ad.jpg" },
];

const amenitiesList = [
  "wifi", "pool", "parking", "ac", "kitchen", "tv", "washer", "heater",
  "breakfast", "gym", "spa", "balcony", "garden", "bbq", "fireplace",
  "elevator", "security", "seaView", "mountainView", "petFriendly"
];

const img = (id: string) => id.startsWith("http") ? id : `https://images.unsplash.com/photo-${id}?w=1200&q=80`;

// Each property gets 4 distinct, relevant images matching its type & location.
// No image ID is reused across properties.
const propertyImages = {
  // 1. ویلا لوکس ساحلی کیش — coastal villa with sea view & pool
  kishVilla:     ["1512917774080-9991f1c4c750", "1571055107559-3e67626fa8be", "1582268611958-ebfd161ef9cf", "1542314831-068cd1dbfeeb"],
  // 2. هتل ۵ ستاره پارسیان تهران — modern hotel building & rooms
  tehranHotel:   ["1551882547-ff40c63fe5fa", "1566073771259-6a8506099945", "1455587734955-081b22074882", "1486325212027-8081e485255e"],
  // 3. آپارتمان مدرن سعادت‌آباد — modern apartment interior
  tehranApt:     ["1522708323590-d24dbb6b0267", "1560448204-e02f11c3d0e2", "1502672260266-1c1ef2d93688", "1494526585095-c41746248156"],
  // 4. اقامتگاه بوم‌گردی یزد — traditional Persian courtyard architecture
  yazdResort:    ["1600607687939-ce8a6c25118c", "1595872018818-97555653a011", "1524758631624-e2822e304c36", "1531973576160-7125cd663d86"],
  // 5. کلبه چوبی جنگل مازندران — wooden cabin in forest
  mazCottage:    ["1449844908441-8829872d2607", "1518780664697-55e3ad937233", "1505691938895-1758d7feb511", "1464822759023-fed622ff2c3b"],
  // 6. ویلا داریوش کیش — ultra-luxury villa with infinity pool
  dariushVilla:  ["1564507592333-c60657eea523", "1600210492486-724fe5c67fb0", "1600585154340-be6161a56a0c", "1568605114967-8130f3a36994"],
  // 7. هتل اسپیناس پالاس تهران — luxury hotel lobby & suite
  espinasHotel:  ["1571003123894-1f0594d2b5d9", "1582719508461-905c673771fd", "1564501049412-61c2a3083791", "1545324418-cc1a3fa10c00"],
  // 8. آپارتمان دنج اصفهان — Persian-style apartment near Naqsh-e Jahan
  isfahanApt:    ["https://sfile.chatglm.cn/images-ppt/33bc44f0cab6.jpg", "https://sfile.chatglm.cn/images-ppt/d9a6090ef579.jpg", "https://sfile.chatglm.cn/images-ppt/e8a51252d642.jpg", "https://sfile.chatglm.cn/images-ppt/6c5df13129a9.jpg"],
  // 9. اقامتگاه بوتیک شیراز — Persian boutique hotel with garden
  shirazBoutique:["1571896349842-33c89424de2d", "1540541338287-41700207dee6", "1520250497591-112f2f40a3f4", "1599809275671-b5942cabc7a2"],
  // 10. کلبه کوهستانی قشم — island/desert cottage
  qeshmCottage:  ["1602002418082-a4443e081dd1", "1521405924368-64c5b84bec60", "1613977257363-707ba9348227", "1571508601891-ca5e7a713859"],
  // 11. ویلا جنگلی گیلان — forest villa with greenery
  gilanVilla:    ["1564013799919-ab600027ffc6", "1494526585095-c41746248156", "1524758631624-e2822e304c36", "1531973576160-7125cd663d86"],
  // 12. هتل بزرگ شیراز — classic historic hotel
  shirazHotel:   ["1566073771259-6a8506099945", "1551882547-ff40c63fe5fa", "1455587734955-081b22074882", "1486325212027-8081e485255e"],
};

interface SeedProperty {
  title: string; type: string; city: string; province: string; address: string;
  lat: number; lng: number; pricePerNight: number; maxGuests: number; bedrooms: number;
  beds: number; bathrooms: number; size: number; description: string;
  images: string[]; amenities: string[]; rating: number;
}

const properties: SeedProperty[] = [
  {
    title: "ویلا لوکس ساحلی کیش", type: "villa", city: "کیش", province: "هرمزگان",
    address: "کیش، بلوار ساحل، ویلاهای لوکس", lat: 26.5501, lng: 53.9792,
    pricePerNight: 4500000, maxGuests: 8, bedrooms: 4, beds: 5, bathrooms: 3, size: 320,
    description: "ویلایی فوق‌العاده لوکس در بهترین موقعیت ساحلی جزیره کیش با دید پانوراما به دریا. این ویلا دارای استخر اختصاصی، محوطه وسیع سبز و دکوراسیون مدرن است. مناسب برای خانواده‌هایی که به دنبال آرامش و تجمل می‌باشند.",
    images: propertyImages.kishVilla.map(img), amenities: ["wifi","pool","parking","ac","kitchen","tv","washer","heater","balcony","garden","bbq","seaView","security"], rating: 4.9,
  },
  {
    title: "هتل ۵ ستاره پارسیان", type: "hotel", city: "تهران", province: "تهران",
    address: "تهران، خیابان ولیعصر، هتل پارسیان", lat: 35.7575, lng: 51.4099,
    pricePerNight: 2200000, maxGuests: 3, bedrooms: 1, beds: 2, bathrooms: 1, size: 55,
    description: "هتل ۵ ستاره پارسیان در قلب تهران با دسترسی آسان به مراکز خرید و تفریحی. اتاق‌های مدرن، رستوران بین‌المللی، استخر و باشگاه بدنسازی اختصاصی.",
    images: propertyImages.tehranHotel.map(img), amenities: ["wifi","pool","parking","ac","tv","breakfast","gym","spa","elevator","security"], rating: 4.7,
  },
  {
    title: "آپارتمان مدرن مرکز شهر", type: "apartment", city: "تهران", province: "تهران",
    address: "تهران، سعادت‌آباد، برج ماه", lat: 35.7722, lng: 51.3744,
    pricePerNight: 980000, maxGuests: 4, bedrooms: 2, beds: 3, bathrooms: 1, size: 95,
    description: "آپارتمان دنج و مدرن در یکی از بهترین محله‌های تهران. نزدیک به پارک، فروشگاه‌ها و مترو. مناسب برای مسافران تجاری و توریستی.",
    images: propertyImages.tehranApt.map(img), amenities: ["wifi","parking","ac","kitchen","tv","washer","heater","elevator","security"], rating: 4.6,
  },
  {
    title: "اقامتگاه بوم‌گردی یزد", type: "resort", city: "یزد", province: "یزد",
    address: "یزد، بافت تاریخی، اقامتگاه سنتی", lat: 31.8974, lng: 54.3569,
    pricePerNight: 1450000, maxGuests: 6, bedrooms: 3, beds: 4, bathrooms: 2, size: 180,
    description: "اقامتگاه سنتی بازسازی شده در بافت تاریخی یزد با معماری اصیل ایرانی. حیاط مرکزی، بادگیر و اتاق‌های زیبا. تجربه‌ای متفاوت از اقامت در شهر بادگیرها.",
    images: propertyImages.yazdResort.map(img), amenities: ["wifi","parking","ac","kitchen","tv","heater","breakfast","garden","balcony"], rating: 4.8,
  },
  {
    title: "کلبه چوبی جنگل مازندران", type: "cottage", city: "مازندران", province: "مازندران",
    address: "مازندران، جاده چالوس، کلبه‌های جنگلی", lat: 36.6500, lng: 51.4167,
    pricePerNight: 1150000, maxGuests: 5, bedrooms: 2, beds: 3, bathrooms: 1, size: 85,
    description: "کلبه چوبی دنج در دل جنگل‌های سرسبز مازندران. هوای پاک، صدای پرندگان و آرامش مطلق. مناسب برای فرار از هیاهوی شهر.",
    images: propertyImages.mazCottage.map(img), amenities: ["wifi","parking","ac","kitchen","tv","heater","fireplace","garden","bbq","mountainView","petFriendly"], rating: 4.7,
  },
  {
    title: "ویلا داریوش کیش", type: "villa", city: "کیش", province: "هرمزگان",
    address: "کیش، شهرک داریوش، ویلا ۲۴", lat: 26.5410, lng: 53.9801,
    pricePerNight: 6200000, maxGuests: 10, bedrooms: 5, beds: 6, bathrooms: 4, size: 450,
    description: "ویلایی پادشاهی در شهرک اختصاصی داریوش کیش. با استخر بی‌نهایت، جکوزی، سونا و فضای وسیع. تجربه‌ای بی‌نظیر از اقامت لوکس.",
    images: propertyImages.dariushVilla.map(img), amenities: ["wifi","pool","parking","ac","kitchen","tv","washer","heater","gym","spa","balcony","garden","bbq","fireplace","seaView","security"], rating: 5.0,
  },
  {
    title: "هتل اسپیناس پالاس", type: "hotel", city: "تهران", province: "تهران",
    address: "تهران، شیخ بهایی، هتل اسپیناس", lat: 35.7588, lng: 51.4100,
    pricePerNight: 3100000, maxGuests: 4, bedrooms: 1, beds: 2, bathrooms: 1, size: 75,
    description: "هتل مجلل اسپیناس پالاس با شیک‌ترین اتاق‌های تهران. رستوران‌های بین‌المللی، مرکز خرید و امکانات کامل تفریحی.",
    images: propertyImages.espinasHotel.map(img), amenities: ["wifi","pool","parking","ac","tv","breakfast","gym","spa","elevator","security"], rating: 4.8,
  },
  {
    title: "آپارتمان دنج اصفهان", type: "apartment", city: "اصفهان", province: "اصفهان",
    address: "اصفهان، خیابان چهارباغ، مجتمع مسکونی", lat: 32.6539, lng: 51.6660,
    pricePerNight: 850000, maxGuests: 3, bedrooms: 1, beds: 2, bathrooms: 1, size: 70,
    description: "آپارتمان زیبا در نزدیکی میدان نقش جهان. دسترسی پیاده به جاذبه‌های تاریخی. دکوراسیون سنتی و مدرن.",
    images: propertyImages.isfahanApt.map(img), amenities: ["wifi","parking","ac","kitchen","tv","washer","heater","elevator"], rating: 4.5,
  },
  {
    title: "اقامتگاه بوتیک شیراز", type: "resort", city: "شیراز", province: "فارس",
    address: "شیراز، محله قدم‌جاد، بوتیک‌هتل", lat: 29.5918, lng: 52.5837,
    pricePerNight: 1680000, maxGuests: 5, bedrooms: 2, beds: 3, bathrooms: 2, size: 140,
    description: "بوتیک‌هتل سنتی در قلب شیراز تاریخی. حیاطی زیبا با حوض و گل‌ها، اتاق‌های بازسازی شده با معماری قاجار. نزدیک به باغ ارم و حافظیه.",
    images: propertyImages.shirazBoutique.map(img), amenities: ["wifi","parking","ac","kitchen","tv","heater","breakfast","garden","balcony"], rating: 4.9,
  },
  {
    title: "کلبه کوهستانی قشم", type: "cottage", city: "قشم", province: "هرمزگان",
    address: "قشم، روستای تلا، کلبه کوهستانی", lat: 26.7561, lng: 55.8731,
    pricePerNight: 980000, maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 1, size: 65,
    description: "کلبه‌ای زیبا در جزیره قشم با دید به دره‌های شگفت‌انگیز. مناسب برای علاقه‌مندان به طبیعت‌گردی و ماجراجویی.",
    images: propertyImages.qeshmCottage.map(img), amenities: ["wifi","parking","ac","kitchen","tv","heater","garden","bbq","mountainView","petFriendly"], rating: 4.6,
  },
  {
    title: "ویلا جنگلی گیلان", type: "villa", city: "گیلان", province: "گیلان",
    address: "گیلان، جاده رشت، ویلاهای جنگلی", lat: 37.2809, lng: 49.5832,
    pricePerNight: 1850000, maxGuests: 7, bedrooms: 3, beds: 4, bathrooms: 2, size: 220,
    description: "ویلایی زیبا در دل جنگل‌های هیرکانی گیلان. با استخر، محوطه وسیع و دید به جنگل. هوای مطبوع و آرامش کامل.",
    images: propertyImages.gilanVilla.map(img), amenities: ["wifi","pool","parking","ac","kitchen","tv","washer","heater","balcony","garden","bbq","fireplace","mountainView","petFriendly","security"], rating: 4.8,
  },
  {
    title: "هتل بزرگ شیراز", type: "hotel", city: "شیراز", province: "فارس",
    address: "شیراز، زند، هتل بزرگ", lat: 29.6107, lng: 52.5450,
    pricePerNight: 1950000, maxGuests: 3, bedrooms: 1, beds: 2, bathrooms: 1, size: 60,
    description: "هتل تاریخی بزرگ شیراز با معماری کلاسیک. در مرکز شهر و نزدیک به همه جاذبه‌ها. خدمت رسانی با سابقه‌ای طولانی.",
    images: propertyImages.shirazHotel.map(img), amenities: ["wifi","pool","parking","ac","tv","breakfast","gym","spa","elevator","security"], rating: 4.6,
  },
];

const reviews = [
  { rating: 5, comment: "اقامتگاه فوق‌العاده‌ای بود! از لحظه ورود تا خروج همه چیز بی‌نقص بود. میزبان بسیار مهربان و کمک‌کننده بودند.", user: "سارا محمدی" },
  { rating: 5, comment: "تجربه‌ای بی‌نظیر! مکان دقیقاً مطابق عکس‌ها بود و حتی بهتر. حتماً دوباره برمی‌گردیم.", user: "رضا احمدی" },
  { rating: 4, comment: "مکان زیبا و تمیز بود. فقط کمی دور از مرکز شهر بود ولی ارزشش را داشت.", user: "مریم حسینی" },
  { rating: 5, comment: "یکی از بهترین اقامتگاه‌هایی که تجربه کرده‌ام. آرامش و زیبایی در کنار هم. پیشنهاد می‌کنم.", user: "علی رضایی" },
  { rating: 5, comment: "عالی بود! امکانات کامل، محیط تمیز و قیمت مناسب. حتماً پیشنهاد می‌کنم.", user: "زهرا کریمی" },
  { rating: 4, comment: "خوب بود ولی می‌توانست بهتر باشد. با این حال اقامت راضی‌کننده‌ای داشتیم.", user: "محمد علوی" },
];

const faqUsers = ["امیر تهرانی", "نگار صادقی", "حسین موسوی", "فاطمه نوری", "بهراد جمشیدی", "سمیرا اکبری"];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean
  await db.notification.deleteMany();
  await db.favorite.deleteMany();
  await db.review.deleteMany();
  await db.booking.deleteMany();
  await db.property.deleteMany();
  await db.destination.deleteMany();
  await db.category.deleteMany();
  await db.user.deleteMany();

  // Users
  const admin = await db.user.create({ data: { email: "admin@villa.ir", name: "مدیر سیستم", password: "$2a$10$hash", role: "admin", avatar: "https://i.pravatar.cc/150?img=12" } });
  const host = await db.user.create({ data: { email: "host@villa.ir", name: "مهدی صادقی", password: "$2a$10$hash", role: "host", bio: "میزبان حرفه‌ای با ۱۰ سال سابقه", avatar: "https://i.pravatar.cc/150?img=33" } });
  const host2 = await db.user.create({ data: { email: "host2@villa.ir", name: "نازنین رحیمی", password: "$2a$10$hash", role: "host", bio: "متخصص اقامتگاه‌های لوکس", avatar: "https://i.pravatar.cc/150?img=45" } });
  const customer = await db.user.create({ data: { email: "user@villa.ir", name: "سپهر کاظمی", password: "$2a$10$hash", role: "customer", avatar: "https://i.pravatar.cc/150?img=68" } });

  // Categories
  for (const c of categories) {
    await db.category.create({ data: { ...c, propertyCount: properties.filter(p => p.type === c.slug || (c.slug === "villa" && p.type === "villa")).length } });
  }

  // Destinations
  for (const d of destinations) {
    await db.destination.create({ data: { ...d, propertyCount: properties.filter(p => p.city === d.name || p.province === d.name).length } });
  }

  // Properties
  const hosts = [host, host2];
  for (const [i, p] of properties.entries()) {
    const created = await db.property.create({
      data: {
        ...p,
        province: p.province,
        hostId: hosts[i % 2].id,
        amenities: JSON.stringify(p.amenities),
        images: JSON.stringify(p.images),
        rules: JSON.stringify(["بدون مهمانی", "بدون سیگار", "حیوانات خانگی قابل قبول"]),
        cleaningFee: Math.round(p.pricePerNight * 0.1),
        serviceFee: Math.round(p.pricePerNight * 0.05),
        weeklyDiscount: 10,
        monthlyDiscount: 20,
        reviewCount: Math.floor(Math.random() * 80) + 15,
      },
    });

    // Reviews for each property
    const reviewCount = Math.floor(Math.random() * 4) + 2;
    for (let j = 0; j < reviewCount; j++) {
      const r = reviews[(i + j) % reviews.length];
      await db.review.create({
        data: {
          rating: r.rating,
          comment: r.comment,
          cleanliness: 4 + Math.random(),
          communication: 4 + Math.random(),
          checkIn: 4 + Math.random(),
          accuracy: 4 + Math.random(),
          location: 4 + Math.random(),
          value: 4 + Math.random(),
          propertyId: created.id,
          userId: [customer, host, host2][j % 3].id,
        },
      });
    }

    // A sample confirmed booking for some properties
    if (i < 5) {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() - (i + 1) * 7);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 3);
      const nights = 3;
      await db.booking.create({
        data: {
          checkIn, checkOut, guests: 2 + (i % 3), nights,
          pricePerNight: p.pricePerNight,
          cleaningFee: Math.round(p.pricePerNight * 0.1),
          serviceFee: Math.round(p.pricePerNight * 0.05),
          totalPrice: p.pricePerNight * nights + Math.round(p.pricePerNight * 0.15),
          status: i < 3 ? "completed" : "confirmed",
          paymentStatus: "paid",
          propertyId: created.id,
          userId: customer.id,
        },
      });
    }
  }

  // Notifications
  await db.notification.create({ data: { userId: customer.id, title: "رزرو شما تأیید شد", message: "اقامتگاه شما با موفقیت رزرو شد. منتظر دیدار شما هستیم.", type: "success" } });
  await db.notification.create({ data: { userId: customer.id, title: "پیشنهاد ویژه", message: "تخفیف ۲۰ درصدی برای رزرو بعدی شما در کیش!", type: "info" } });
  await db.notification.create({ data: { userId: customer.id, title: "نظر خود را ثبت کنید", message: "از اقامت اخیر خود چه فکر می‌کنید؟ نظر شما مهم است.", type: "info", read: true } });
  await db.notification.create({ data: { userId: host.id, title: "رزرو جدید", message: "یک رزرو جدید برای ویلا لوکس ساحلی ثبت شد.", type: "success" } });
  await db.notification.create({ data: { userId: host.id, title: "درآمد ماهانه", message: "درآمد شما این ماه ۴۵٪ افزایش یافته است.", type: "success" } });

  // Favorites
  const favProps = await db.property.findMany({ take: 3 });
  for (const fp of favProps) {
    await db.favorite.create({ data: { userId: customer.id, propertyId: fp.id } });
  }

  console.log("✅ Seed completed!");
  console.log(`   - ${await db.user.count()} users`);
  console.log(`   - ${await db.property.count()} properties`);
  console.log(`   - ${await db.review.count()} reviews`);
  console.log(`   - ${await db.booking.count()} bookings`);
  console.log(`   - ${await db.destination.count()} destinations`);
  console.log(`   - ${await db.category.count()} categories`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
