import React, { useState, useRef } from 'react';
import {
  Copy, Star, Zap, Users, Briefcase, Laugh,
  ArrowRight, Sparkles, Upload, X,
  Image as ImageIcon, Wand2, Download, Share2
} from 'lucide-react';

interface CaptionData { id: string; text: string; rating: number; saved: boolean; }

const platforms = [
  { value: 'instagram', label: 'Instagram', color: 'from-purple-700 to-pink-700', icon: '📸', maxLength: 2200 },
  { value: 'twitter', label: 'Twitter', color: 'from-blue-600 to-blue-800', icon: '🐦', maxLength: 280 },
  { value: 'linkedin', label: 'LinkedIn', color: 'from-blue-800 to-indigo-800', icon: '💼', maxLength: 3000 },
  { value: 'facebook', label: 'Facebook', color: 'from-blue-700 to-blue-900', icon: '👥', maxLength: 63206 },
  { value: 'tiktok', label: 'TikTok', color: 'from-gray-900 to-black', icon: '🎵', maxLength: 300 }
];

const tones = [
  { value: 'professional', label: 'Professional', icon: Briefcase, color: 'text-blue-300' },
  { value: 'funny', label: 'Funny', icon: Laugh, color: 'text-yellow-300' },
  { value: 'motivational', label: 'Motivational', icon: Zap, color: 'text-orange-300' },
  { value: 'romantic', label: 'Romantic', icon: Star, color: 'text-red-300' },
  { value: 'casual', label: 'Casual', icon: Users, color: 'text-green-300' }
];

const moods = [
  { value: 'excited', label: 'Excited', emoji: '🎉' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏' },
  { value: 'adventurous', label: 'Adventurous', emoji: '🌟' },
  { value: 'peaceful', label: 'Peaceful', emoji: '🧘' },
  { value: 'confident', label: 'Confident', emoji: '💪' },
  { value: 'nostalgic', label: 'Nostalgic', emoji: '💭' }
];

function App() {
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('casual');
  const [mood, setMood] = useState('excited');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<CaptionData[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => setUploadedImage(null);

  const generateCaptions = async () => {
    if (!description.trim() && !uploadedImage) return;
    setIsGenerating(true);
    await new Promise(res => setTimeout(res, 2500));
    const sample = generateMockCaptions(description, platform, tone, mood, includeHashtags, includeEmojis, includeCTA);
    setGeneratedCaptions(sample.map((text, idx) => ({
      id: `cap-${Date.now()}-${idx}`, text, rating: 0, saved: false
    })));
    setIsGenerating(false);
  };

  const generateMockCaptions = (desc: string, plat: string, tn: string, md: string, hashtags: boolean, emojis: boolean, cta: boolean) => {
    const base = desc.trim() || "Sharing this amazing moment";
    const moodObj = moods.find(m => m.value === md);
    const emojiMap: Record<string,string> = {
      professional: '💼✨📈', funny: '😂🤣😄', motivational: '💪🔥⚡', romantic: '💕❤️🌹', casual: '😊🌟👋'
    };
    const hashtagMap: Record<string,string> = {
      instagram: '#photooftheday #instagood #love #beautiful #happy #lifestyle #memories',
      twitter: '#TwitterUpdate #SocialMedia #Content #Trending',
      linkedin: '#Professional #Career #Business #Growth #Success #Leadership',
      facebook: '#Friends #Family #Memories #Life #Grateful #Community',
      tiktok: '#viral #fyp #trending #content #creative #fun'
    };
    const ctaMap: Record<string,string> = {
      instagram: 'Double tap if you agree! 💖',
      twitter: 'What do you think? Let me know! 👇',
      linkedin: 'What are your thoughts on this? Share in the comments.',
      facebook: 'Tag someone who needs to see this! 👇',
      tiktok: 'Follow for more content like this! ✨'
    };
    const emo = emojis ? emojiMap[tn] : '';
    const tags = hashtags ? hashtagMap[plat] : '';
    const call = cta ? ctaMap[plat] : '';
    const moodEmoji = moodObj?.emoji ?? '';
    const caps = [
      `${base} ${moodEmoji} ${emo}\n\n${call}\n\n${tags}`.trim(),
      `Feeling ${moodObj?.label.toLowerCase()} about this: ${base.toLowerCase()} ${moodEmoji} ${emo}\n\n${call}\n\n${tags}`.trim(),
      `${base}... and I'm absolutely loving every second of it! ${moodEmoji} ${emo}\n\n${call}\n\n${tags}`.trim(),
      `When life gives you moments like this: ${base.toLowerCase()} ${moodEmoji} ${emo}\n\n${call}\n\n${tags}`.trim()
    ];
    return caps.slice(0,4);
  };

  const copyToClipboard = async (cap: CaptionData) => {
    try { await navigator.clipboard.writeText(cap.text); setCopiedId(cap.id); setTimeout(() => setCopiedId(null),2000); }
    catch {}
  };

  const rateCaption = (id: string, rating: number) =>
    setGeneratedCaptions(prev => prev.map(c => c.id === id ? { ...c, rating } : c));

  const toggleSaved = (id: string) =>
    setGeneratedCaptions(prev => prev.map(c => c.id === id ? { ...c, saved: !c.saved } : c));

  const selectedPlatform = platforms.find(p => p.value === platform);
  const selectedTone = tones.find(t => t.value === tone);

  return (
    <div className="dark min-h-screen bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-2xl blur-xl opacity-75 animate-pulse" />
              <div className="relative p-4 bg-gradient-to-r from-purple-700 to-pink-700 rounded-2xl">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Unnati's AI Caption Generator
            </h1>
          </div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
          Hello Everyone, I am here to transform your content with AI-powered captions across all platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-700">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-200 mb-4">
              <Sparkles className="w-5 h-5 text-pink-400" /> Quick Stats
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Platform</span><span className="font-semibold">{selectedPlatform?.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Tone</span><span className="font-semibold">{selectedTone?.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Generated</span><span className="font-semibold text-pink-400">{generatedCaptions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Saved</span><span className="font-semibold text-green-400">{generatedCaptions.filter(c => c.saved).length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl shadow-xl p-6 border border-gray-700">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-200 mb-4">
              <Zap className="w-5 h-5 text-orange-400" /> Pro Tips
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2"><div className="w-2 h-2 bg-pink-500 rounded-full mt-2" /><p>Upload an image for more context</p></div>
              <div className="flex items-start gap-2"><div className="w-2 h-2 bg-pink-500 rounded-full mt-2" /><p>Be specific in your description</p></div>
              <div className="flex items-start gap-2"><div className="w-2 h-2 bg-pink-500 rounded-full mt-2" /><p>Know platform character limits</p></div>
              <div className="flex items-start gap-2"><div className="w-2 h-2 bg-pink-500 rounded-full mt-2" /><p>Use CTAs to boost engagement</p></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-700 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gray-300" /> Upload Image (Optional)
                </label>
                {uploadedImage ? (
                  <div className="relative group">
                    <img src={uploadedImage} alt="Uploaded" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
                    <div className="absolute inset-0 bg-gray-900/70 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={removeImage} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer ${
                    dragActive ? 'border-pink-600 bg-pink-900/30' : 'border-gray-700 hover:border-pink-500 bg-gray-800 hover:bg-gray-700'
                  }`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium mb-2">Drag & drop an image, click to upload</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, GIF up to 10MB</p>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-4">Describe your content</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Sunset at the beach with friends..." rows={4}
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-2xl text-gray-200 placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500/30 transition resize-none" />
                {selectedPlatform && <div className="mt-2 text-xs text-gray-500">Max {selectedPlatform.maxLength} chars for {selectedPlatform.label}</div>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-4">Choose Platform</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {platforms.map(p => (
                    <button key={p.value} onClick={() => setPlatform(p.value)}
                      className={`p-4 rounded-2xl transition duration-300 transform ${platform === p.value ?
                        `bg-gradient-to-r ${p.color} text-white shadow-xl scale-105` :
                        'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:shadow-sm'}`}>
                      <div className="text-2xl mb-2">{p.icon}</div>
                      <div className="text-sm font-medium">{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-4">Select Tone</label>
                  <div className="space-y-2">
                    {tones.map(t => {
                      const Icon = t.icon;
                      return (
                        <button key={t.value} onClick={() => setTone(t.value)}
                          className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition duration-200 ${
                            tone === t.value ? 'border-pink-500 bg-gradient-to-r from-gray-700 to-gray-800 shadow-md text-gray-200' :
                            'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:shadow-sm'}`}>
                          <Icon className={`${t.color} w-5 h-5`} />
                          <span className="text-sm font-medium">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-4">Choose Mood</label>
                  <div className="space-y-2">
                    {moods.map(m => (
                      <button key={m.value} onClick={() => setMood(m.value)}
                        className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition duration-200 ${
                          mood === m.value ? 'border-pink-500 bg-gray-700 text-gray-200 shadow-md' :
                          'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:shadow-sm'}`}>
                        <span className="text-lg">{m.emoji}</span>
                        <span className="text-sm font-medium">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/80 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Advanced Options</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={includeHashtags} onChange={e => setIncludeHashtags(e.target.checked)}
                      className="w-5 h-5 text-pink-500 border-2 border-gray-600 rounded focus:ring-pink-500" />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-pink-500 transition-colors">Include Hashtags</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={includeEmojis} onChange={e => setIncludeEmojis(e.target.checked)}
                      className="w-5 h-5 text-pink-500 border-2 border-gray-600 rounded focus:ring-pink-500" />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-pink-500 transition-colors">Include Emojis</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={includeCTA} onChange={e => setIncludeCTA(e.target.checked)}
                      className="w-5 h-5 text-pink-500 border-2 border-gray-600 rounded focus:ring-pink-500" />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-pink-500 transition-colors">Call‑to‑Action</span>
                  </label>
                </div>
              </div>

              <button onClick={generateCaptions}
                disabled={(!description.trim() && !uploadedImage) || isGenerating}
                className={`w-full py-5 px-6 rounded-2xl font-semibold text-white transition duration-300 transform ${
                  (!description.trim() && !uploadedImage) || isGenerating ?
                    'bg-gray-600 cursor-not-allowed' :
                    `bg-gradient-to-r ${selectedPlatform?.color} hover:shadow-xl hover:scale-105 active:scale-95`}`}>
                {isGenerating ?
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    AI is crafting your captions...
                  </div> :
                  <div className="flex items-center justify-center gap-3">
                    <Wand2 className="w-5 h-5" />
                    Generate AI Captions
                    <ArrowRight className="w-5 h-5" />
                  </div>
                }
              </button>
            </div>
          </div>
        </div>

        {generatedCaptions.length > 0 && (
          <div className="mt-12 bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-200 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-pink-400" /> AI Generated Captions
              </h2>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl">
                  <Download className="w-5 h-5 text-gray-300" />
                </button>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl">
                  <Share2 className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {generatedCaptions.map((cap, idx) => (
                <div key={cap.id} className="group p-6 border border-gray-700 rounded-2xl hover:border-pink-500 bg-gray-800"
                     style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-gray-700 text-pink-400 text-xs font-semibold rounded-full">
                          Caption {idx + 1}
                        </span>
                        <span className="text-xs text-gray-500">{cap.text.length} chars</span>
                      </div>
                      <p className="text-gray-200 leading-relaxed whitespace-pre-line">{cap.text}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleSaved(cap.id)}
                        className={`p-3 rounded-xl ${cap.saved ? 'bg-yellow-800 text-yellow-300' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                        <Star className={`w-5 h-5 ${cap.saved ? 'fill-current' : ''}`} />
                      </button>
                      <button onClick={() => copyToClipboard(cap)}
                        className={`p-3 rounded-xl ${copiedId === cap.id ? 'bg-green-800 text-green-300' : 'bg-purple-800 text-purple-300 hover:bg-purple-700'}`}>
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Rate this:</span>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => rateCaption(cap.id, n)}
                          className={`w-6 h-6 transition hover:scale-110 ${n <= cap.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`}>
                          <Star className="w-full h-full"/>
                        </button>
                      ))}
                    </div>
                    {copiedId === cap.id && (
                      <div className="text-green-300 text-sm font-medium animate-pulse flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-300 rounded-full"/>Copied!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
