export interface Greeting {
  chinese: string
  pinyin: string
  english: string
  emoji: string
}

export const greetings: Greeting[] = [
  { chinese: "万事如意", pinyin: "Wàn Shì Rú Yì", english: "May all your wishes come true", emoji: "🌟" },
  { chinese: "龙马精神", pinyin: "Lóng Mǎ Jīng Shén", english: "Wishing you the vigor and vitality of a dragon and horse", emoji: "🐲" },
  { chinese: "步步高升", pinyin: "Bù Bù Gāo Shēng", english: "May you climb higher and higher in your career", emoji: "🪜" },
  { chinese: "财源广进", pinyin: "Cái Yuán Guǎng Jìn", english: "May wealth flow in from all directions", emoji: "💰" },
  { chinese: "福寿双全", pinyin: "Fú Shòu Shuāng Quán", english: "May you have both happiness and longevity", emoji: "🎋" },
  { chinese: "年年有余", pinyin: "Nián Nián Yǒu Yú", english: "May you have abundance year after year", emoji: "🐟" },
  { chinese: "身体健康", pinyin: "Shēn Tǐ Jiàn Kāng", english: "Wishing you good health", emoji: "❤️" },
  { chinese: "平安喜乐", pinyin: "Píng Ān Xǐ Lè", english: "Wishing you peace and joy", emoji: "☮️" },
  { chinese: "心想事成", pinyin: "Xīn Xiǎng Shì Chéng", english: "May all your wishes come true", emoji: "✨" },
  { chinese: "笑口常开", pinyin: "Xiào Kǒu Cháng Kāi", english: "May you always be smiling", emoji: "😊" },
  { chinese: "大吉大利", pinyin: "Dà Jí Dà Lì", english: "Great luck and great profit", emoji: "🎊" },
  { chinese: "吉祥如意", pinyin: "Jí Xiáng Rú Yì", english: "Good fortune according to your wishes", emoji: "🎋" },
  { chinese: "金玉满堂", pinyin: "Jīn Yù Mǎn Táng", english: "May gold and jade fill your halls", emoji: "💎" },
  { chinese: "马到成功", pinyin: "Mǎ Dào Chéng Gōng", english: "Wishing you immediate success", emoji: "🏃" },
  { chinese: "花开富贵", pinyin: "Huā Kāi Fù Guì", english: "May blossoming flowers bring wealth and honor", emoji: "🌺" },
  { chinese: "日进斗金", pinyin: "Rì Jìn Dǒu Jīn", english: "May your wealth increase by the bucketful each day", emoji: "💰" },
  { chinese: "吉星高照", pinyin: "Jí Xīng Gāo Zhào", english: "May the lucky star shine down upon you", emoji: "⭐" },
  { chinese: "五福临门", pinyin: "Wǔ Fú Lín Mén", english: "May five kinds of blessings arrive at your door", emoji: "🏮" },
  { chinese: "龙腾虎跃", pinyin: "Lóng Téng Hǔ Yuè", english: "Wishing you the vigorous spirit of dragons and tigers", emoji: "🐲" },
  { chinese: "蒸蒸日上", pinyin: "Zhēng Zhēng Rì Shàng", english: "May everything rise and prosper day by day", emoji: "📈" },
  { chinese: "大展宏图", pinyin: "Dà Zhǎn Hóng Tú", english: "Wishing you grand prospects and achievements", emoji: "🌅" },
  { chinese: "事业有成", pinyin: "Shì Yè Yǒu Chéng", english: "May your career be successful", emoji: "💼" }
]

// Fisher-Yates shuffle function
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
} 