/**
 * data.js
 * Data destinasi wisata unggulan di Nusa Tenggara Timur (NTT):
 * - Wilayah Flores / Labuan Bajo & Manggarai Barat
 * - Wilayah Daratan Timor (Kupang, Timor Tengah Selatan - TTS)
 *
 * Dilengkapi informasi:
 * - Koordinat presisi & foto Unsplash HD
 * - Informasi Cuaca (suhu, cuaca, kelembaban, angin)
 * - Kondisi Jalan (aspal mulus, berkelok, jalan berbatu, tips kendaraan)
 * - Kepadatan Kendaraan / Lalu Lintas (lancar, sedang, padat, estimasi kecepatan)
 */

const TOURISM_DESTINATIONS = [
  // ================= WILAYAH FLORES / LABUAN BAJO =================
  {
    id: "puncak-sylvia",
    name: "Puncak Sylvia & Bukit Waecicu",
    region: "Flores",
    regionLabel: "Flores / Labuan Bajo",
    category: "Pantai",
    categoryColor: "cyan",
    rating: 4.8,
    reviewsCount: "8.4k",
    ticketPrice: "Gratis / Rp 10.000",
    openingHours: "05:00 - 18:30 WITA",
    location: "Waecicu, Labuan Bajo, Manggarai Barat, NTT",
    lat: -8.472814,
    lng: 119.873205,
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80",
    description: "Perbukitan savana pesisir di utara Labuan Bajo yang menyuguhkan pemandangan spektakuler gugusan pulau karang, gradasi air laut toska, serta pemandangan matahari terbenam (sunset) terbaik di Manggarai Barat.",
    tags: ["Sunset View", "Bukit Savana", "Panorama Pulau", "Spot Foto"],
    weather: {
      temp: "31°C",
      condition: "Cerah Berawan",
      icon: "sun",
      humidity: "62%",
      windSpeed: "14 km/jam",
      forecast: "Sangat bersahabat untuk menikmati sunset sore hari."
    },
    roadCondition: {
      status: "Mulus & Beraspal",
      badgeColor: "emerald",
      level: "good",
      description: "Jalan aspal hotmix mulus dua arah hingga kaki bukit, sedikit menanjak di ujung.",
      recommendation: "Dapat dilalui semua jenis kendaraan (Mobil, Motor, Bus Pariwisata)."
    },
    traffic: {
      status: "Lancar",
      badgeColor: "emerald",
      level: "low",
      speedAvg: "40-50 km/jam",
      notes: "Arus lalu lintas lengang, sedikit ramai saat jam sunset (16:30 - 18:00 WITA)."
    }
  },
  {
    id: "batu-cermin",
    name: "Gua Batu Cermin (Mirror Stone Cave)",
    region: "Flores",
    regionLabel: "Flores / Labuan Bajo",
    category: "Sejarah",
    categoryColor: "amber",
    rating: 4.7,
    reviewsCount: "6.2k",
    ticketPrice: "Rp 20.000",
    openingHours: "08:00 - 16:30 WITA",
    location: "Batu Cermin, Komodo, Manggarai Barat, NTT",
    lat: -8.490518,
    lng: 119.897825,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    description: "Situs gua kapur purba yang dahulunya berada di dasar laut. Memiliki lorong berkilau seperti cermin saat ditembus berkas sinar matahari, stalaktit-stalagmit megah, serta fosil penyu laut dan koral purba yang membatu.",
    tags: ["Gua Purba", "Fosil Laut", "Wisata Edukasi", "Geologi"],
    weather: {
      temp: "30°C",
      condition: "Cerah Terik",
      icon: "sun",
      humidity: "65%",
      windSpeed: "11 km/jam",
      forecast: "Waktu terbaik berkunjung pukul 09:00 - 12:00 WITA untuk melihat pantulan cahaya."
    },
    roadCondition: {
      status: "Sangat Baik (Jalan Kota)",
      badgeColor: "emerald",
      level: "good",
      description: "Jalan arteri utama kota Labuan Bajo, aspal lebar dengan trotoar pedestrian rapi.",
      recommendation: "Akses sangat mudah untuk semua jenis kendaraan termasuk mobil keluarga & bus."
    },
    traffic: {
      status: "Sedang (Ramai Lancar)",
      badgeColor: "amber",
      level: "moderate",
      speedAvg: "30-40 km/jam",
      notes: "Cukup ramai di sekitar persimpangan pusat kota, parkiran luas tersedia."
    }
  },
  {
    id: "cunca-wulang",
    name: "Air Terjun Cunca Wulang",
    region: "Flores",
    regionLabel: "Flores / Manggarai Barat",
    category: "Alam",
    categoryColor: "emerald",
    rating: 4.8,
    reviewsCount: "5.1k",
    ticketPrice: "Rp 30.000",
    openingHours: "07:00 - 17:00 WITA",
    location: "Pota Wangka, Boleng, Manggarai Barat, NTT",
    lat: -8.577210,
    lng: 120.078912,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
    description: "Dijuluki 'Grand Canyon' dari Flores NTT. Ngarai alami berdinding tebing batu kapur terjal dengan aliran sungai berair jernih kehijauan yang bermuara pada kolam alami eksotis, populer untuk atraksi cliff jumping dan trekking alam.",
    tags: ["Grand Canyon Flores", "Cliff Jumping", "Air Terjun", "Trekking"],
    weather: {
      temp: "27°C",
      condition: "Cerah Sejuk",
      icon: "cloud-sun",
      humidity: "74%",
      windSpeed: "9 km/jam",
      forecast: "Udara pegunungan lembab dan sejuk, air sungai jernih dan segar."
    },
    roadCondition: {
      status: "Aspal Berkelok & Menanjak",
      badgeColor: "amber",
      level: "moderate",
      description: "Jalan Trans-Flores beraspal mulus, 2 km terakhir menuju gerbang desa agak sempit berliku.",
      recommendation: "Gunakan gigi rendah pada tanjakan, berhati-hati saat berpapasan di jalan sempit."
    },
    traffic: {
      status: "Lancar Lengang",
      badgeColor: "emerald",
      level: "low",
      speedAvg: "40-50 km/jam",
      notes: "Arus kendaraan sangat lengang, didominasi motor dan mobil travel wisata."
    }
  },
  {
    id: "kampung-melo",
    name: "Kampung Adat Melo (Liang Ndara)",
    region: "Flores",
    regionLabel: "Flores / Manggarai Barat",
    category: "Budaya",
    categoryColor: "purple",
    rating: 4.9,
    reviewsCount: "4.8k",
    ticketPrice: "Rp 25.000",
    openingHours: "08:00 - 17:00 WITA",
    location: "Liang Ndara, Mbeliling, Manggarai Barat, NTT",
    lat: -8.583340,
    lng: 120.024210,
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80",
    description: "Kampung adat tradisional suku Manggarai di ketinggian perbukitan sejuk Mbeliling. Pusat pertunjukan Tari Caci legendaris (tarian perang cambuk khas NTT), ritual penyambutan tuak sopi, serta kerajinan tenun ikat songke bernilai seni tinggi.",
    tags: ["Tari Caci", "Kampung Adat", "Tenun Songke", "Budaya Manggarai"],
    weather: {
      temp: "24°C",
      condition: "Sejuk Berkabut Tipis",
      icon: "wind",
      humidity: "80%",
      windSpeed: "13 km/jam",
      forecast: "Kawasan perbukitan tinggi Mbeliling berhawa dingin, siapkan jaket tipis."
    },
    roadCondition: {
      status: "Aspal Nasional Mulus",
      badgeColor: "emerald",
      level: "good",
      description: "Terletak persis di tepi jalan raya Trans-Flores Ruteng - Labuan Bajo, aspal kualitas prima.",
      recommendation: "Akses prima untuk motor, mobil, dan bus pariwisata."
    },
    traffic: {
      status: "Lancar",
      badgeColor: "emerald",
      level: "low",
      speedAvg: "40-55 km/jam",
      notes: "Lalu lintas antarkota teratur dan tertib, rambu jalan sangat jelas."
    }
  },
  {
    id: "gua-rangko",
    name: "Gua Rangko & Kolam Alami Asin",
    region: "Flores",
    regionLabel: "Flores / Labuan Bajo",
    category: "Alam",
    categoryColor: "emerald",
    rating: 4.8,
    reviewsCount: "7.3k",
    ticketPrice: "Rp 25.000",
    openingHours: "07:30 - 16:00 WITA",
    location: "Tanjung Boleng, Boleng, Manggarai Barat, NTT",
    lat: -8.423120,
    lng: 119.923140,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Keajaiban tersembunyi berupa kolam renang alami air asin di dalam rongga gua stalaktit. Airnya sangat jernih kebiruan dan memantulkan kilauan kristal mempesona saat matahari menembus celah mulut gua di siang hari.",
    tags: ["Hidden Gem", "Kolam Air Asin", "Gua Kristal", "Snorkeling Alami"],
    weather: {
      temp: "32°C",
      condition: "Cerah Pesisir Tropis",
      icon: "sun",
      humidity: "58%",
      windSpeed: "16 km/jam",
      forecast: "Sinar matahari paling optimal menyinari kolam gua pukul 11:30 - 14:00 WITA."
    },
    roadCondition: {
      status: "Jalan Lingkar Baru Mulus",
      badgeColor: "emerald",
      level: "good",
      description: "Jalan hotmix baru pesisir utara Labuan Bajo hingga Desa Pasir Putih (dermaga perahu lokal).",
      recommendation: "Dapat ditempuh dengan mobil atau motor hingga dermaga penyeberangan perahu 10 menit."
    },
    traffic: {
      status: "Sangat Lancar",
      badgeColor: "emerald",
      level: "low",
      speedAvg: "50-60 km/jam",
      notes: "Jalan lingkar utara baru sangat lengang dengan pemandangan teluk yang indah."
    }
  },

  // ================= WILAYAH DARATAN TIMOR (KUPANG & TTS) =================
  {
    id: "pantai-lasiana",
    name: "Pantai Lasiana (Ikon Pohon Lontar)",
    region: "Timor",
    regionLabel: "Daratan Timor / Kota Kupang",
    category: "Pantai",
    categoryColor: "cyan",
    rating: 4.6,
    reviewsCount: "7.1k",
    ticketPrice: "Rp 5.000",
    openingHours: "06:00 - 20:00 WITA",
    location: "Kelapa Lima, Kota Kupang, Timor, NTT",
    lat: -10.138800,
    lng: 123.670600,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Pantai pesisir paling tersohor di Kota Kupang dengan deretan ratusan pohon lontar dan kelapa yang eksotis. Memiliki hamparan pasir putih yang landai, deburan ombak tenang Teluk Kupang, serta sajian kuliner khas pisang gepe bakar gula lempeng.",
    tags: ["Pohon Lontar", "Sunset Kupang", "Pisang Gepe", "Wisata Keluarga"],
    weather: {
      temp: "32°C",
      condition: "Cerah Berawan",
      icon: "sun",
      humidity: "62%",
      windSpeed: "18 km/jam",
      forecast: "Angin laut bertiup sepoi-sepoi, cuaca sangat mendukung untuk bersantai sore."
    },
    roadCondition: {
      status: "Jalan Kota Mulus",
      badgeColor: "emerald",
      level: "good",
      description: "Jalan Nasional Timor Raya dua jalur lebar dan beraspal sangat halus.",
      recommendation: "Akses prima untuk motor, mobil, taksi online, dan angkutan umum kota Kupang (Bemo)."
    },
    traffic: {
      status: "Sedang (Ramai Lancar)",
      badgeColor: "amber",
      level: "moderate",
      speedAvg: "35-45 km/jam",
      notes: "Cukup ramai pada akhir pekan dan jam sore menjelang matahari terbenam."
    }
  },
  {
    id: "gua-kristal",
    name: "Gua Kristal Kupang Barat",
    region: "Timor",
    regionLabel: "Daratan Timor / Kab. Kupang",
    category: "Alam",
    categoryColor: "emerald",
    rating: 4.7,
    reviewsCount: "5.8k",
    ticketPrice: "Rp 10.000",
    openingHours: "08:00 - 17:00 WITA",
    location: "Desa Bolok, Kupang Barat, Kab. Kupang, Timor, NTT",
    lat: -10.233500,
    lng: 123.504200,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    description: "Gua alami eksotis tersembunyi dengan kolam air tawar bawah tanah yang sangat jernih membiru laksana kristal. Pengunjung dapat menuruni celah mulut gua dan berenang merasakan kesegaran air sejuk di kedalaman gua kapur purba.",
    tags: ["Kolam Kristal", "Gua Tersembunyi", "Berenang Sejuk", "Spot Petualang"],
    weather: {
      temp: "31°C",
      condition: "Cerah Terik",
      icon: "sun",
      humidity: "60%",
      windSpeed: "12 km/jam",
      forecast: "Suhu di dalam rongga gua sangat sejuk (~22°C) kontras dengan panas luar."
    },
    roadCondition: {
      status: "Sebagian Berbatu",
      badgeColor: "amber",
      level: "moderate",
      description: "Jalan utama aspal mulus Pelabuhan Bolok, 300 meter terakhir jalan tanah berbatu kapur.",
      recommendation: "Disarankan berhati-hati saat berjalan kaki menuruni bebatuan licin di dalam gua."
    },
    traffic: {
      status: "Lancar",
      badgeColor: "emerald",
      level: "low",
      speedAvg: "40-50 km/jam",
      notes: "Arus lalu lintas jalur Bolok sangat lancar, jarang terjadi kepadatan."
    }
  },
  {
    id: "air-terjun-oenesu",
    name: "Air Terjun Oenesu (4 Tingkat)",
    region: "Timor",
    regionLabel: "Daratan Timor / Kab. Kupang",
    category: "Alam",
    categoryColor: "emerald",
    rating: 4.5,
    reviewsCount: "4.3k",
    ticketPrice: "Rp 5.000",
    openingHours: "07:00 - 18:00 WITA",
    location: "Oenesu, Kupang Barat, Kab. Kupang, Timor, NTT",
    lat: -10.279800,
    lng: 123.518600,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
    description: "Air terjun berundak alami dengan empat tingkatan kolam air yang dikelilingi hutan rimbun pepohonan tropis asri. Debit air tetap mengalir bahkan saat musim kemarau, menjadi tempat pemandian alami favorit masyarakat Pulau Timor.",
    tags: ["Air Terjun 4 Tingkat", "Kolam Alami", "Hutan Tropis", "Piknik"],
    weather: {
      temp: "28°C",
      condition: "Berawan Teduh",
      icon: "cloud-sun",
      humidity: "72%",
      windSpeed: "10 km/jam",
      forecast: "Kawasan hutan teduh dan sejuk, nyaman untuk aktivitas berenang dan piknik."
    },
    roadCondition: {
      status: "Aspal Sedang & Menurun",
      badgeColor: "emerald",
      level: "good",
      description: "Jalan aspal kabupaten terpelihara baik, terdapat turunan saat mendekati area gerbang.",
      recommendation: "Bisa diakses kendaraan roda 2 dan roda 4 hingga area parkir wisata."
    },
    traffic: {
      status: "Lancar",
      badgeColor: "emerald",
      level: "low",
      speedAvg: "40-50 km/jam",
      notes: "Lalu lintas pedesaan Kupang Barat tenang dan bebas macet."
    }
  },
  {
    id: "pantai-kolbano",
    name: "Pantai Kolbano (Batu Warna)",
    region: "Timor",
    regionLabel: "Daratan Timor / Timor Tengah Selatan",
    category: "Pantai",
    categoryColor: "cyan",
    rating: 4.8,
    reviewsCount: "6.9k",
    ticketPrice: "Rp 10.000",
    openingHours: "24 Jam",
    location: "Kolbano, Timor Tengah Selatan (TTS), Timor, NTT",
    lat: -9.988200,
    lng: 124.646800,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Fenomena alam pantai unik di pesisir selatan Timor yang tersohor di dunia karena bukan berpasir biasa, melainkan dipenuhi hamparan miliaran batu kerikil warna-warni halus alami serta bongkahan batu karang raksasa ikonik 'Fatu Un'.",
    tags: ["Batu Warna-Warni", "Batu Fatu Un", "Pesisir Selatan", "Fotografi"],
    weather: {
      temp: "31°C",
      condition: "Cerah Berangin Kencang",
      icon: "wind",
      humidity: "64%",
      windSpeed: "22 km/jam",
      forecast: "Deburan ombak Samudera Hindia cukup kuat, angin pesisir kencang dan segar."
    },
    roadCondition: {
      status: "Aspal Berkelok (Jalur Selatan)",
      badgeColor: "amber",
      level: "moderate",
      description: "Jalan Nasional Trans-Timor Jalur Selatan, aspal bagus namun banyak tikungan menyusuri pesisir dan tebing.",
      recommendation: "Patuhi batas kecepatan dan waspadai hewan ternak yang sesekali melintas."
    },
    traffic: {
      status: "Lancar Lengang",
      badgeColor: "emerald",
      level: "low",
      speedAvg: "45-60 km/jam",
      notes: "Lalu lintas antarkabupaten lengang, pemandangan laut selatan terbentang di sisi jalan."
    }
  },
  {
    id: "fatumnasi-mutis",
    name: "Hutan Bonsai Fatumnasi & Gunung Mutis",
    region: "Timor",
    regionLabel: "Daratan Timor / Timor Tengah Selatan",
    category: "Alam",
    categoryColor: "emerald",
    rating: 4.9,
    reviewsCount: "5.2k",
    ticketPrice: "Rp 15.000",
    openingHours: "06:00 - 17:00 WITA",
    location: "Fatumnasi, Timor Tengah Selatan (TTS), Timor, NTT",
    lat: -9.733100,
    lng: 124.238400,
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    description: "Negeri di atas awan Pulau Timor di lereng Gunung Mutis (1.400 mdpl). Menghadirkan udara pegunungan berkabut yang sangat dingin, padang savana berbukit hijau, serta hutan pohon ampupu bonsai purba berusia ratusan tahun yang magis.",
    tags: ["Pohon Bonsai Purba", "Gunung Mutis", "Negeri Di Atas Awan", "Udara Dingin"],
    weather: {
      temp: "19°C",
      condition: "Dingin Berkabut Tebal",
      icon: "cloud-fog",
      humidity: "86%",
      windSpeed: "15 km/jam",
      forecast: "Suhu udara dingin bisa mencapai 14°C saat pagi/malam, wajib membawa jaket tebal."
    },
    roadCondition: {
      status: "Menantang (Pegunungan)",
      badgeColor: "rose",
      level: "warning",
      description: "Jalan aspal Soe ke Kapan baik, namun 10 km terakhir menuju Fatumnasi berupa jalan menanjak berbatu dan sempit.",
      recommendation: "Sangat disarankan menggunakan kendaraan SUV/4WD, mobil bertorsi tinggi, atau motor gigi/trail."
    },
    traffic: {
      status: "Sangat Lengang",
      badgeColor: "emerald",
      level: "low",
      speedAvg: "25-35 km/jam",
      notes: "Lalu lintas pegunungan sangat sepi, udara segar berbalut kabut alami."
    }
  }
];

// Titik Koordinat Fallback Berdasarkan Wilayah
const REGIONAL_FALLBACK_LOCATIONS = {
  Flores: {
    lat: -8.508312,
    lng: 119.887214,
    name: "Bandara Komodo / Pusat Kota Labuan Bajo, Flores (NTT)",
    region: "Flores"
  },
  Timor: {
    lat: -10.171800,
    lng: 123.664400,
    name: "Bandara El Tari / Pusat Kota Kupang, Timor (NTT)",
    region: "Timor"
  },
  Semua: {
    lat: -8.508312,
    lng: 119.887214,
    name: "Pusat Wisata NTT (Titik Simulasi Labuan Bajo)",
    region: "Flores"
  }
};

// Default fallback awal (Labuan Bajo)
const DEFAULT_FALLBACK_LOCATION = REGIONAL_FALLBACK_LOCATIONS.Flores;
