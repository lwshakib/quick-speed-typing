
/**
 * Static word lists for languages that Faker does not support well
 * for typing tests (falling back to English or Latin).
 */
export const LOCALIZED_WORDS: Record<string, string[]> = {
  dutch: [
    "de", "van", "een", "en", "het", "in", "is", "dat", "op", "te",
    "met", "voor", "zijn", "niet", "aan", "voor", "om", "ook", "om", "was",
    "jaar", "dag", "mens", "leven", "tijd", "wereld", "vraag", "hand", "oog", "stad",
    "huis", "land", "kind", "werk", "woord", "staan", "gaan", "zien", "geven", "weten",
    "komen", "denken", "laten", "maken", "vinden", "zeggen", "willen", "krijgen", "houden", "moeten",
    "vogel", "bloem", "boom", "huis", "werk", "taal", "leven", "wereld", "vriendschap", "familie",
    "geluk", "gezondheid", "vrijheid", "vrede", "natuur", "zee", "zon", "maan", "ster", "lucht"
  ],
  swedish: [
    "och", "i", "att", "en", "ett", "det", "som", "på", "av", "för",
    "med", "till", "den", "har", "de", "inte", "om", "vi", "han", "hon",
    "år", "dag", "människa", "liv", "tid", "värld", "fråga", "hand", "öga", "stad",
    "hus", "land", "barn", "arbete", "ord", "stå", "gå", "se", "ge", "veta",
    "komma", "tänka", "låta", "göra", "hitta", "säga", "vilja", "få", "hålla", "måste",
    "fågel", "blomma", "träd", "hus", "arbete", "språk", "liv", "värld", "vänskap", "familj",
    "lycka", "hälsa", "frihet", "fred", "natur", "hav", "sol", "måne", "stjärna", "himmel"
  ],
  norwegian: [
    "og", "i", "at", "en", "et", "det", "som", "på", "av", "for",
    "med", "til", "den", "har", "de", "ikke", "om", "vi", "han", "hun",
    "år", "dag", "menneske", "liv", "tid", "verden", "spørsmål", "hånd", "øye", "by",
    "hus", "land", "barn", "arbeid", "ord", "stå", "gå", "se", "gi", "vite",
    "komme", "tenke", "la", "gjøre", "finne", "si", "vilje", "få", "holde", "måtte",
    "fugl", "blomst", "tre", "hus", "arbeid", "språk", "liv", "verden", "vennskap", "familie",
    "lykke", "helse", "frihet", "fred", "natur", "hav", "sol", "måne", "stjerne", "himmel"
  ],
  danish: [
    "og", "i", "at", "en", "et", "det", "som", "på", "af", "for",
    "med", "til", "den", "har", "de", "ikke", "om", "vi", "han", "hun",
    "år", "dag", "menneske", "liv", "tid", "verden", "spørgsmål", "hånd", "øje", "by",
    "hus", "land", "barn", "arbejde", "ord", "stå", "gå", "se", "give", "vide",
    "komme", "tænke", "lade", "gøre", "finde", "sige", "vilje", "få", "holde", "måtte",
    "fugl", "blomst", "træ", "hus", "arbejde", "sprog", "liv", "verden", "venskab", "familie",
    "lykke", "sundhed", "frihed", "fred", "natur", "hav", "sol", "måne", "stjerne", "himmel"
  ],
  spanish: [
    "el", "la", "de", "que", "en", "y", "un", "ser", "a", "no", 
    "tiempo", "mano", "ojo", "parte", "casa", "lugar", "manera", "noche", "ciudad", "padre",
    "vida", "mundo", "mujer", "hombre", "momento", "forma", "punto", "trabajo", "estado", "pueblo",
    "fuerza", "luz", "paz", "verdad", "historia", "idea", "palabra", "amor", "familia", "hijo",
    "libro", "agua", "tierra", "aire", "fuego", "cielo", "mar", "montaña", "bosque", "flor",
    "escuela", "maestro", "estudiante", "salud", "médico", "dinero", "mercado", "comun", "libre", "nuevo"
  ],
  french: [
    "le", "la", "de", "un", "être", "et", "à", "il", "avoir", "ne",
    "je", "son", "que", "se", "ce", "tout", "faire", "pas", "sur", "pouvoir",
    "dire", "aller", "voir", "en", "qui", "ne", "son", "un", "mon", "si",
    "temps", "main", "oeil", "jour", "homme", "femme", "enfant", "chose", "vie", "pays",
    "monde", "moment", "forme", "lieu", "partie", "point", "petit", "grand", "beau", "vrai",
    "travail", "famille", "histoire", "ville", "maison", "école", "livre", "amour", "paix", "nature",
    "terre", "mer", "ciel", "soleil", "lune", "étoile", "fleur", "animal", "idée", "mot",
    "santé", "force", "liberté", "espoir", "rêve", "vérité", "esprit", "corps", "âme", "ami"
  ],
  german: [
    "der", "die", "das", "und", "sein", "in", "ein", "zu", "haben", "ich",
    "werden", "mit", "von", "auf", "auch", "nicht", "an", "was", "wenn", "aus",
    "schon", "jahr", "tag", "mensch", "leben", "zeit", "welt", "frage", "fall", "hand",
    "auge", "stadt", "geschichte", "wort", "arbeit", "ende", "land", "haus", "kind", "herr",
    "frau", "stehen", "gehen", "sehen", "geben", "wissen", "kommen", "denken", "lassen", "machen",
    "familie", "geschichte", "schule", "buch", "liebe", "frieden", "natur", "erde", "meer", "himmel",
    "sonne", "mond", "stern", "blume", "tier", "idee", "wort", "gesundheit", "kraft", "freiheit",
    "hoffnung", "traum", "wahrheit", "geist", "körper", "seele", "freund", "weg", "stadt", "raum"
  ],
  italian: [
    "il", "di", "e", "a", "in", "che", "un", "non", "essere", "io",
    "avere", "si", "ma", "con", "il", "su", "per", "come", "dare", "fare",
    "dire", "potere", "volere", "sapere", "stare", "vedere", "venire", "tempo", "mano", "cosa",
    "anno", "giorno", "uomo", "donna", "vitta", "mondo", "padre", "madre", "casa", "città",
    "parte", "modo", "punto", "occhio", "ora", "paese", "luogo", "grande", "piccolo", "nuovo"
  ],
  portuguese: [
    "o", "a", "de", "que", "e", "do", "da", "em", "um", "uma",
    "ser", "ter", "ir", "fazer", "dizer", "poder", "ver", "dar", "saber", "querer",
    "casa", "tempo", "ano", "dia", "homem", "mulher", "vida", "mundo", "cidade", "pais",
    "parte", "modo", "ponto", "olho", "hora", "lugar", "grande", "pequeno", "novo", "bom",
    "bem", "agora", "depois", "ainda", "muito", "todo", "qual", "quem", "como", "sobre"
  ],
  russian: [
    "и", "в", "не", "на", "я", "быть", "он", "с", "что", "а",
    "по", "это", "она", "этот", "свой", "весь", "они", "мы", "за", "но",
    "у", "из", "человек", "год", "время", "рука", "глаз", "жизнь", "день", "мир",
    "слово", "город", "дом", "дело", "страна", "работа", "место", "часть", "вид", "сила",
    "стоять", "идти", "смотреть", "говорить", "знать", "мочь", "хотеть", "думать", "жить", "делать",
    "семья", "история", "школа", "книга", "любовь", "мир", "природа", "земля", "море", "небо",
    "солнце", "луна", "звезда", "цветок", "животное", "идея", "слово", "здоровье", "сила", "свобода",
    "надежда", "мечта", "правда", "дух", "тело", "душа", "друг", "путь", "город", "свет"
  ],
  turkish: [
    "ve", "bir", "bu", "ne", "için", "da", "de", "olan", "gibi", "ama",
    "çok", "daha", "her", "kendi", "sonra", "zaman", "gün", "yıl", "yeni", "insan",
    "dünya", "el", "göz", "hayat", "yer", "yol", "çocuk", "ev", "iş", "şehir",
    "kelime", "su", "kitap", "dil", "taraf", "baş", "can", "kalp", "akıl", "hikaye",
    "olmak", "demek", "bilmek", "gelmek", "görmek", "almak", "vermek", "gitmek", "yapmak", "bakmak",
    "sevgi", "dostluk", "aile", "okul", "kitap", "hayal", "gerçek", "doğa", "deniz", "güneş",
    "yıldız", "çiçek", "hayvan", "müzik", "sanat", "tarih", "gelecek", "mutluluk", "sağlık", "barış",
    "özgürlük", "cesaret", "umut", "başarı", "sabır", "akıl", "kalp", "yolculuk", "şehir", "dünya"
  ],
  vietnamese: [
    "và", "một", "là", "trong", "có", "những", "cho", "được", "không", "với",
    "người", "của", "đã", "con", "này", "khi", "ngày", "năm", "mới", "thế",
    "đời", "nhà", "tay", "mắt", "nước", "đường", "trời", "đất", "thành", "phố",
    "chữ", "sách", "học", "làm", "biết", "đi", "thấy", "yêu", "vui", "buồn",
    "thời", "gian", "sống", "chết", "tâm", "thân", "trung", "quốc", "việt", "nam",
    "gia", "đình", "bạn", "bè", "trường", "học", "sách", "vở", "tình", "yêu",
    "hạnh", "phúc", "tự", "do", "hòa", "bình", "tương", "lai", "hy", "vọng",
    "thiên", "nhiên", "rừng", "núi", "biển", "sông", "mặt", "trời", "trăng", "sao",
    "nghệ", "thuật", "âm", "nhạc", "văn", "hóa", "lịch", "sử", "thành", "công"
  ],
  bengali: [
    "আমি", "তুমি", "সে", "আমরা", "তোমরা", "তারা", "বই", "কলम", "পানি", "খাবার",
    "বাগান", "ফুল", "পাখি", "মাছ", "আকাশ", "বাতাস", "সূর্য", "চাঁদ", "তারা", "পৃথিবী",
    "মানুষ", "বন্ধু", "পরিবার", "মা", "বাবা", "ভাই", "বোন", "বাড়ি", "স্কুল", "কাজ",
    "ভালো", "খারাপ", "সুন্দর", "ছোট", "বড়", "লাল", "নীল", "সবুজ", "জল", "কথা",
    "দিন", "রাত", "সকাল", "বিকেল", "সন্ধ্যা", "সময়", "বাংলাদেশ", "ভাষা", "শিক্ষা", "জীবন",
    "স্বপ্ন", "সুখ", "দুঃখ", "সত্য", "মিথ্যা", "জ্ঞান", "বিজ্ঞাन", "গল্প", "কবিতা", "গান",
    "মাটি", "পাহাড়", "নদী", "সমুদ্র", "বৃষ্টি", "মেঘ", "রঙ", "আলো", "অন্ধকার", "শান্তি",
    "চেষ্টা", "সাফল্য", "সাহস", "ভয়", "রাগ", "হাসি", "কান্না", "পথ", "দেশ", "শহর",
    "গ্রাম", "দোকান", "বাজার", "রাস্তা", "গাড়ি", "কাগজ", "শব্দ", "বাক্য", "পড়া", "লেখা",
    "শেখা", "দেখা", "শোনা", "বলা", "করা", "যাওয়া", "আসা", "খাওয়া", "পাওয়া", "থাকা",
    "অনেক", "অল্প", "নতুুন", "পুরানো", "অপেক্ষা", "গুরুত্ব", "প্রয়োজন", "সাহায্য", "সম্পর্ক", "বিশ্বাস"
  ],
  arabic: [
    "أنا", "أنت", "هو", "هي", "نحن", "هم", "كتاب", "قلم", "ماء", "طعام",
    "حديقة", "زهرة", "طائر", "سمك", "سماء", "رياح", "شمس", "قمر", "نجم", "أرض",
    "إنسان", "صديق", "عائلة", "أب", "أمي", "أخ", "أخت", "بيت", "مدرسة", "عمل",
    "جيد", "سيء", "جميل", "صغير", "كبير", "أحمر", "أزرق", "أخضر", "وقت", "كلام",
    "يوم", "ليلة", "صباح", "مساء", "لغة", "حياة", "سلام", "حب", "سفر", "مدينة",
    "أمل", "سعادة", "حلم", "حقيقة", "خيال", "علم", "معرفة", "قصة", "شعر", "فن",
    "طبيعة", "جبل", "نهر", "بحر", "مطر", "سحاب", "نور", "ظلام", "قوة", "ضعف",
    "صحة", "مرض", "فكر", "سؤال", "جواب", "حق", "عدل", "حرية", "وطن", "ثقافة",
    "تاريخ", "مستقبل", "حاضر", "فرصة", "نجاح", "فشل", "صبر", "شجاعة", "خوف", "هدوء",
    "عقل", "قلب", "نسيان", "تذكر", "رحلة", "طريق", "نافذة", "باب", "مفتاح", "تغيير"
  ],
  korean: [
    "낮", "밤", "아침", "오후", "저녁", "언어", "인생", "평화", "사랑", "도시",
    "학교", "가족", "친구", "회사", "마음", "생각", "공부", "노래", "음악", "영화",
    "바다", "산", "강", "나무", "꽃", "날씨", "시간", "어제", "오늘", "내일",
    "건강", "행복", "슬픔", "희망", "노력", "성공", "실패", "용기", "믿음", "약속"
  ],
  nepali: [
    "म", "तिमी", "ऊ", "हामी", "तपाईं", "उनीहरू", "किताब", "कलम", "पानी", "खाना",
    "बगैंचा", "फूल", "चरा", "माछा", "आकाश", "हावा", "घाम", "जुन", "तारा", "पृथ्वी",
    "मान्छे", "साथी", "परिवार", "बुबा", "आमा", "दाजु", "बहिनी", "घर", "विद्यालय", "काम",
    "राम्रो", "नराम्रो", "सुन्दर", "सानो", "ठूलो", "रातो", "नीलो", "हरियो", "समय", "कुरा",
    "दिन", "रात", "बिहान", "दिउँसो", "बेलुका", "भाषा", "जीवन", "शान्ति", "माया", "शहर"
  ],
  japanese: [
    "昼", "夜", "朝", "午後", "夕方", "言語", "人生", "平和", "愛", "都会",
    "学校", "家族", "友達", "仕事", "心", "夢", "将来", "理由", "方法", "景色",
    "音楽", "映画", "動物", "植物", "健康", "希望", "笑顔", "涙", "挑戦", "成功",
    "失敗", "感謝", "毎日", "世界", "旅行", "空", "海", "山", "川", "道"
  ],
  chinese: [
    "白天", "晚上", "早上", "下午", "晚上", "语言", "生活", "和平", "爱", "城市",
    "学校", "工作", "朋友", "家庭", "书本", "梦想", "未来", "快乐", "健康", "世界",
    "历史", "科学", "音乐", "文化", "艺术", "自然", "季节", "阳光", "森林", "海洋",
    "智慧", "成功", "努力", "勇气", "希望", "公平", "自由", "旅行", "食物", "生活"
  ],
  hindi: [
    "मैं", "तुम", "वह", "हम", "वे", "किताब", "कलम", "पानी", "खाना", "बगीचा",
    "फूल", "पक्षी", "मछली", "आसमान", "हवा", "सूरज", "चाँद", "तारा", "पृथ्वी", "इंसान",
    "दोस्त", "परिवर", "पिता", "माँ", "भाई", "बहन", "घर", "स्कूल", "काम", "अच्छा",
    "बुरा", "सुंदर", "छोटा", "बड़ा", "लाल", "नीला", "हरा", "समय", "बात", "दिन",
    "रात", "सुबह", "शाम", "भाषा", "जीवन", "शांति", "प्यार", "शहर", "देश", "शिक्षा",
    "सपना", "खुशी", "दुख", "सच", "झूठ", "ज्ञान", "विज्ञान", "कहानी", "कविता", "गाना",
    "धरती", "पहाड़", "नदी", "समुद्र", "बारिश", "बादल", "रंग", "रोशनी", "अंधेरा", "हिम्मत",
    "कोशिश", "सफलता", "साहस", "डर", "गुस्सा", "हँसी", "रुपया", "पैसा", "रास्ता", "गाड़ी",
    "कागज", "कलम", "शब्द", "वाक्य", "पढ़ना", "लिखना", "सोचना", "समझना", "खेल", "जीत",
    "हार", "नया", "पुराना", "दुकान", "बाजार", "दुनिया", "लोग", "समाज", "धर्म", "कर्म"
  ]
};

/**
 * Localized quotes for 'quote' mode.
 */
export const LOCALIZED_QUOTES: Record<string, string[]> = {
  english: [
    "The only way to do great work is to love what you do.",
    "Stay hungry, stay foolish.",
    "Innovation distinguishes between a leader and a follower.",
    "Your time is limited, so don't waste it living someone else's life.",
    "Design is not just what it looks like and feels like. Design is how it works.",
    "Be the change that you wish to see in the world.",
    "In the end, it's not the years in your life that count. It's the life in your years.",
    "Life is what happens when you're busy making other plans.",
    "The way to get started is to quit talking and begin doing.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "If you look at what you have in life, you'll always have more.",
    "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success."
  ],
  spanish: [
    "La única forma de hacer un gran trabajo es amar lo que haces.",
    "Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de otra persona.",
    "Sé el cambio que deseas ver en el mundo.",
    "La vida es lo que sucede mientras estás ocupado haciendo otros planes.",
    "No cuentes los días, haz que los días cuenten.",
    "El éxito no es el final, el fracaso no es fatal: lo que cuenta es el valor para continuar.",
    "La educación es el arma más poderosa que puedes usar para cambiar el mundo.",
    "Cree que puedes y ya habrás recorrido la mitad del camino."
  ],
  french: [
    "Le seul moyen de faire du bon travail est d'aimer ce que vous faites.",
    "Votre temps est limité, ne le gaspillez pas à vivre la vie de quelqu'un d'autre.",
    "Soyez le changement que vous voulez voir dans le monde.",
    "La vie, c'est ce qui arrive quand on a d'autres projets.",
    "Petit à petit, l'oiseau fait son nid."
  ],
  german: [
    "Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was man tut.",
    "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.",
    "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.",
    "Das Leben ist das, was passiert, während du eifrig dabei bist, andere Pläne zu machen."
  ],
  russian: [
    " Единственный способ делать великие дела — любить то, что вы делаете.",
    "Ваше время ограничено, поэтому не тратьте его на жизнь чужой жизнью.",
    "Будьте теми переменами, которые вы хотите видеть в мире.",
    "Жизнь — это то, что происходит, пока вы строите другие планы."
  ],
  arabic: [
    "الطريقة الوحيدة للقيام بعمل رائع هي أن تحب ما تفعله.",
    "وقتك محدود، فلا تضيعه في عيش حياة شخص آخر.",
    "كن أنت التغيير الذي تريد أن تراه في العالم.",
    "الحياة هي ما يحدث لك بينما أنت مشغول في صنع خطط أخرى.",
    "لا تحزن إن الله معنا.",
    "العلم نور والجهل ظلام.",
    "الصبر مفتاح الفرج.",
    "من جد وجد ومن زرع حصد."
  ],
  bengali: [
    "ভালো কাজ করার একমাত্র উপায় হলো নিজের কাজকে ভালোবাসা।",
    "আপনার সময় সীমিত, তাই অন্যের জীবন যাপন করে এটি নষ্ট করবেন না।",
    "আপনি বিশ্বে যে পরিবর্তন দেখতে চান তা নিজেই হয়ে উঠুন।",
    "জীবন হলো তা-ই যা আপনার অন্য পরিকল্পনা করার সময় ঘটে।",
    "শিক্ষা হলো বিশ্বের সবচেয়ে শক্তিশালী অস্ত্র যা আপনি ব্যবহার করতে পারেন।",
    "ভবিষ্যৎ তাদের জন্য যারা তাদের স্বপ্নের সৌন্দর্যে বিশ্বাস করে।",
    "সাফল্য চূড়ান্ত নয়, ব্যর্থতা মারাত্মক নয়: এটি চালিয়ে যাওয়ার সাহসই গণ্য হয়।",
    "কষ্টের পরেই সুখ আসে, তাই কখনো আশা হারাবেন না।",
    "মানুষ মানুষের জন্য, জীবন জীবনের জন্য।"
  ],
  hindi: [
    "महान कार्य करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।",
    "आपका समय सीमित है, इसलिए इसे किसी और का जीवन जीने में बर्बाद न करें।",
    "वह परिवर्तन खुद बनिए जो आप दुनिया में देखना चाहते हैं।",
    "जीवन वह है जो तब घटित होता है जब आप अन्य योजनाएं बनाने में व्यस्त होते हैं।",
    "शिक्षा सबसे शक्तिशाली हथियार है जिसे आप दुनिया को बदलने के लिए उपयोग कर सकते हैं।",
    "कोशिश करने वालों की कभी हार नहीं होती।",
    "सत्य परेशान हो सकता है, पराजित नहीं।",
    "मंजिल उन्हीं को मिलती है, जिनके सपनों में जान होती है।"
  ],
  chinese: [
    "取得伟大成就的唯一途径是热爱你的工作。",
    "你的时间有限，所以不要浪费时间去过别人的生活。",
    "成为你想在世界上看到的改变。",
    "生活就是当你忙于制定其他计划时所发生的事情。",
    "千里之行，始于足下。",
    "书山有路勤为径，学海无涯苦作舟。",
    "失败乃成功之母。",
    "世上无难事，只怕有心人。"
  ],
  japanese: [
    "素晴らしい仕事をする唯一の方法は、自分の仕事を愛することだ。",
    "あなたの時間は限られている。だから、誰かの人生を生きることで浪費してはいけない。",
    "世界に変革を求めるなら、自分自身がその変革になれ。",
    "人生とは、他の計画を立てるのに忙しいときに起こるものだ。",
    "七転び八起き。",
    "習うより慣れよ。",
    "一期一会。",
    "継続は力なり。"
  ],
  korean: [
    "위대한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것입니다.",
    "당신의 시간은 한정되어 있습니다. 그러니 다른 사람의 삶을 사느라 시간을 낭비하지 마십시오.",
    "세상에서 보고 싶은 변화가 있다면 당신 스스로 그 변화가 되십시오.",
    "인생이란 당신이 다른 계획을 세우느라 바쁠 때 일어나는 것입니다.",
    "시작이 반이다.",
    "티끌 모아 태산.",
    "실패는 성공의 어머니.",
    "가는 말이 고와야 오는 말이 곱다."
  ]
};
