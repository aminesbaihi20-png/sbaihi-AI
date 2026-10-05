/** Read text aloud with the browser's built-in text-to-speech. */
export function speakText(text: string, lang = "fr-FR") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    // eslint-disable-next-line no-console
    console.log("المتصفح لا يدعم نطق الصوت تلقائياً");
    return;
  }

  const synth = window.speechSynthesis;
  // تحبيس أي صوت سابق
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // استخدام اللغة الممررة، مع اكتشاف تلقائي للعربية كاحتياط
  utterance.lang = lang || (/[\u0600-\u06FF]/.test(text) ? "ar-SA" : "fr-FR");
  utterance.rate = 0.92; // سرعة طبيعية وسلسة
  utterance.pitch = 1.0; // نبرة متوازنة

  // اختار صوت طبيعي إلا كان متوفر فالمتصفح
  const voices = synth.getVoices();
  const naturalVoice = voices.find(
    (v) => v.lang.startsWith(utterance.lang) && v.name.includes("Natural"),
  );
  if (naturalVoice) utterance.voice = naturalVoice;

  synth.speak(utterance);
}

/** Stop any ongoing speech immediately. */
export function stopAudio() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}
