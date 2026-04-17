const sourceText = document.getElementById("sourceText");
const resultText = document.getElementById("resultText");
const translateForm = document.getElementById("translateForm");
const translateButton = document.getElementById("translateButton");
const correctButton = document.getElementById("correctButton");
const simplifyButton = document.getElementById("simplifyButton");
const useSimplifiedButton = document.getElementById("useSimplifiedButton");
const explainEnglishButton = document.getElementById("explainEnglishButton");
const copyButton = document.getElementById("copyButton");
const speakButton = document.getElementById("speakButton");
const speakSourceButton = document.getElementById("speakSourceButton");
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");
const swapButton = document.getElementById("swapButton");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const clearSavedButton = document.getElementById("clearSavedButton");
const historyList = document.getElementById("historyList");
const savedList = document.getElementById("savedList");
const statusValue = document.getElementById("statusValue");
const countValue = document.getElementById("countValue");
const detectedLanguageValue = document.getElementById("detectedLanguageValue");
const textSizeValue = document.getElementById("textSizeValue");
const readingTimeValue = document.getElementById("readingTimeValue");
const sourceLabel = document.getElementById("sourceLabel");
const resultLabel = document.getElementById("resultLabel");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const definitionsTitle = document.getElementById("definitionsTitle");
const definitionList = document.getElementById("definitionList");
const simplifiedText = document.getElementById("simplifiedText");
const englishText = document.getElementById("englishText");
const phraseList = document.getElementById("phraseList");

const maxCharacters = Number(sourceText.maxLength);
const chunkSize = 460;
const historyKey = "multilingual-translator-history";
const savedKey = "multilingual-translator-saved";

const languages = [
  { code: "en", speech: "en-US", correction: "en-US", name: "English", placeholder: "Write or paste English here..." },
  { code: "zh-CN", speech: "zh-CN", correction: "zh-CN", name: "Chinese Simplified", placeholder: "在这里输入或粘贴中文..." },
  { code: "zh-TW", speech: "zh-TW", correction: "zh-TW", name: "Chinese Traditional", placeholder: "在這裡輸入或貼上中文..." },
  { code: "es", speech: "es-ES", correction: "es", name: "Spanish", placeholder: "Escribe o pega texto en español..." },
  { code: "fr", speech: "fr-FR", correction: "fr", name: "French", placeholder: "Ecrivez ou collez du texte en francais..." },
  { code: "ja", speech: "ja-JP", correction: "ja-JP", name: "Japanese", placeholder: "日本語を入力または貼り付けてください..." },
  { code: "ko", speech: "ko-KR", correction: "ko-KR", name: "Korean", placeholder: "한국어를 입력하거나 붙여넣으세요..." },
  { code: "de", speech: "de-DE", correction: "de-DE", name: "German", placeholder: "Deutsch schreiben oder einfugen..." },
  { code: "it", speech: "it-IT", correction: "it", name: "Italian", placeholder: "Scrivi o incolla testo in italiano..." },
  { code: "pt", speech: "pt-PT", correction: "pt", name: "Portuguese", placeholder: "Escreva ou cole texto em portugues..." },
  { code: "ru", speech: "ru-RU", correction: "ru-RU", name: "Russian", placeholder: "Введите или вставьте русский текст..." },
  { code: "ar", speech: "ar-SA", correction: "ar", name: "Arabic", placeholder: "اكتب النص العربي أو الصقه هنا..." },
  { code: "hi", speech: "hi-IN", correction: "hi-IN", name: "Hindi", placeholder: "हिंदी टेक्स्ट लिखें या पेस्ट करें..." },
];

const phraseBook = new Map([
  ["en|zh-CN|hello", "你好"],
  ["en|zh-CN|good morning", "早上好"],
  ["en|zh-CN|thank you", "谢谢"],
  ["en|zh-CN|how are you", "你好吗"],
  ["zh-CN|en|你好", "hello"],
  ["zh-CN|en|谢谢", "thank you"],
  ["zh-CN|en|早上好", "good morning"],
  ["zh-CN|en|你好吗", "how are you"],
  ["en|es|hello", "hola"],
  ["en|fr|hello", "bonjour"],
  ["en|ja|hello", "こんにちは"],
  ["en|ko|hello", "안녕하세요"],
  ["en|de|hello", "hallo"],
]);

const typoFallbacks = new Map([
  ["teh", "the"],
  ["recieve", "receive"],
  ["adress", "address"],
  ["seperate", "separate"],
  ["definately", "definitely"],
  ["langauge", "language"],
  ["lauguges", "languages"],
  ["oposite", "opposite"],
  ["becuase", "because"],
  ["wierd", "weird"],
  ["acheive", "achieve"],
  ["frend", "friend"],
]);

const simplerWords = new Map([
  ["approximately", "about"],
  ["assistance", "help"],
  ["commence", "start"],
  ["complete", "finish"],
  ["complicated", "hard"],
  ["demonstrate", "show"],
  ["difficult", "hard"],
  ["endeavor", "try"],
  ["enormous", "very big"],
  ["excellent", "very good"],
  ["frequently", "often"],
  ["immediately", "now"],
  ["implement", "make"],
  ["incorrect", "wrong"],
  ["indicate", "show"],
  ["information", "facts"],
  ["initial", "first"],
  ["numerous", "many"],
  ["obtain", "get"],
  ["opportunity", "chance"],
  ["purchase", "buy"],
  ["require", "need"],
  ["reside", "live"],
  ["sufficient", "enough"],
  ["terminate", "end"],
  ["therefore", "so"],
  ["utilize", "use"],
]);

const commonPhrases = [
  {
    intent: "Greeting",
    phrases: {
      en: "Hello, nice to meet you.",
      "zh-CN": "你好，很高兴认识你。",
      "zh-TW": "你好，很高興認識你。",
      es: "Hola, mucho gusto.",
      fr: "Bonjour, ravi de vous rencontrer.",
      ja: "こんにちは、はじめまして。",
      ko: "안녕하세요, 만나서 반갑습니다.",
      de: "Hallo, freut mich, Sie kennenzulernen.",
      it: "Ciao, piacere di conoscerti.",
      pt: "Ola, prazer em conhecer voce.",
      ru: "Здравствуйте, приятно познакомиться.",
      ar: "مرحبا، سعيد بلقائك.",
      hi: "नमस्ते, आपसे मिलकर खुशी हुई।",
    },
  },
  {
    intent: "Help",
    phrases: {
      en: "Can you help me?",
      "zh-CN": "你能帮我吗？",
      "zh-TW": "你能幫我嗎？",
      es: "Puedes ayudarme?",
      fr: "Pouvez-vous m'aider?",
      ja: "手伝ってくれますか。",
      ko: "도와주실 수 있나요?",
      de: "Koennen Sie mir helfen?",
      it: "Puoi aiutarmi?",
      pt: "Voce pode me ajudar?",
      ru: "Вы можете мне помочь?",
      ar: "هل يمكنك مساعدتي؟",
      hi: "क्या आप मेरी मदद कर सकते हैं?",
    },
  },
  {
    intent: "Price",
    phrases: {
      en: "How much does this cost?",
      "zh-CN": "这个多少钱？",
      "zh-TW": "這個多少錢？",
      es: "Cuanto cuesta esto?",
      fr: "Combien ca coute?",
      ja: "これはいくらですか。",
      ko: "이거 얼마인가요?",
      de: "Wie viel kostet das?",
      it: "Quanto costa questo?",
      pt: "Quanto custa isto?",
      ru: "Сколько это стоит?",
      ar: "كم سعر هذا؟",
      hi: "इसकी कीमत कितनी है?",
    },
  },
  {
    intent: "Directions",
    phrases: {
      en: "Where is the nearest station?",
      "zh-CN": "最近的车站在哪里？",
      "zh-TW": "最近的車站在哪裡？",
      es: "Donde esta la estacion mas cercana?",
      fr: "Ou est la gare la plus proche?",
      ja: "最寄りの駅はどこですか。",
      ko: "가장 가까운 역이 어디인가요?",
      de: "Wo ist der naechste Bahnhof?",
      it: "Dove si trova la stazione piu vicina?",
      pt: "Onde fica a estacao mais proxima?",
      ru: "Где ближайшая станция?",
      ar: "أين أقرب محطة؟",
      hi: "सबसे नजदीकी स्टेशन कहाँ है?",
    },
  },
  {
    intent: "Food",
    phrases: {
      en: "I would like to order this.",
      "zh-CN": "我想点这个。",
      "zh-TW": "我想點這個。",
      es: "Me gustaria pedir esto.",
      fr: "Je voudrais commander ceci.",
      ja: "これを注文したいです。",
      ko: "이것을 주문하고 싶어요.",
      de: "Ich moechte das bestellen.",
      it: "Vorrei ordinare questo.",
      pt: "Eu gostaria de pedir isto.",
      ru: "Я хотел бы заказать это.",
      ar: "أود طلب هذا.",
      hi: "मैं यह ऑर्डर करना चाहता हूँ।",
    },
  },
];

const englishMeanings = new Map([
  ["hello", "a friendly greeting you say when you meet someone"],
  ["translate", "to change words from one language into another language"],
  ["translation", "words that have been changed from one language into another"],
  ["simplify", "to make something easier to understand"],
  ["phrase", "a small group of words that work together"],
  ["greeting", "words you use to welcome or meet someone"],
  ["help", "support or assistance for someone who needs it"],
  ["price", "the amount of money something costs"],
  ["station", "a place where buses or trains stop"],
  ["order", "to ask for food, goods, or services"],
  ["language", "a system of words people use to speak and write"],
  ["pronunciation", "the way a word is spoken"],
  ["unfinished", "not completed yet"],
  ["word", "a single unit of language with meaning"],
  ["friend", "a person you know well and like"],
  ["receive", "to get something that is sent or given to you"],
  ["address", "the details that show where a place is"],
  ["separate", "to divide or keep things apart"],
  ["definitely", "without any doubt"],
  ["because", "for the reason that"],
  ["weird", "strange or unusual"],
  ["achieve", "to successfully reach a goal"],
  ["opposite", "completely different or facing the other way"],
]);

const englishWordBank = [
  ...new Set([
    ...englishMeanings.keys(),
    ...typoFallbacks.values(),
    ...simplerWords.keys(),
    ...simplerWords.values(),
    "cost",
    "nearest",
    "english",
    "definition",
    "similar",
    "spelling",
    "mistake",
    "update",
  ]),
];

let history = loadHistory();
let savedTranslations = loadSaved();
let activeRequest = null;
let availableVoices = [];
let autoTranslateTimer = null;
let latestRequestId = 0;

function populateLanguages() {
  const options = languages
    .map((language) => `<option value="${language.code}">${language.name}</option>`)
    .join("");
  sourceLanguage.innerHTML = options;
  targetLanguage.innerHTML = options;
  sourceLanguage.value = "en";
  targetLanguage.value = "zh-CN";
}

function getLanguage(code) {
  return languages.find((language) => language.code === code) ?? languages[0];
}

function getLanguagePair() {
  const source = getLanguage(sourceLanguage.value);
  const target = getLanguage(targetLanguage.value);
  return { source, target };
}

function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ");
}

function setStatus(message) {
  statusValue.textContent = message;
}

function updateLabels() {
  const { source, target } = getLanguagePair();
  sourceLabel.textContent = source.name;
  resultLabel.textContent = target.name;
  sourceText.placeholder = source.placeholder;
  renderDefinitions([], "Other translations");
  renderPhrases();
  updateDetails();
}

function getEnglishSourceText() {
  if (sourceLanguage.value === "en" && sourceText.value.trim()) {
    return sourceText.value.trim();
  }

  if (targetLanguage.value === "en" && resultText.textContent.trim() && resultText.textContent.trim() !== "Translation will appear here.") {
    return resultText.textContent.trim();
  }

  return sourceText.value.trim();
}

function explainEnglishValue(text) {
  const cleaned = normalizeText(text);

  if (!cleaned) {
    return "Type English text first.";
  }

  const lower = cleaned.toLowerCase();
  const directMeaning = englishMeanings.get(lower);
  if (directMeaning) {
    return `${cleaned}: ${directMeaning}.`;
  }

  const simplified = simplifyEnglishText(cleaned);
  if (cleaned.split(" ").length === 1) {
    const prefixMatches = [...englishMeanings.keys()].filter((word) => word.startsWith(lower)).slice(0, 3);
    if (prefixMatches.length > 0) {
      return `This looks like the start of ${prefixMatches.join(", ")}.`;
    }

    if (simplified !== cleaned) {
      return `${cleaned} can be said more simply as ${simplified}.`;
    }

    return `${cleaned} is an English word or part of a word. Type a little more and I will explain it better.`;
  }

  if (simplified !== cleaned) {
    return `In plain English: ${simplified}.`;
  }

  return `Plain English meaning: ${cleaned}.`;
}

function updateEnglishExplanation() {
  englishText.textContent = explainEnglishValue(getEnglishSourceText());
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function getWordMeaning(word) {
  return englishMeanings.get(word.toLowerCase()) ?? "an English word with a similar spelling";
}

function getSpellingSuggestions(text) {
  if (sourceLanguage.value !== "en") {
    return [];
  }

  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  const uniqueWords = [...new Set(words)];
  const suggestions = [];

  uniqueWords.forEach((word) => {
    const exactKnown =
      englishWordBank.includes(word) ||
      commonPhrases.some((item) => Object.values(item.phrases).some((phrase) => phrase.toLowerCase().includes(word)));

    if (exactKnown) {
      return;
    }

    const ranked = englishWordBank
      .map((candidate) => ({
        text: candidate,
        distance: levenshteinDistance(word, candidate),
      }))
      .filter((candidate) => candidate.distance <= 2 || candidate.text.startsWith(word) || word.startsWith(candidate.text))
      .sort((a, b) => a.distance - b.distance || a.text.length - b.text.length)
      .slice(0, 3);

    ranked.forEach((candidate) => {
      suggestions.push({
        text: candidate.text,
        quality: 0,
        note: `${word} -> ${candidate.text}`,
        description: getWordMeaning(candidate.text),
      });
    });
  });

  return suggestions.slice(0, 6);
}

function countWords(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 0;
  }

  const latinWords = trimmed.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? [];
  const cjkCharacters = trimmed.match(/[\u3400-\u9fff\uf900-\ufaff]/g) ?? [];
  const otherWords = trimmed
    .replace(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g, " ")
    .replace(/[\u3400-\u9fff\uf900-\ufaff]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return latinWords.length + cjkCharacters.length + otherWords.length;
}

function updateCount() {
  countValue.textContent = `${countWords(sourceText.value)} words / ${sourceText.value.length} of ${maxCharacters} characters`;
  updateDetails();
  updateEnglishExplanation();
}

function detectLanguage(text) {
  const value = text.trim();

  if (!value) {
    return "No text yet";
  }

  const signals = [
    { pattern: /[\u4e00-\u9fff]/, name: "Chinese" },
    { pattern: /[\u3040-\u30ff]/, name: "Japanese" },
    { pattern: /[\uac00-\ud7af]/, name: "Korean" },
    { pattern: /[\u0400-\u04ff]/, name: "Russian" },
    { pattern: /[\u0600-\u06ff]/, name: "Arabic" },
    { pattern: /[\u0900-\u097f]/, name: "Hindi" },
    { pattern: /\b(el|la|los|las|gracias|hola|por favor)\b/i, name: "Spanish" },
    { pattern: /\b(le|la|les|bonjour|merci|avec|pour)\b/i, name: "French" },
    { pattern: /\b(der|die|das|und|bitte|danke)\b/i, name: "German" },
    { pattern: /\b(the|and|please|hello|thank|where)\b/i, name: "English" },
  ];
  return signals.find((signal) => signal.pattern.test(value))?.name ?? "Unknown";
}

function updateDetails() {
  const words = countWords(sourceText.value);
  const characters = sourceText.value.length;
  const minutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 180));
  detectedLanguageValue.textContent = detectLanguage(sourceText.value);
  textSizeValue.textContent = `${words} words, ${characters} characters`;
  readingTimeValue.textContent = `${minutes} min`;
}

function getOfflineTranslation(text) {
  const { source, target } = getLanguagePair();
  const normalized = normalizeText(text).toLowerCase();
  return phraseBook.get(`${source.code}|${target.code}|${normalized}`) ?? "";
}

function splitForTranslation(text) {
  const parts = [];
  const blocks = text.match(/[^\n]+|\n+/g) ?? [];

  blocks.forEach((block) => {
    if (block.length <= chunkSize) {
      parts.push(block);
      return;
    }

    const sentences = block.match(/[^.!?。！？]+[.!?。！？]?\s*/g) ?? [block];
    let current = "";

    sentences.forEach((sentence) => {
      if ((current + sentence).length <= chunkSize) {
        current += sentence;
        return;
      }

      if (current) {
        parts.push(current);
        current = "";
      }

      for (let index = 0; index < sentence.length; index += chunkSize) {
        const slice = sentence.slice(index, index + chunkSize);
        if (slice.length === chunkSize) {
          parts.push(slice);
        } else {
          current = slice;
        }
      }
    });

    if (current) {
      parts.push(current);
    }
  });

  return parts;
}

async function translateChunk(text) {
  const { source, target } = getLanguagePair();
  const params = new URLSearchParams({
    q: text,
    langpair: `${source.code}|${target.code}`,
  });
  const response = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`, {
    signal: activeRequest.signal,
  });

  if (!response.ok) {
    throw new Error("Translation service is not available.");
  }

  const data = await response.json();
  const translated = data?.responseData?.translatedText;

  if (!translated) {
    throw new Error("No translation was returned.");
  }

  return {
    translated,
    matches: Array.isArray(data.matches) ? data.matches : [],
  };
}

async function translateOnline(text) {
  const chunks = splitForTranslation(text);
  const translated = [];
  const allMatches = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];

    if (!chunk.trim()) {
      translated.push(chunk);
      continue;
    }

    setStatus(`Translating ${index + 1} of ${chunks.length}`);
    const result = await translateChunk(chunk);
    translated.push(result.translated);
    allMatches.push(...result.matches);
  }

  return {
    text: translated.join(""),
    matches: allMatches,
  };
}

async function translateText() {
  const text = sourceText.value.trim();
  const requestId = ++latestRequestId;

  if (!text) {
    resultText.textContent = "Type something first.";
    setStatus("Waiting");
    return;
  }

  if (sourceLanguage.value === targetLanguage.value) {
    resultText.textContent = text;
    setStatus("Same language");
    return;
  }

  if (activeRequest) {
    activeRequest.abort();
  }

  activeRequest = new AbortController();
  translateButton.disabled = true;
  correctButton.disabled = true;
  simplifyButton.disabled = true;
  setStatus("Translating");
  renderDefinitions([], "Other translations");

  try {
    const translated = await translateOnline(text);
    if (requestId !== latestRequestId) {
      return;
    }
    resultText.textContent = translated.text;
    renderDefinitions(getAlternativeTranslations(translated.matches, translated.text));
    setStatus("Online result");
    saveHistory(text, translated.text);
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    const fallback = getOfflineTranslation(text);
    if (requestId !== latestRequestId) {
      return;
    }
    resultText.textContent =
      fallback ||
      "The online translator could not be reached. Try a common short phrase, or check the internet connection.";
    setStatus(fallback ? "Local phrase book" : "Offline");

    if (fallback) {
      saveHistory(text, fallback);
    }
  } finally {
    translateButton.disabled = false;
    correctButton.disabled = false;
    simplifyButton.disabled = false;
    activeRequest = null;
  }
}

function queueAutoTranslate() {
  clearTimeout(autoTranslateTimer);

  const text = sourceText.value.trim();
  if (!text) {
    return;
  }

  autoTranslateTimer = setTimeout(() => {
    translateText();
  }, 450);
}

function getAlternativeTranslations(matches, mainTranslation) {
  const seen = new Set([normalizeText(mainTranslation).toLowerCase()]);

  return matches
    .map((match) => ({
      text: normalizeText(match.translation ?? ""),
      quality: Math.min(Number(match.match ?? 0), 1),
    }))
    .filter((item) => {
      const key = item.text.toLowerCase();
      if (!item.text || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.quality - a.quality)
    .slice(0, 5);
}

function renderDefinitions(items, title = "Other translations") {
  definitionsTitle.textContent = title;
  definitionList.innerHTML = "";

  if (items.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-definition";
    item.textContent =
      title === "Similar words"
        ? "When a word looks misspelled, similar English words will appear here."
        : "Translate a word or sentence to see other possible meanings.";
    definitionList.append(item);
    return;
  }

  items.forEach((definition) => {
    const item = document.createElement("li");
    item.className = "definition-item";

    const text = document.createElement("button");
    text.type = "button";
    text.textContent = definition.text;
    text.addEventListener("click", () => {
      resultText.textContent = definition.text;
      setStatus("Alternative selected");
    });

    const score = document.createElement("span");
    score.textContent =
      definition.note ||
      definition.description ||
      (definition.quality ? `${Math.round(definition.quality * 100)}% match` : "possible meaning");

    item.append(text, score);
    definitionList.append(item);
  });
}

function applyCorrections(text, matches) {
  const usefulMatches = matches
    .filter((match) => match.replacements?.length)
    .sort((a, b) => b.offset - a.offset);
  let corrected = text;

  usefulMatches.forEach((match) => {
    const replacement = match.replacements[0].value;
    corrected = `${corrected.slice(0, match.offset)}${replacement}${corrected.slice(
      match.offset + match.length,
    )}`;
  });

  return corrected;
}

function applyLocalCorrections(text) {
  return text.replace(/\b[A-Za-z']+\b/g, (word) => {
    const replacement = typoFallbacks.get(word.toLowerCase());

    if (!replacement) {
      return word;
    }

    return /^[A-Z]/.test(word) ? `${replacement.charAt(0).toUpperCase()}${replacement.slice(1)}` : replacement;
  });
}

async function correctSpelling() {
  const text = sourceText.value.trim();

  if (!text) {
    setStatus("Nothing to correct");
    return;
  }

  const { source } = getLanguagePair();
  correctButton.disabled = true;
  setStatus("Checking spelling");

  try {
    const body = new URLSearchParams({
      text,
      language: source.correction,
    });
    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      body,
    });

    if (!response.ok) {
      throw new Error("Spelling service is not available.");
    }

    const data = await response.json();
    const corrected = applyCorrections(text, data.matches ?? []);

    if (corrected === text) {
      const localCorrection = applyLocalCorrections(text);
      sourceText.value = localCorrection;
      setStatus(localCorrection === text ? "No spelling changes" : "Corrected locally");
    } else {
      sourceText.value = corrected;
      setStatus("Spelling corrected");
    }
    const suggestions = getSpellingSuggestions(text);
    if (suggestions.length > 0) {
      renderDefinitions(suggestions, "Similar words");
    }
  } catch {
    const corrected = applyLocalCorrections(text);
    sourceText.value = corrected;
    setStatus(corrected === text ? "No local spelling changes" : "Corrected locally");
    const suggestions = getSpellingSuggestions(text);
    if (suggestions.length > 0) {
      renderDefinitions(suggestions, "Similar words");
    }
  } finally {
    correctButton.disabled = false;
    updateCount();
    sourceText.focus();
  }
}

function loadHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(historyKey) ?? "[]");
    return Array.isArray(stored) ? stored.slice(0, 10) : [];
  } catch {
    return [];
  }
}

function loadSaved() {
  try {
    const stored = JSON.parse(localStorage.getItem(savedKey) ?? "[]");
    return Array.isArray(stored) ? stored.slice(0, 12) : [];
  } catch {
    return [];
  }
}

function saveHistory(source, result) {
  const nextEntry = {
    sourceCode: sourceLanguage.value,
    targetCode: targetLanguage.value,
    source,
    result,
    createdAt: new Date().toISOString(),
  };

  history = [
    nextEntry,
    ...history.filter(
      (item) =>
        item.source !== source ||
        item.sourceCode !== sourceLanguage.value ||
        item.targetCode !== targetLanguage.value,
    ),
  ].slice(0, 10);
  localStorage.setItem(historyKey, JSON.stringify(history));
  renderHistory();
}

function saveCurrentTranslation() {
  const source = sourceText.value.trim();
  const result = resultText.textContent.trim();

  if (!source || !result || result === "Translation will appear here.") {
    setStatus("Nothing to save");
    return;
  }

  const nextEntry = {
    sourceCode: sourceLanguage.value,
    targetCode: targetLanguage.value,
    source,
    result,
    createdAt: new Date().toISOString(),
  };
  savedTranslations = [
    nextEntry,
    ...savedTranslations.filter(
      (item) =>
        item.source !== source ||
        item.result !== result ||
        item.sourceCode !== sourceLanguage.value ||
        item.targetCode !== targetLanguage.value,
    ),
  ].slice(0, 12);
  localStorage.setItem(savedKey, JSON.stringify(savedTranslations));
  renderSaved();
  setStatus("Saved");
}

function createStoredTranslationItem(item) {
  const historyItem = document.createElement("li");
  historyItem.className = "history-item";

  const button = document.createElement("button");
  button.type = "button";
  button.addEventListener("click", () => {
    sourceLanguage.value = item.sourceCode ?? "en";
    targetLanguage.value = item.targetCode ?? "zh-CN";
    sourceText.value = item.source;
    resultText.textContent = item.result;
    simplifiedText.textContent = "Simplified text will appear here.";
    setStatus("Loaded");
    updateLabels();
    updateCount();
    sourceText.focus();
  });

  const direction = document.createElement("span");
  direction.className = "history-direction";
  direction.textContent = `${getLanguage(item.sourceCode ?? "en").name} to ${
    getLanguage(item.targetCode ?? "zh-CN").name
  }`;

  const source = document.createElement("span");
  source.className = "history-source";
  source.textContent = item.source;

  const result = document.createElement("span");
  result.className = "history-result";
  result.textContent = item.result;

  button.append(direction, source, result);
  historyItem.append(button);
  return historyItem;
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-history";
    empty.textContent = "Translated lines will stay here on this computer.";
    historyList.append(empty);
    return;
  }

  history.forEach((item) => {
    historyList.append(createStoredTranslationItem(item));
  });
}

function renderSaved() {
  savedList.innerHTML = "";

  if (savedTranslations.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-history";
    empty.textContent = "Save important translations here.";
    savedList.append(empty);
    return;
  }

  savedTranslations.forEach((item) => {
    savedList.append(createStoredTranslationItem(item));
  });
}

function renderPhrases() {
  phraseList.innerHTML = "";
  const sourceCode = sourceLanguage.value;
  const hasCurrentLanguage = commonPhrases.some((item) => item.phrases[sourceCode]);

  commonPhrases.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "phrase-chip";
    button.textContent = `${item.intent}: ${item.phrases[sourceCode] ?? item.phrases.en}`;
    button.addEventListener("click", () => {
      if (!hasCurrentLanguage) {
        sourceLanguage.value = "en";
      }
      sourceText.value = item.phrases[sourceLanguage.value] ?? item.phrases.en;
      resultText.textContent = "Translation will appear here.";
      simplifiedText.textContent = "Simplified text will appear here.";
      updateLabels();
      updateCount();
      translateText();
    });
    phraseList.append(button);
  });
}

function preserveCapitalization(original, replacement) {
  if (original.toUpperCase() === original) {
    return replacement.toUpperCase();
  }

  if (/^[A-Z]/.test(original)) {
    return `${replacement.charAt(0).toUpperCase()}${replacement.slice(1)}`;
  }

  return replacement;
}

function simplifyEnglishText(text) {
  const replaced = text.replace(/\b[A-Za-z]+(?:'[A-Za-z]+)?\b/g, (word) => {
    const simple = simplerWords.get(word.toLowerCase());
    return simple ? preserveCapitalization(word, simple) : word;
  });

  return replaced
    .replace(/\b(in order to)\b/gi, "to")
    .replace(/\b(due to the fact that)\b/gi, "because")
    .replace(/\b(at this point in time)\b/gi, "now")
    .replace(/\b(a large number of)\b/gi, "many")
    .replace(/\b(prior to)\b/gi, "before")
    .replace(/\b(subsequent to)\b/gi, "after")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function simplifyInput() {
  const text = sourceText.value.trim();

  if (!text) {
    simplifiedText.textContent = "Type English text first.";
    setStatus("Waiting");
    return;
  }

  if (sourceLanguage.value !== "en") {
    simplifiedText.textContent = "Simple words works best when the input language is English.";
    setStatus("Use English input");
    return;
  }

  const simplified = simplifyEnglishText(text);
  simplifiedText.textContent = simplified === text ? "This already looks simple." : simplified;
  setStatus("Simplified");
  updateEnglishExplanation();
}

function useSimplifiedText() {
  const text = simplifiedText.textContent.trim();

  if (!text || text === "Simplified text will appear here." || text === "This already looks simple.") {
    setStatus("Nothing simplified");
    return;
  }

  sourceText.value = text;
  resultText.textContent = "Translation will appear here.";
  updateCount();
  setStatus("Simplified text loaded");
  sourceText.focus();
}

function explainInEnglish() {
  updateEnglishExplanation();
  setStatus("Explained in English");
}

async function copyResult() {
  const text = resultText.textContent.trim();

  if (!text || text === "Translation will appear here.") {
    setStatus("Nothing to copy");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Copied");
  } catch {
    setStatus("Copy blocked");
  }
}

function refreshVoices() {
  if ("speechSynthesis" in window) {
    availableVoices = window.speechSynthesis.getVoices();
  }
}

function chooseVoice(languageCode) {
  refreshVoices();

  if (!availableVoices.length) {
    return null;
  }

  if (languageCode.startsWith("en")) {
    const preferredEnglishNames = ["Samantha", "Alex", "Google US English", "Microsoft Aria", "Daniel"];
    const preferred = availableVoices.find(
      (voice) =>
        voice.lang.toLowerCase().startsWith("en") &&
        preferredEnglishNames.some((name) => voice.name.toLowerCase().includes(name.toLowerCase())),
    );

    if (preferred) {
      return preferred;
    }
  }

  return (
    availableVoices.find((voice) => voice.lang.toLowerCase() === languageCode.toLowerCase()) ||
    availableVoices.find((voice) => voice.lang.toLowerCase().startsWith(languageCode.slice(0, 2).toLowerCase())) ||
    null
  );
}

function speakText(text, languageCode) {
  if (!("speechSynthesis" in window) || !text || text === "Translation will appear here.") {
    setStatus("Speech unavailable");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageCode;
  utterance.voice = chooseVoice(languageCode);
  utterance.rate = languageCode.startsWith("en") ? 0.86 : languageCode.startsWith("zh") || languageCode.startsWith("ja") ? 0.9 : 1;
  utterance.pitch = languageCode.startsWith("en") ? 1 : 1;
  window.speechSynthesis.speak(utterance);
  setStatus("Speaking");
}

function speakResult() {
  const { target } = getLanguagePair();
  speakText(resultText.textContent.trim(), target.speech);
}

function speakSource() {
  const { source } = getLanguagePair();
  speakText(sourceText.value.trim(), source.speech);
}

function swapLanguages() {
  const oldSource = sourceLanguage.value;
  const oldResult = resultText.textContent.trim();
  sourceLanguage.value = targetLanguage.value;
  targetLanguage.value = oldSource;

  if (oldResult && oldResult !== "Translation will appear here.") {
    sourceText.value = oldResult;
    resultText.textContent = "Translation will appear here.";
  }

  updateLabels();
  updateCount();
  setStatus("Swapped");
  sourceText.focus();
}

translateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  translateText();
});

sourceText.addEventListener("input", () => {
  updateCount();
  resultText.textContent = "Translation will appear here.";
  const suggestions = getSpellingSuggestions(sourceText.value);
  renderDefinitions(suggestions, suggestions.length > 0 ? "Similar words" : "Other translations");
  queueAutoTranslate();
});

sourceText.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    clearTimeout(autoTranslateTimer);
    translateText();
  }
});

sourceLanguage.addEventListener("change", () => {
  updateLabels();
  setStatus("Ready");
});

targetLanguage.addEventListener("change", () => {
  updateLabels();
  setStatus("Ready");
});

swapButton.addEventListener("click", swapLanguages);
correctButton.addEventListener("click", correctSpelling);
simplifyButton.addEventListener("click", simplifyInput);
useSimplifiedButton.addEventListener("click", useSimplifiedText);
explainEnglishButton.addEventListener("click", explainInEnglish);
copyButton.addEventListener("click", copyResult);
speakButton.addEventListener("click", speakResult);
speakSourceButton.addEventListener("click", speakSource);
saveButton.addEventListener("click", saveCurrentTranslation);

clearButton.addEventListener("click", () => {
  sourceText.value = "";
  resultText.textContent = "Translation will appear here.";
  simplifiedText.textContent = "Simplified text will appear here.";
  englishText.textContent = "English explanation will appear here.";
  renderDefinitions([], "Other translations");
  updateCount();
  setStatus("Cleared");
  sourceText.focus();
});

clearHistoryButton.addEventListener("click", () => {
  history = [];
  localStorage.removeItem(historyKey);
  renderHistory();
  setStatus("History cleared");
});

clearSavedButton.addEventListener("click", () => {
  savedTranslations = [];
  localStorage.removeItem(savedKey);
  renderSaved();
  setStatus("Saved cleared");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      setStatus("Ready");
    } catch {
      setStatus("Ready");
    }
  });
}

populateLanguages();
refreshVoices();
if ("speechSynthesis" in window) {
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
  } else {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
}
updateLabels();
updateCount();
renderHistory();
renderSaved();
renderDefinitions([], "Other translations");
updateEnglishExplanation();
