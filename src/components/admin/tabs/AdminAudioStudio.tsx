import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Square,
  Music,
  Mic,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { DEFAULT_RESTAURANT_DATA } from '../../../data/defaultRestaurantData';
import {
  VOICE_PERSONA_PRESETS,
  getBuiltinTrackWavUrl,
  BuiltinTrackPreset,
  selectBestSpeechVoice,
  normalizeSpeechTextForClarity,
} from '../../../utils/pleasantAudioGenerator';
import { AudioTrackItem } from '../../../types';

interface AdminAudioStudioProps {
  showToast: (msg: string) => void;
}

export const AdminAudioStudio: React.FC<AdminAudioStudioProps> = ({ showToast }) => {
  const { data, updateAudioSettings } = useRestaurant();
  const audioSettings = data.audioSettings || DEFAULT_RESTAURANT_DATA.audioSettings!;

  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');

  const handleTestVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isPreviewPlaying) {
      setIsPreviewPlaying(false);
      return;
    }

    const rawText =
      audioSettings.voiceLanguage === 'hi-IN'
        ? audioSettings.voiceTextHi
        : audioSettings.voiceLanguage === 'gu-IN'
        ? audioSettings.voiceTextGu
        : audioSettings.voiceTextEn;

    const cleanText = normalizeSpeechTextForClarity(
      rawText,
      audioSettings.voiceLanguage,
      audioSettings.enableVoiceClarityEnhancer ?? true
    );

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = audioSettings.voiceLanguage;
    utterance.rate = audioSettings.voiceRate || 0.95;
    utterance.pitch = audioSettings.voicePitch || 1.0;
    utterance.volume = audioSettings.volume || 0.9;

    const voices = window.speechSynthesis.getVoices();
    const bestVoice = selectBestSpeechVoice(
      voices,
      audioSettings.voiceLanguage,
      audioSettings.voiceGender || 'female',
      audioSettings.selectedVoiceURI
    );
    if (bestVoice) utterance.voice = bestVoice;

    utterance.onend = () => setIsPreviewPlaying(false);
    utterance.onerror = () => setIsPreviewPlaying(false);
    setIsPreviewPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const builtinPresets: { id: BuiltinTrackPreset; label: string; desc: string }[] = [
    {
      id: 'warm-bossa-lounge',
      label: 'Warm Bossa Lounge',
      desc: 'Smooth acoustic café lounge chords',
    },
    {
      id: 'upbeat-bistro-groove',
      label: 'Upbeat Bistro Groove',
      desc: 'Lively modern fast-casual dining vibe',
    },
    {
      id: 'evening-acoustic-vibe',
      label: 'Evening Acoustic Vibe',
      desc: 'Relaxing dinner harmonic progression',
    },
    {
      id: 'royal-indian-santoor',
      label: 'Royal Indian Santoor',
      desc: 'Traditional hospitality pluck & warm pad',
    },
  ];

  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackTitle.trim() || !newTrackUrl.trim()) return;
    const newTrack: AudioTrackItem = {
      id: `track-${Date.now()}`,
      title: newTrackTitle.trim(),
      audioUrl: newTrackUrl.trim(),
      category: 'background_music',
      isActive: true,
    };
    updateAudioSettings({
      tracks: [...(audioSettings.tracks || []), newTrack],
      activeAudioUrl: newTrack.audioUrl,
      activeTrackTitle: newTrack.title,
    });
    setNewTrackTitle('');
    setNewTrackUrl('');
    showToast('Custom audio track added and activated!');
  };

  return (
    <div className="space-y-6">
      {/* Master Enable Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#e0d6c8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#e8281a]/10 text-[#e8281a] flex items-center justify-center shrink-0">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1a1a1a]">
              Website Welcome Audio &amp; Voice Announcer
            </h3>
            <p className="text-xs text-[#7a6e65] mt-0.5">
              Greet website visitors with multilingual voice announcements (Hindi, Gujarati, English)
              and pleasant lounge background music.
            </p>
          </div>
        </div>

        <label className="inline-flex items-center gap-3 cursor-pointer shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
            {audioSettings.enabled ? 'Enabled' : 'Disabled'}
          </span>
          <input
            type="checkbox"
            checked={audioSettings.enabled}
            onChange={(e) => {
              updateAudioSettings({ enabled: e.target.checked });
              showToast(
                e.target.checked ? 'Welcome Audio Player enabled' : 'Welcome Audio Player disabled'
              );
            }}
            className="w-5 h-5 accent-[#e8281a] rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Mode & Playback Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Voice Announcer Settings */}
        <div className="bg-white rounded-3xl p-6 border border-[#e0d6c8] space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-[#1a1a1a] flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#e8281a]" />
              <span>Multilingual Voice Hostess (TTS)</span>
            </h4>
            <button
              type="button"
              onClick={handleTestVoice}
              className="px-3.5 py-1.5 rounded-full bg-[#e8281a] hover:bg-[#c01e12] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {isPreviewPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Preview</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Voice Now</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5a524c] mb-1.5">
                Playback Mode
              </label>
              <select
                value={audioSettings.sourceMode}
                onChange={(e) =>
                  updateAudioSettings({
                    sourceMode: e.target.value as 'file_or_url' | 'voice_tts' | 'both',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs font-medium"
              >
                <option value="both">Voice Announcement + Background Music</option>
                <option value="voice_tts">Voice Announcement Only</option>
                <option value="file_or_url">Background Music / Audio File Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a524c] mb-1.5">
                Default Voice Language
              </label>
              <select
                value={audioSettings.voiceLanguage}
                onChange={(e) =>
                  updateAudioSettings({
                    voiceLanguage: e.target.value as 'hi-IN' | 'gu-IN' | 'en-IN',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs font-medium"
              >
                <option value="hi-IN">Hindi (हिन्दी)</option>
                <option value="gu-IN">Gujarati (ગુજરાતી)</option>
                <option value="en-IN">English (India)</option>
              </select>
            </div>
          </div>

          {/* Voice Persona Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#5a524c] mb-2">
              Voice Persona Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VOICE_PERSONA_PRESETS.map((persona) => {
                const isSelected = (audioSettings.voicePersona || 'warm_hostess') === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() =>
                      updateAudioSettings({
                        voicePersona: persona.id,
                        voiceGender: persona.gender,
                        voiceRate: persona.rate,
                        voicePitch: persona.pitch,
                      })
                    }
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#e8281a] bg-[#e8281a]/5'
                        : 'border-[#e0d6c8] bg-[#fff8f0]/60 hover:bg-[#fff8f0]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1a1a1a]">{persona.title}</div>
                    <div className="text-[10px] font-semibold text-[#e8281a] mt-0.5">
                      {persona.badge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scripts */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#5a524c] mb-1">
                Hindi Welcome Script (हिन्दी)
              </label>
              <textarea
                rows={2}
                value={audioSettings.voiceTextHi}
                onChange={(e) => updateAudioSettings({ voiceTextHi: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5a524c] mb-1">
                Gujarati Welcome Script (ગુજરાતી)
              </label>
              <textarea
                rows={2}
                value={audioSettings.voiceTextGu}
                onChange={(e) => updateAudioSettings({ voiceTextGu: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5a524c] mb-1">
                English Welcome Script
              </label>
              <textarea
                rows={2}
                value={audioSettings.voiceTextEn}
                onChange={(e) => updateAudioSettings({ voiceTextEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right: Built-in Studio Lounge Music & Custom Audio URL */}
        <div className="bg-white rounded-3xl p-6 border border-[#e0d6c8] space-y-5">
          <h4 className="font-bold text-base text-[#1a1a1a] flex items-center gap-2">
            <Music className="w-4 h-4 text-[#e8281a]" />
            <span>Background Lounge Music &amp; Welcome Card</span>
          </h4>

          <div>
            <label className="block text-xs font-semibold text-[#5a524c] mb-2">
              Built-in Royalty-Free Restaurant Instrumentals
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {builtinPresets.map((preset) => {
                const builtinUri = `builtin:${preset.id}`;
                const isSelected = audioSettings.activeAudioUrl === builtinUri;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      getBuiltinTrackWavUrl(preset.id);
                      updateAudioSettings({
                        activeAudioUrl: builtinUri,
                        activeTrackTitle: preset.label,
                        activeTrackSubtitle: preset.desc,
                      });
                      showToast(`Selected "${preset.label}"`);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#e8281a] bg-[#e8281a]/5'
                        : 'border-[#e0d6c8] bg-[#fff8f0]/60 hover:bg-[#fff8f0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1a1a1a]">{preset.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#e8281a]" />}
                    </div>
                    <p className="text-[11px] text-[#7a6e65] mt-0.5">{preset.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Custom MP3 URL */}
          <form onSubmit={handleAddCustomTrack} className="space-y-3 pt-2 border-t border-[#e0d6c8]">
            <label className="block text-xs font-semibold text-[#5a524c]">
              Add Custom Audio / MP3 URL
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Track Title (e.g. Festive Promo)"
                value={newTrackTitle}
                onChange={(e) => setNewTrackTitle(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs"
              />
              <input
                type="url"
                placeholder="https://example.com/audio.mp3"
                value={newTrackUrl}
                onChange={(e) => setNewTrackUrl(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#e8281a] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add &amp; Activate Track</span>
            </button>
          </form>

          {/* Saved Custom Tracks */}
          {audioSettings.tracks && audioSettings.tracks.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#5a524c]">Saved Audio Tracks</div>
              {audioSettings.tracks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#fff8f0] border border-[#e0d6c8]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#1a1a1a] truncate">{t.title}</div>
                    <div className="text-[10px] text-[#7a6e65] truncate">{t.audioUrl}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        updateAudioSettings({
                          activeAudioUrl: t.audioUrl,
                          activeTrackTitle: t.title,
                        });
                        showToast(`Activated "${t.title}"`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#e8281a] text-white text-[11px] font-semibold cursor-pointer"
                    >
                      Use
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateAudioSettings({
                          tracks: audioSettings.tracks.filter((item) => item.id !== t.id),
                        })
                      }
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Welcome Card Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e0d6c8]">
            <div>
              <label className="block text-xs font-semibold text-[#5a524c] mb-1">
                Welcome Card Title
              </label>
              <input
                type="text"
                value={audioSettings.welcomeTitle}
                onChange={(e) => updateAudioSettings({ welcomeTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5a524c] mb-1">
                CTA Button Label
              </label>
              <input
                type="text"
                value={audioSettings.ctaButtonText}
                onChange={(e) => updateAudioSettings({ ctaButtonText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#fff8f0] border border-[#e0d6c8] text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
