
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
    "komen", "denken", "laten", "maken", "vinden", "zeggen", "willen", "krijgen", "houden", "moeten"
  ],
  swedish: [
    "och", "i", "att", "en", "ett", "det", "som", "på", "av", "för",
    "med", "till", "den", "har", "de", "inte", "om", "vi", "han", "hon",
    "år", "dag", "människa", "liv", "tid", "värld", "fråga", "hand", "öga", "stad",
    "hus", "land", "barn", "arbete", "ord", "stå", "gå", "se", "ge", "veta",
    "komma", "tänka", "låta", "göra", "hitta", "säga", "vilja", "få", "hålla", "måste"
  ],
  norwegian: [
    "og", "i", "at", "en", "et", "det", "som", "på", "av", "for",
    "med", "til", "den", "har", "de", "ikke", "om", "vi", "han", "hun",
    "år", "dag", "menneske", "liv", "tid", "verden", "spørsmål", "hånd", "øye", "by",
    "hus", "land", "barn", "arbeid", "ord", "stå", "gå", "se", "gi", "vite",
    "komme", "tenke", "la", "gjøre", "finne", "si", "vilje", "få", "holde", "måtte"
  ],
  danish: [
    "og", "i", "at", "en", "et", "det", "som", "på", "af", "for",
    "med", "til", "den", "har", "de", "ikke", "om", "vi", "han", "hun",
    "år", "dag", "menneske", "liv", "tid", "verden", "spørgsmål", "hånd", "øje", "by",
    "hus", "land", "barn", "arbejde", "ord", "stå", "gå", "se", "give", "vide",
    "komme", "tænke", "lade", "gøre", "finde", "sige", "vilje", "få", "holde", "måtte"
  ],
  spanish: [
    "el", "la", "de", "que", "en", "y", "un", "ser", "a", "no", 
    "haber", "por", "con", "su", "para", "como", "estar", "tener", "le", "lo", 
    "todo", "pero", "si", "bien", "año", "persona", "día", "uno", "otro", "este",
    "hacer", "decir", "poder", "ir", "ver", "dar", "saber", "querer", "llegar", "pasar",
    "tiempo", "mano", "ojo", "parte", "casa", "lugar", "manera", "noche", "ciudad", "padre"
  ],
  french: [
    "le", "la", "de", "un", "être", "et", "à", "il", "avoir", "ne",
    "je", "son", "que", "se", "ce", "tout", "faire", "pas", "sur", "pouvoir",
    "dire", "aller", "voir", "en", "qui", "ne", "son", "un", "mon", "si",
    "temps", "main", "oeil", "jour", "homme", "femme", "enfant", "chose", "vie", "pays",
    "monde", "moment", "forme", "lieu", "partie", "point", "petit", "grand", "beau", "vrai"
  ],
  german: [
    "der", "die", "das", "und", "sein", "in", "ein", "zu", "haben", "ich",
    "werden", "mit", "von", "auf", "auch", "nicht", "an", "was", "wenn", "aus",
    "schon", "jahr", "tag", "mensch", "leben", "zeit", "welt", "frage", "fall", "hand",
    "auge", "stadt", "geschichte", "wort", "arbeit", "ende", "land", "haus", "kind", "herr",
    "frau", "stehen", "gehen", "sehen", "geben", "wissen", "kommen", "denken", "lassen", "machen"
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
    "стоять", "идти", "смотреть", "говорить", "знать", "мочь", "хотеть", "думать", "жить", "делать"
  ],
  turkish: [
    "ve", "bir", "bu", "ne", "için", "da", "de", "olan", "gibi", "ama",
    "çok", "daha", "her", "kendi", "sonra", "zaman", "gün", "yıl", "yeni", "insan",
    "dünya", "el", "göz", "hayat", "yer", "yol", "çocuk", "ev", "iş", "şehir",
    "kelime", "su", "kitap", "dil", "taraf", "baş", "can", "kalp", "akıl", "hikaye",
    "olmak", "demek", "bilmek", "gelmek", "görmek", "almak", "vermek", "gitmek", "yapmak", "bakmak"
  ],
  vietnamese: [
    "và", "một", "là", "trong", "có", "những", "cho", "được", "không", "với",
    "người", "của", "đã", "con", "này", "khi", "ngày", "năm", "mới", "thế",
    "đời", "nhà", "tay", "mắt", "nước", "đường", "trời", "đất", "thành", "phố",
    "chữ", "sách", "học", "làm", "biết", "đi", "thấy", "yêu", "vui", "buồn",
    "thời", "gian", "sống", "chết", "tâm", "thân", "trung", "quốc", "việt", "nam"
  ],
  bengali: [
    "আমি", "তুমি", "সে", "আমরা", "তোমরা", "তারা", "বই", "কলম", "পানি", "খাবার",
    "বাগান", "ফুল", "পাখি", "মাছ", "আকাশ", "বাতাস", "সূর্য", "চাঁদ", "তারা", "পৃথিবী",
    "মানুষ", "বন্ধু", "পরিবার", "মা", "বাবা", "ভাই", "বোন", "বাড়ি", "স্কুল", "কাজ",
    "ভালো", "খারাপ", "সুন্দর", "ছোট", "বড়", "লাল", "নীল", "সবুজ", "জল", "কথা",
    "দিন", "রাত", "সকাল", "বিকেল", "সন্ধ্যা", "সময়", "বাংলাদেশ", "ভাষা", "শিক্ষা", "জীবন"
  ],
  arabic: [
    "أنا", "أنت", "هو", "هي", "نحن", "هم", "كتاب", "قلم", "ماء", "طعام",
    "حديقة", "زهرة", "طائر", "سمك", "سماء", "رياح", "شمس", "قمر", "نجم", "أرض",
    "إنسان", "صديق", "عائلة", "أب", "أمي", "أخ", "أخت", "بيت", "مدرسة", "عمل",
    "جيد", "سيء", "جميل", "صغير", "كبير", "أحمر", "أزرق", "أخضر", "وقت", "كلام",
    "يوم", "ليلة", "صباح", "مساء", "لغة", "حياة", "سلام", "حب", "سفر", "مدينة"
  ],
  korean: [
    "나", "너", "그", "그녀", "우리", "그들", "책", "펜", "물", "음식",
    "정원", "꽃", "새", "물고기", "하늘", "바람", "태양", "달", "별", "지구",
    "사람", "친구", "가족", "아버지", "어머니", "형제", "자매", "집", "학교", "일",
    "좋다", "나쁘다", "예쁘다", "작다", "크다", "빨간색", "파란색", "초록색", "시간", "말",
    "낮", "밤", "아침", "오후", "저녁", "언어", "인생", "평화", "사랑", "도시"
  ],
  nepali: [
    "म", "तिमी", "ऊ", "हामी", "तपाईं", "उनीहरू", "किताब", "कलम", "पानी", "खाना",
    "बगैंचा", "फूल", "चरा", "माछा", "आकाश", "हावा", "घाम", "जुन", "तारा", "पृथ्वी",
    "मान्छे", "साथी", "परिवार", "बुबा", "आमा", "दाजु", "बहिनी", "घर", "विद्यालय", "काम",
    "राम्रो", "नराम्रो", "सुन्दर", "सानो", "ठूलो", "रातो", "नीलो", "हरियो", "समय", "कुरा",
    "दिन", "रात", "बिहान", "दिउँसो", "बेलुका", "भाषा", "जीवन", "शान्ति", "माया", "शहर"
  ],
  japanese: [
    "私", "あなた", "彼", "彼女", "私たち", "彼ら", "本", "ペン", "水", "食べ物",
    "庭", "花", "鳥", "魚", "空", "風", "太陽", "月", "星", "地球",
    "人", "友達", "家族", "父", "母", "兄", "妹", "家", "学校", "仕事",
    "良い", "悪い", "美しい", "小さい", "大きい", "赤", "青", "緑", "時間", "言葉",
    "昼", "夜", "朝", "午後", "夕方", "言語", "人生", "平和", "愛", "都会"
  ],
  chinese: [
    "我", "你", "他", "她", "我们", "他们", "书", "笔", "水", "食物",
    "花园", "花", "鸟", "鱼", "天空", "风", "太阳", "月亮", "星星", "地球",
    "人", "朋友", "家人", "父亲", "母亲", "兄弟", "姐妹", "房子", "学校", "工作",
    "好", "坏", "美", "小", "大", "红色", "蓝色", "绿色", "时间", "话",
    "白天", "晚上", "早上", "下午", "晚上", "语言", "生活", "和平", "爱", "城市"
  ],
  hindi: [
    "मैं", "तुम", "वह", "हम", "वे", "किताब", "कलम", "पानी", "खाना", "बगीचा",
    "फूल", "पक्षी", "मछली", "आसमान", "हवा", "सूरज", "चाँद", "तारा", "पृथ्वी", "इंसान",
    "दोस्त", "परिवार", "पिता", "माँ", "भाई", "बहन", "घर", "स्कूल", "काम", "अच्छा",
    "बुरा", "सुंदर", "छोटा", "बड़ा", "लाल", "नीला", "हरा", "समय", "बात", "दिन",
    "रात", "सुबह", "शाम", "भाषा", "जीवन", "शांति", "प्यार", "शहर", "देश", "शिक्षा"
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
    "Life is what happens when you're busy making other plans."
  ],
  spanish: [
    "La única forma de hacer un gran trabajo es amar lo que haces.",
    "Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de otra persona.",
    "Sé el cambio que deseas ver en el mundo.",
    "La vida es lo que sucede mientras estás ocupado haciendo otros planes.",
    "No cuentes los días, haz que los días cuenten."
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
    "الحياة هي ما يحدث لك بينما أنت مشغول في صنع خطط أخرى."
  ],
  bengali: [
    "ভালো কাজ করার একমাত্র উপায় হলো নিজের কাজকে ভালোবাসা।",
    "আপনার সময় সীমিত, তাই অন্যের জীবন যাপন করে এটি নষ্ট করবেন না।",
    "আপনি বিশ্বে যে পরিবর্তন দেখতে চান তা নিজেই হয়ে উঠুন।",
    "জীবন হলো তা-ই যা আপনার অন্য পরিকল্পনা করার সময় ঘটে।"
  ],
  hindi: [
    "महान कार्य करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।",
    "आपका समय सीमित है, इसलिए इसे किसी और का जीवन जीने में बर्बाद न करें।",
    "वह परिवर्तन खुद बनिए जो आप दुनिया में देखना चाहते हैं।",
    "जीवन वह है जो तब घटित होता है जब आप अन्य योजनाएं बनाने में व्यस्त होते हैं।"
  ],
  chinese: [
    "取得伟大成就的唯一途径是热爱你的工作。",
    "你的时间有限，所以不要浪费时间去过别人的生活。",
    "成为你想在世界上看到的改变。",
    "生活就是当你忙于制定其他计划时所发生的事情。"
  ],
  japanese: [
    "素晴らしい仕事をする唯一の方法は、自分の仕事を愛することだ。",
    "あなたの時間は限られている。だから、誰かの人生を生きることで浪費してはいけない。",
    "世界に変革を求めるなら、自分自身がその変革になれ。",
    "人生とは、他の計画を立てるのに忙しいときに起こるものだ。"
  ],
  korean: [
    "위대한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것입니다.",
    "당신의 시간은 한정되어 있습니다. 그러니 다른 사람의 삶을 사느라 시간을 낭비하지 마십시오.",
    "세상에서 보고 싶은 변화가 있다면 당신 스스로 그 변화가 되십시오.",
    "인생이란 당신이 다른 계획을 세우느라 바쁠 때 일어나는 것입니다."
  ]
};
