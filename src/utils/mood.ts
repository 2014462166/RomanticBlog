const MOODS: Record<string, string> = {
  开心: "😊",
  幸福: "🥰",
  甜蜜: "🍯",
  感动: "🥹",
  平静: "😌",
  思念: "💭",
  期待: "✨",
  生气: "😤",
  难过: "😢",
  疲惫: "😴",
};

export function moodEmoji(mood?: string): string {
  if (!mood) return "";
  return MOODS[mood] ?? "💫";
}
