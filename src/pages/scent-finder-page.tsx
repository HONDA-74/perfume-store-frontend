/**
 * Scent Finder Page
 * AI-powered fragrance recommendation experience.
 * 
 * Flow: Landing → Questionnaire (5 steps) → Free text input → AI results
 * Uses real backend AI endpoint (POST /api/v1/ai/chat) with authenticated requests.
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ArrowLeft, RefreshCw, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useSendChatMessage } from '@/hooks/api/use-ai';
import { useProducts } from '@/hooks/api/use-products';
import { ProductCard } from '@/components/shared/product-card';
import { PageLoader } from '@/components/shared/page-loader';
import { ROUTES } from '@/constants/routes.constants';
import type { AIProductRecommendation } from '@/types/ai.types';
import type { Product } from '@/types/product.types';

/* ── Quiz definition ── */

interface Question {
  id: 'mood' | 'fragranceFamily' | 'occasion' | 'intensity' | 'character';
  step: number;
  prompt: string;
  options: { label: string; value: string; tags: string[] }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'mood',
    step: 1,
    prompt: 'What mood are you looking for?',
    options: [
      { label: 'Fresh', value: 'Fresh', tags: ['Citrus Floral', 'Earthy Woody', 'Woody Aromatic'] },
      { label: 'Warm', value: 'Warm', tags: ['Amber Oriental', 'Tobacco Oriental'] },
      { label: 'Mysterious', value: 'Mysterious', tags: ['Woody Oriental', 'Earthy Chypre', 'Leather'] },
      { label: 'Romantic', value: 'Romantic', tags: ['Floral Musky', 'Floral Oriental', 'Powdery Floral'] },
    ],
  },
  {
    id: 'fragranceFamily',
    step: 2,
    prompt: 'Which fragrance family attracts you?',
    options: [
      { label: 'Floral', value: 'Floral', tags: ['Floral Musky', 'Powdery Floral', 'Floral Oriental', 'Citrus Floral'] },
      { label: 'Woody', value: 'Woody', tags: ['Woody Oriental', 'Earthy Woody', 'Woody Aromatic'] },
      { label: 'Oriental', value: 'Oriental', tags: ['Amber Oriental', 'Tobacco Oriental', 'Woody Oriental', 'Floral Oriental'] },
      { label: 'Fresh', value: 'Fresh', tags: ['Citrus Floral', 'Woody Aromatic'] },
      { label: 'Gourmand', value: 'Gourmand', tags: ['Amber Oriental', 'Musky'] },
    ],
  },
  {
    id: 'occasion',
    step: 3,
    prompt: 'When will you wear it?',
    options: [
      { label: 'Day', value: 'Day', tags: ['Citrus Floral', 'Woody Aromatic', 'Floral Musky', 'Musky'] },
      { label: 'Evening', value: 'Evening', tags: ['Tobacco Oriental', 'Woody Oriental', 'Floral Oriental', 'Leather'] },
      { label: 'Occasion', value: 'Occasion', tags: ['Woody Oriental', 'Floral Oriental', 'Earthy Chypre', 'Leather'] },
      { label: 'Everyday', value: 'Everyday', tags: ['Floral Musky', 'Amber Oriental', 'Musky', 'Citrus Floral'] },
    ],
  },
  {
    id: 'intensity',
    step: 4,
    prompt: 'What intensity do you prefer?',
    options: [
      { label: 'Light', value: 'Light', tags: ['Eau de Toilette'] },
      { label: 'Moderate', value: 'Moderate', tags: ['Eau de Parfum'] },
      { label: 'Intense', value: 'Intense', tags: ['Extrait de Parfum', 'Parfum'] },
    ],
  },
  {
    id: 'character',
    step: 5,
    prompt: 'Choose your preferred character:',
    options: [
      { label: 'Elegant', value: 'Elegant', tags: ['Powdery Floral', 'Floral Musky', 'Leather', 'Musky'] },
      { label: 'Bold', value: 'Bold', tags: ['Tobacco Oriental', 'Woody Oriental', 'Earthy Chypre', 'Leather'] },
      { label: 'Sensual', value: 'Sensual', tags: ['Amber Oriental', 'Floral Oriental', 'Tobacco Oriental', 'Musky'] },
      { label: 'Minimal', value: 'Minimal', tags: ['Citrus Floral', 'Woody Aromatic', 'Earthy Woody', 'Floral Musky'] },
    ],
  },
];

const FREE_TEXT_STEP = QUESTIONS.length;
const TOTAL_STEPS = QUESTIONS.length + 1;

/* ── State ── */

interface QuizState {
  answers: Partial<Record<Question['id'], string>>;
  answerTags: Record<string, string[]>;
  userDescription: string;
}

interface ResultState {
  conversationId: string;
  aiMessage: string;
  recommendations: AIProductRecommendation[];
}

/* ── Option button ── */

function OptionBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative px-7 py-5 border text-left transition-all duration-200"
      style={{
        backgroundColor: selected ? 'hsla(43,82%,52%,0.08)' : '#121115',
        borderColor: selected ? 'hsl(43 82% 52%)' : 'rgba(255,255,255,0.07)',
        minWidth: '140px',
      }}
    >
      {selected && (
        <span
          className="absolute top-2.5 right-3"
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(43 82% 52%)', display: 'inline-block' }}
        />
      )}
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', fontWeight: 400, color: selected ? 'rgba(243,242,245,0.9)' : 'rgba(243,242,245,0.5)', display: 'block' }}>
        {label}
      </span>
    </button>
  );
}

/* ── Result card ── */

function ResultCard({ rec, rank, product }: { rec: AIProductRecommendation; rank: number; product?: Product }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span
          style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(43 82% 52%)', background: 'hsla(43,82%,52%,0.08)', padding: '3px 7px', borderRadius: '2px' }}
        >
          #{rank} Match
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 300, color: 'rgba(243,242,245,0.28)' }}>
          {rec.reason}
        </span>
      </div>
      {product && <ProductCard product={product} />}
    </div>
  );
}

/* ── Main ── */

export function ScentFinderPage() {
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState<QuizState>({ answers: {}, answerTags: {}, userDescription: '' });
  const [result, setResult] = useState<ResultState | null>(null);
  
  const sendChatMutation = useSendChatMessage();
  
  // Fetch products for recommendations
  const productsQuery = useProducts({ limit: 100 });

  const question = QUESTIONS[step] ?? null;
  const isFreeTextStep = step === FREE_TEXT_STEP;
  const isResult = step === TOTAL_STEPS;

  const currentAnswer = question ? quiz.answers[question.id] : undefined;

  const selectOption = useCallback((q: Question, opt: Question['options'][number]) => {
    setQuiz(prev => ({
      ...prev,
      answers: { ...prev.answers, [q.id]: opt.value },
      answerTags: { ...prev.answerTags, [q.id]: opt.tags },
    }));
  }, []);

  const buildPromptMessage = useCallback((): string => {
    const parts: string[] = [];
    
    parts.push('I am looking for a fragrance with the following preferences:');
    
    if (quiz.answers.mood) {
      parts.push(`Mood: ${quiz.answers.mood}`);
    }
    if (quiz.answers.fragranceFamily) {
      parts.push(`Fragrance Family: ${quiz.answers.fragranceFamily}`);
    }
    if (quiz.answers.occasion) {
      parts.push(`Occasion: ${quiz.answers.occasion}`);
    }
    if (quiz.answers.intensity) {
      parts.push(`Intensity: ${quiz.answers.intensity}`);
    }
    if (quiz.answers.character) {
      parts.push(`Character: ${quiz.answers.character}`);
    }
    
    const allTags = Object.values(quiz.answerTags).flat();
    if (allTags.length > 0) {
      parts.push(`Tags I'm interested in: ${[...new Set(allTags)].join(', ')}`);
    }
    
    if (quiz.userDescription.trim()) {
      parts.push(`\nAdditional details: ${quiz.userDescription.trim()}`);
    }
    
    parts.push('\nPlease recommend 3 fragrances from your catalog that match these preferences.');
    
    return parts.join('\n');
  }, [quiz]);

  const handleNext = useCallback(() => {
    if (step < FREE_TEXT_STEP) {
      setStep(s => s + 1);
    } else if (isFreeTextStep) {
      const message = buildPromptMessage();
      
      sendChatMutation.mutate(
        { message },
        {
          onSuccess: (data) => {
            setResult({
              conversationId: data.conversationId,
              aiMessage: data.message,
              recommendations: data.recommendations,
            });
            setStep(TOTAL_STEPS);
          },
        }
      );
    }
  }, [step, isFreeTextStep, buildPromptMessage, sendChatMutation]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  const handleRestart = useCallback(() => {
    setStep(0);
    setQuiz({ answers: {}, answerTags: {}, userDescription: '' });
    setResult(null);
    sendChatMutation.reset();
  }, [sendChatMutation]);

  const canProceed = isFreeTextStep ? true : (currentAnswer !== undefined);

  // Map recommendation product IDs to actual products
  const recommendedProducts = result?.recommendations.map(rec => {
    return productsQuery.data?.items.find(p => p.id === rec.productId);
  }).filter(Boolean) ?? [];

  return (
    <div style={{ backgroundColor: '#0B0A0C', minHeight: '100vh' }}>
      {/* Page header */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 pb-6">
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(212,195,163,0.4)', marginBottom: '6px' }}>
          Discovery
        </p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: 'rgba(243,242,245,0.85)' }}>
          Scent Finder
        </h1>
      </div>

      {/* Quiz */}
      {!isResult ? (
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-20">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 400, color: 'hsl(43 82% 52%)', lineHeight: 1, minWidth: '3.5ch' }}>
                {String(step + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 300, color: 'rgba(243,242,245,0.25)' }}>
                / {String(TOTAL_STEPS).padStart(2, '0')}
              </span>
            </div>
            <div className="flex gap-1" style={{ maxWidth: '320px' }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-px transition-all duration-400"
                  style={{ background: i <= step ? 'hsl(43 82% 52%)' : 'rgba(255,255,255,0.08)' }}
                />
              ))}
            </div>
          </div>

          <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }`}</style>

          <div key={step} style={{ animation: 'fadeUp 0.35s ease both' }}>
            {/* Standard question */}
            {question && !isFreeTextStep && (
              <>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: 'rgba(243,242,245,0.78)', marginBottom: '36px', maxWidth: '480px', lineHeight: 1.25 }}>
                  {question.prompt}
                </h2>
                <div className="flex flex-wrap gap-3 mb-14">
                  {question.options.map(opt => (
                    <OptionBtn
                      key={opt.value}
                      label={opt.label}
                      selected={currentAnswer === opt.value}
                      onClick={() => selectOption(question, opt)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Free-text step */}
            {isFreeTextStep && (
              <div className="max-w-xl">
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(212,195,163,0.4)', marginBottom: '10px' }}>
                  Optional
                </p>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: 'rgba(243,242,245,0.78)', marginBottom: '8px', lineHeight: 1.25 }}>
                  Tell us what you're looking for
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 300, color: 'rgba(243,242,245,0.3)', marginBottom: '20px', fontStyle: 'italic' }}>
                  Describe the mood, occasion, or feeling you want your fragrance to evoke.
                </p>
                <textarea
                  rows={5}
                  value={quiz.userDescription}
                  onChange={e => setQuiz(prev => ({ ...prev, userDescription: e.target.value }))}
                  placeholder="Something dark, elegant and mysterious for an evening occasion..."
                  style={{
                    display: 'block',
                    width: '100%',
                    background: '#121115',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(243,242,245,0.75)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: 300,
                    padding: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: 1.7,
                    marginBottom: '28px',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(212,195,163,0.4)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />

                {/* Error display */}
                {sendChatMutation.isError && (
                  <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5 flex items-start gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-red-300 text-sm mb-1 font-medium">AI recommendation failed</p>
                      <p className="text-red-400/70 text-xs">
                        {sendChatMutation.error instanceof Error ? sendChatMutation.error.message : 'An error occurred while getting recommendations.'}
                      </p>
                      <p className="text-red-400/50 text-xs mt-2">Please try again or adjust your preferences.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-4">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  disabled={sendChatMutation.isPending}
                  className="flex items-center gap-2 h-11 px-5 border border-white/8 hover:border-white/18 text-white/30 hover:text-white/60 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  <ArrowLeft size={12} /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed || sendChatMutation.isPending}
                className="flex items-center gap-2 h-11 px-8 transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: (canProceed && !sendChatMutation.isPending) ? 'hsl(43 82% 52%)' : 'rgba(255,255,255,0.06)',
                  color: (canProceed && !sendChatMutation.isPending) ? '#0B0A0C' : 'rgba(255,255,255,0.2)',
                  cursor: (canProceed && !sendChatMutation.isPending) ? 'pointer' : 'not-allowed',
                }}
              >
                {sendChatMutation.isPending ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Finding Your Scent...
                  </>
                ) : isFreeTextStep ? (
                  <>
                    <Sparkles size={12} /> Find My Scent
                  </>
                ) : (
                  <>
                    Continue <ArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results */
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-20">
          <div className="mb-10" style={{ animation: 'fadeUp 0.4s ease both' }}>
            <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(212,195,163,0.45)', marginBottom: '10px' }}>
              Curated from your answers
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'rgba(243,242,245,0.88)', marginBottom: '10px' }}>
              Your Signature Awaits
            </h2>
            {result?.aiMessage && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 300, color: 'rgba(243,242,245,0.32)', fontStyle: 'italic', maxWidth: '600px', marginBottom: '4px' }}>
                {result.aiMessage}
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 300, color: 'rgba(243,242,245,0.22)', maxWidth: '500px' }}>
              {quiz.userDescription && 'Your personal description guided the selection.'}
            </p>
          </div>

          {productsQuery.isLoading && <PageLoader />}

          {result && result.recommendations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {result.recommendations.map((rec, i) => {
                const product = recommendedProducts[i];
                return (
                  <ResultCard key={rec.productId} rec={rec} rank={i + 1} product={product} />
                );
              })}
            </div>
          )}

          {result && result.recommendations.length === 0 && (
            <div className="mb-12 p-8 border border-white/5 bg-white/[0.02] text-center">
              <AlertCircle className="mx-auto mb-3 text-white/20" size={32} />
              <p className="text-white/40 text-sm">
                No recommendations were returned. Please try again with different preferences.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={ROUTES.shop}
              className="inline-flex items-center justify-center gap-2 h-11 px-8 hover:opacity-85 transition-all duration-200"
              style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'hsl(43 82% 52%)', color: '#0B0A0C' }}
            >
              Explore the Collection <ArrowRight size={12} />
            </Link>
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 border border-white/10 hover:border-white/20 text-white/35 hover:text-white/65 transition-all duration-200"
              style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              <RefreshCw size={12} /> Start Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
