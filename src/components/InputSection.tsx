import { useState } from 'react';
import { ArrowRight, Loader2, Sparkles, Pencil, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useFlashcardStore } from '../store/useFlashcardStore';

export const InputSection = () => {
  const { text, setText, generateFlashcards, setManualCards, step } = useFlashcardStore();
  const isProcessing = step === 'processing';
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [error, setError] = useState<string | null>(null);
  
  const [manualCards, setManualCardsLocal] = useState([{ front: '', back: '' }, { front: '', back: '' }]);

  const handleAddCard = () => {
    setManualCardsLocal(prev => [...prev, { front: '', back: '' }]);
  };

  const handleRemoveCard = (index: number) => {
    if (manualCards.length <= 1) return;
    setManualCardsLocal(prev => prev.filter((_, i) => i !== index));
  };

  const handleManualChange = (index: number, field: 'front'|'back', value: string) => {
    setError(null); // Tắt lỗi khi user bắt đầu gõ lại
    setManualCardsLocal(prev => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const submitManual = () => {
    const isValid = manualCards.every(c => c.front.trim() && c.back.trim());
    if (!isValid) {
      setError("Vui lòng điền đủ Mặt trước và Mặt sau cho tất cả các thẻ!");
      return;
    }
    setError(null);
    setManualCards(manualCards);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
        Flashcard Thông Minh
      </h1>
      
      <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 justify-center rounded-xl mb-6 mt-2 relative overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700/50">
         <button 
           onClick={() => {
             setActiveTab('ai');
             setError(null);
           }}
           className={`flex items-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold transition-all ${activeTab === 'ai' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
         >
           <Sparkles className="w-4 h-4" /> AI Tạo Tự Động
         </button>
         <button 
           onClick={() => {
             setActiveTab('manual');
             setError(null);
           }}
           className={`flex items-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold transition-all ${activeTab === 'manual' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
         >
           <Pencil className="w-4 h-4" /> Nhập Thủ Công
         </button>
      </div>

      {activeTab === 'ai' ? (
        <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300">
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            Dán bất kỳ đoạn văn bản, bài báo, hay từ khóa nào. Hệ thống của chúng tôi sẽ tự động trích xuất từ vựng và tạo thẻ học 2 mặt cho bạn.
          </p>

          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập văn bản vào đây..."
              disabled={isProcessing}
              className="relative w-full h-48 md:h-64 p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all disabled:opacity-50 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <button
            onClick={generateFlashcards}
            disabled={isProcessing || !text.trim()}
            className="mt-8 mx-auto flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang trích xuất từ vựng...
              </>
            ) : (
              <>
                Tạo thẻ bằng AI
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
            Nhập chính xác Mặt trước và Mặt sau cho từng thẻ nhớ để cá nhân hóa hoàn toàn bộ từ vựng của bạn.
          </p>

          {error && (
            <div className="mb-6 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/50 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {manualCards.map((card, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 items-center">
                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 font-medium text-xs">
                    {i+1}
                  </div>
                </div>
                <input 
                  type="text" 
                  value={card.front}
                  onChange={(e) => handleManualChange(i, 'front', e.target.value)}
                  placeholder="Mặt trước (Ví dụ: Hello)"
                  className="w-full sm:flex-1 bg-transparent border-b border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 px-2 py-2 outline-none transition-colors dark:text-white"
                />
                <input 
                  type="text" 
                  value={card.back}
                  onChange={(e) => handleManualChange(i, 'back', e.target.value)}
                  placeholder="Mặt sau (Ví dụ: Xin chào)"
                  className="w-full sm:flex-1 bg-transparent border-b border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 px-2 py-2 outline-none transition-colors dark:text-white"
                />
                <button
                  onClick={() => handleRemoveCard(i)}
                  disabled={manualCards.length === 1}
                  className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-30 self-end sm:self-center flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={handleAddCard}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold transition-all w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              Thêm dòng
            </button>
            <button
              onClick={submitManual}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
            >
              Vào học ngay
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
