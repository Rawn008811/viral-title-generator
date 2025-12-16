/**
 * Simple keyword extraction and text analysis
 */

// Common stop words to ignore
const STOP_WORDS = new Set([
    '이', '그', '저', '것', '수', '등', '들', '및', '에', '와', '과', '를', '을', '의', '가', '이', '은', '는',
    '로', '으로', '만', '도', '하고', '하면', '해서', '있', '하', '되', '같', '때', '년', '월', '일',
    'a', 'the', 'is', 'are', 'to', 'for', 'of', 'in', 'on', 'at', 'with', 'by',
    // Common Korean fillers & Conjunctions
    '이런', '그런', '저런', '있는', '없는', '대한', '위해', '통해', '사실', '정말', '진짜', '너무',
    '많이', '그냥', '이제', '바로', '가장', '모든', '어떤', '어떻게', '왜냐하면', '때문에', '그리고',
    '하지만', '그래서', '그런데', '이번', '저희', '제가', '우리', '여러분',
    // Formal endings (useless as keywords)
    '습니다', '합니다', '입니다', '있습니다', '없습니다', '됩니다', '같습니다', '생기는', '하는'
]);

// --- NLP Utilities ---

// 1. Korean Josa (Postposition) Connector
// Usage: josa("사람", "을/를") -> "사람을", josa("치약", "을/를") -> "치약을"
function josa(word, type) {
    if (!word) return "";
    const lastChar = word.charCodeAt(word.length - 1);
    // Hangul distinct range check
    const hasJongseong = (lastChar - 0xAC00) % 28 > 0;

    // type example: "은/는", "이/가", "을/를", "와/과", "으로/로"
    const pair = type.split('/');

    if (type === "으로/로") {
        // 'ㄹ' exception for (으)로
        const isRieul = (lastChar - 0xAC00) % 28 === 8;
        return word + (hasJongseong && !isRieul ? pair[0] : pair[1]);
    }

    return word + (hasJongseong ? pair[0] : pair[1]);
}

// 2. Strict Noun Extractor (Heuristic)
// Removes common verb/adjective suffixes to get the "Core Noun"
function distillNoun(word) {
    // Remove (으)로, (이)나, (에)서, 등등... simplified for main keywords
    let noun = word.replace(/(은|는|이|가|을|를|의|와|과|로|으로|도|에|에서|에게|하고|하며)$/, '');

    // Remove "생기는", "하는" etc if attached
    noun = noun.replace(/(하는|되는|있는|없는|생기는|부르는)$/, '');

    return noun;
}

// --- Analysis Engine ---

export function analyzeContent(text) {
    // Enhanced cleaning
    const cleanText = text
        .replace(/\d{2}:\d{2}:\d{2},\d{3}\s-->\s\d{2}:\d{2}:\d{2},\d{3}/g, ' ')
        .replace(/\r\n/g, '\n')
        .replace(/^\d+$/gm, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/[^\w\s가-힣]/g, ' ')
        .replace(/\s+/g, ' ');

    // 1. Keyword Extraction
    const words = cleanText.split(' ').filter(w => w.length > 1);
    const frequency = {};

    words.forEach(rawWord => {
        const word = distillNoun(rawWord);
        if (!STOP_WORDS.has(word) && !STOP_WORDS.has(rawWord) && isNaN(word) && word.length > 1) {
            frequency[word] = (frequency[word] || 0) + 1;
        }
    });

    const sortedKeywords = Object.entries(frequency)
        .sort(([, a], [, b]) => b - a)
        .map(([word]) => word);

    const mainKeyword = sortedKeywords[0] || "이것";

    // 2. Heuristic extraction for specific roles (Risk, Benefit, Target)
    // This is basic heuristic; in real app, user input is king.

    return {
        keywords: sortedKeywords.slice(0, 10), // Keep top 10 for fallback
        mainKeyword: mainKeyword,
        target: "시청자", // Default, will be overwritten by form
        benefit: "인생 꿀팁",
        risk: "", // If empty, filtered later
        number: "3가지",
        authority: "전문가"
    };
}

// --- Title Generator with Logic Pipeline ---

export function generateTitle(template, analysis) {
    // Unpack analysis (User inputs override these usually)
    const topic = analysis.keywords[0] || "비법"; // Main Keyword
    const target = analysis.target || "사람";
    const benefit = analysis.benefit || "이득";
    const authority = analysis.authority || "전문가";
    const number = (analysis.number || "3가지").replace(/[^0-9]/g, '') || "3";
    const risk = analysis.risk || ""; // Often optional
    const comparison = analysis.keywords[1] || ""; // Secondary keyword as comparison if needed

    let title = template.text;

    // STEP 1: Filter Check
    // If template needs {risk} but we have no risk, REJECT this template (Return null)
    // Ideally caller handles null. For now, we fallback or try to be smart.
    // BUT the request said: "If no VS B content, do not use that template."
    if (title.includes("{risk}") && !risk) return null;
    if (title.includes("{comparison}") && !comparison) return null;

    // STEP 2: Slot Filling
    // We use intermediate placeholders to handle Josa later
    // Format: [WORD|JOSA] e.g. [Topic|은/는]

    // Standard replacements (Simple)
    title = title.replace(/\{number\}/g, number);
    title = title.replace(/\{benefit\}/g, benefit);
    title = title.replace(/\{target\}/g, target);
    title = title.replace(/\{authority\}/g, authority);

    // Complex replacements with Josa markers (We need to manually update templates to support this, 
    // OR we heuristic it. For now, let's assume templates have standard markers like {topic} 
    // and we check the char after it.)

    // Strategy: Replace {topic} with the word, then look at next char.
    // IF next char is a particle start (은,는,이,가...), we assume we need to fix it.
    // BUT easier strategy requested: "Auto-correct Josa".

    // Let's doing replace and then post-process Josa.
    title = title.replace(/\{topic\}/g, topic);
    title = title.replace(/\{risk\}/g, risk);
    title = title.replace(/\{comparison\}/g, comparison);
    title = title.replace(/\{content\}/g, topic); // Fallback

    // Fallback for legacy "~~"
    title = title.replace(/~~/g, topic);

    // STEP 3: NLP Polish

    // 3-1. Josa Correction
    // Regex to find "Word" followed by "Particle".
    // Note: It's hard to split perfectly without tokenization. 
    // A simple approach: defined patterns like "다크서클은" -> fix to "다크서클은" (correct) or "다크서클는" (incorrect) -> fix.
    // We will iterate common particles and fix the preceding word.

    const particles = [
        "은/는", "이/가", "을/를", "와/과", "으로/로"
    ];

    particles.forEach(pt => {
        const [p1, p2] = pt.split('/');
        // Regex: noun followed by p1 or p2
        // e.g. (Word)(은|는)
        const regex = new RegExp(`([가-힣A-Za-z0-9]+)(${p1}|${p2})`, 'g');

        title = title.replace(regex, (match, word, suffix) => {
            // Re-calculate correct josa
            // Check if 'word' ends with Josa itself? No, we assume 'word' is the noun.
            return josa(word, pt);
        });
    });

    // 3-2. Sentence Shortening (Verb ending truncation)
    title = title.replace(/하는 방법입니다/g, "하는 법");
    title = title.replace(/할 수 있는 방법/g, "하는 법");
    title = title.replace(/하게 되는 이유/g, "하는 이유");
    title = title.replace(/하지 않으면/g, "안하면");
    title = title.replace(/하기 전에/g, "하기 전");

    // Check for unresolved placeholders (Strict Mode)
    if (title.includes("{") && title.includes("}")) return null; // Reject if any placeholder remains

    return title;
}
