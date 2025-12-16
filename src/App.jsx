import React, { useState, useEffect } from 'react';
import { UploadSection } from './components/UploadSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { SettingsModal } from './components/SettingsModal';
import { GuideModal } from './components/GuideModal';
import { Settings, HelpCircle } from 'lucide-react';
import { analyzeContent } from './lib/analyzer';
import { generateTitlesWithGemini } from './lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null); // This will now hold Gemini JSON or Legacy Analysis
    const [generatedTitles, setGeneratedTitles] = useState(null);
    const [isGeminiMode, setIsGeminiMode] = useState(false);

    const [apiKey, setApiKey] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('GEMINI_API_KEY');
        if (stored) {
            setApiKey(stored);
            setIsGeminiMode(true);
        }
    }, []);

    const handleAnalyze = async (formData) => {
        if (!apiKey) {
            setIsSettingsOpen(true);
            return;
        }

        setLoading(true);

        try {
            // --- GEMINI MODE ---
            // 1. Prepare Content
            const scriptContent = formData.script || "";

            // 2. Call API
            const geminiResult = await generateTitlesWithGemini(apiKey, scriptContent, formData);

            // 3. Map Gemini Result to App State Structure
            // Gemini returns { titles: { urgency: [..], ... }, thumbnails: [...] }
            // We need to shape it so AnalysisDashboard can read it.
            // AnalysisDashboard expects `analysis` (summary) and `generatedTitles`.

            setGeneratedTitles({
                '긴박형/불안형': geminiResult.titles.urgency,
                '실험형/경험형': geminiResult.titles.experiment,
                '비교형/분석형': geminiResult.titles.comparison,
                '어그로형/비법형': geminiResult.titles.aggro
            });

            // For 'analysis' summary prop:
            // We can heuristic extract or just use user inputs as display
            const keywords = formData.topic ? formData.topic.split(',') : (geminiResult.keywords || ["AI 분석"]);

            setAnalysis({
                keywords: keywords,
                target: formData.target || "시청자",
                authority: formData.authority || "AI",
                benefit: formData.benefit || "솔루션",
                thumbnails: geminiResult.thumbnails // Pass thumbnail texts here
            });

            setIsGeminiMode(true);

        } catch (error) {
            console.error(error);
            alert("Gemini 분석 중 오류가 발생했습니다: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper for Auto-fill in UploadSection (Local Heuristic - Free/Fast)
    const autoFillFromScript = (text) => {
        return analyzeContent(text);
    };

    const handleReset = () => {
        setAnalysis(null);
        setGeneratedTitles(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-gray-100 selection:bg-red-500/30 font-sans">
            {/* Background Gradient Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px]" />
            </div>

            {/* Header Settings Button (Fixed) */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setIsGuideOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm backdrop-blur-md shadow-lg"
                >
                    <HelpCircle className="w-4 h-4" />
                    <span>사용법</span>
                </button>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm backdrop-blur-md shadow-lg"
                >
                    <Settings className="w-4 h-4" />
                    {apiKey ? <span className="text-green-500 font-bold">Gemini On</span> : <span>API 설정</span>}
                </button>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">

                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={(key) => { setApiKey(key); setIsGeminiMode(!!key); }}
                />

                <GuideModal
                    isOpen={isGuideOpen}
                    onClose={() => setIsGuideOpen(false)}
                />

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-3 px-4 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-red-400 tracking-wider uppercase">
                        유튜브 알고리즘 최적화
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        <span className="bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Viral Title</span>
                        <span className="text-red-600">.Gen</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        영상 스크립트를 업로드하세요. 알고리즘이 후킹 포인트를 분석하여 <br /><span className="text-white font-semibold">클릭을 부르는 제목</span>을 5초 만에 완성해드립니다.
                    </p>
                </motion.header>

                {/* Content Switcher */}
                <AnimatePresence mode="wait">
                    {!analysis && !loading && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl"
                        >
                            <UploadSection onAnalyze={handleAnalyze} onFileSelect={autoFillFromScript} />

                            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                {['높은 클릭률', '심리학 기반', '알고리즘 친화적', '시간 절약'].map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/50 text-slate-500 text-sm font-medium">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="w-16 h-16 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin mb-8"></div>
                            <h3 className="text-2xl font-bold text-white mb-2">스크립트 분석 중...</h3>
                            <p className="text-slate-500">핵심 키워드와 후킹 포인트를 추출하고 있습니다</p>
                        </motion.div>
                    )}

                    {analysis && !loading && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            <AnalysisDashboard
                                analysis={analysis}
                                generatedTitles={generatedTitles}
                                onReset={() => {
                                    setAnalysis(null);
                                    setGeneratedTitles(null);
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

export default App;
