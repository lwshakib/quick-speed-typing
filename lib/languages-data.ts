
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
  ]
};
