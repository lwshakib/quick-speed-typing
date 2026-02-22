'use client';

import {
  Settings as SettingsIcon,
  Palette,
  Keyboard,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Type,
  MousePointer2,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { THEMES } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { useSettingsStore, Settings } from '@/hooks/use-settings-store';
import { useSession } from '@/lib/auth-client';
import { useUiStore } from '@/hooks/use-ui-store';

export default function SettingsPage() {
  const { data: session } = useSession();
  const settings = useSettingsStore();
  const { applyTheme, currentTheme } = useUiStore();

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    settings.setSetting(key, value, session);
  };

  const handleThemeChange = (themeId: string) => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) {
      applyTheme(theme, session);
    }
  };

  return (
    <main className="flex w-full max-w-[1000px] flex-1 flex-col gap-12 px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="text-primary flex items-center gap-4">
          <SettingsIcon size={32} />
          <h1 className="text-foreground text-4xl font-bold tracking-tighter lowercase">
            settings
          </h1>
        </div>
        <p className="text-secondary max-w-2xl opacity-60">
          configure your typing experience. settings are automatically saved to{' '}
          {session ? 'your account' : 'local storage'}.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* BEHAVIOR */}
        <section className="flex flex-col gap-6">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold lowercase">
            <Keyboard size={18} className="text-primary" /> behavior
          </h2>
          <div className="flex flex-col gap-4">
            <SettingRow
              title="quick restart"
              description="press tab or alt + enter to quickly restart your test."
              enabled={settings.quickRestart}
              onToggle={(val) => handleSettingChange('quickRestart', val)}
            />
            <SettingRow
              title="confidence mode"
              description="prevents you from backspacing. focus on moving forward."
              enabled={settings.confidenceMode}
              onToggle={(val) => handleSettingChange('confidenceMode', val)}
            />
            <SettingRow
              title="smooth caret"
              description="enable smooth animations for the typing caret."
              enabled={settings.smoothCaret}
              onToggle={(val) => handleSettingChange('smoothCaret', val)}
            />
          </div>
        </section>

        {/* APPEARANCE */}
        <section className="flex flex-col gap-6">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold lowercase">
            <Palette size={18} className="text-primary" /> appearance
          </h2>
          <div className="flex flex-col gap-4">
            <div className="bg-secondary/5 border-secondary/10 flex flex-col gap-4 rounded-xl border p-6">
              <div className="flex flex-col gap-1">
                <span className="text-foreground font-bold lowercase">theme</span>
                <span className="text-xs opacity-60">change the overall color scheme.</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {THEMES.slice(0, 12).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-xs font-bold transition-all',
                      currentTheme.id === theme.id
                        ? 'bg-primary text-background border-primary'
                        : 'border-secondary/20 hover:border-secondary/50 text-secondary bg-transparent',
                    )}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <SettingRow
              title="live wpm"
              description="display live statistics while typing."
              enabled={settings.showLiveWpm}
              onToggle={(val) => handleSettingChange('showLiveWpm', val)}
              icon={settings.showLiveWpm ? <Eye size={16} /> : <EyeOff size={16} />}
            />

            <div className="bg-secondary/5 border-secondary/10 flex items-center justify-between rounded-xl border p-6">
              <div className="flex flex-col gap-1">
                <div className="text-foreground flex items-center gap-2 font-bold lowercase">
                  <MousePointer2 size={16} className="text-primary" /> caret style
                </div>
                <div className="text-xs opacity-60">change the look of the cursor.</div>
              </div>
              <Select
                value={settings.caretStyle}
                onValueChange={(val: string) =>
                  handleSettingChange('caretStyle', val as Settings['caretStyle'])
                }
              >
                <SelectTrigger className="bg-secondary/10 w-32 border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">line</SelectItem>
                  <SelectItem value="block">block</SelectItem>
                  <SelectItem value="underline">underline</SelectItem>
                  <SelectItem value="pulse">pulse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section className="flex flex-col gap-6">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold lowercase">
            <Type size={18} className="text-primary" /> typography
          </h2>
          <div className="flex flex-col gap-4">
            <div className="bg-secondary/5 border-secondary/10 flex flex-col gap-4 rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-foreground font-bold lowercase">font size</span>
                  <span className="text-xs opacity-60">
                    adjust the scale of the text ({settings.fontSize}px).
                  </span>
                </div>
              </div>
              <Slider
                value={[settings.fontSize]}
                min={16}
                max={48}
                step={2}
                onValueChange={([val]) => handleSettingChange('fontSize', val)}
                className="mt-2"
              />
            </div>

            <div className="bg-secondary/5 border-secondary/10 flex items-center justify-between rounded-xl border p-6">
              <div className="flex flex-col gap-1">
                <span className="text-foreground font-bold lowercase">font family</span>
                <span className="text-xs opacity-60">choose your preferred typeface.</span>
              </div>
              <Select
                value={settings.fontFamily}
                onValueChange={(val) => handleSettingChange('fontFamily', val)}
              >
                <SelectTrigger className="bg-secondary/10 w-40 border-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="font-mono">geist mono</SelectItem>
                  <SelectItem value="font-sans">geist sans</SelectItem>
                  <SelectItem value="font-serif">serif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* SOUND */}
        <section className="flex flex-col gap-6">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold lowercase">
            <Volume2 size={18} className="text-primary" /> sound
          </h2>
          <div className="flex flex-col gap-4">
            <SettingRow
              title="key sounds"
              description="play mechanical clicking sounds as you type."
              enabled={settings.soundEnabled}
              onToggle={(val) => handleSettingChange('soundEnabled', val)}
              icon={settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            />

            <div
              className={cn(
                'bg-secondary/5 border-secondary/10 flex flex-col gap-4 rounded-xl border p-6 transition-opacity',
                !settings.soundEnabled && 'pointer-events-none opacity-40',
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-foreground font-bold lowercase">volume</span>
                <span className="text-xs opacity-60">control the output level of sounds.</span>
              </div>
              <Slider
                value={[settings.soundVolume * 100]}
                min={0}
                max={100}
                onValueChange={([val]) => handleSettingChange('soundVolume', val / 100)}
                className="mt-2"
              />
            </div>
          </div>
        </section>
      </div>

      {/* EXPERIMENTAL */}
      <section className="mt-4 flex flex-col gap-6">
        <h2 className="text-foreground flex items-center gap-2 text-xl font-bold lowercase">
          <Zap size={18} className="text-primary" /> experimental
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-secondary/5 border-secondary/10 flex items-center justify-between rounded-xl border p-6">
            <div className="flex flex-col gap-1">
              <span className="text-foreground font-bold lowercase">timer position</span>
              <span className="text-xs opacity-60">where the countdown appears.</span>
            </div>
            <div className="bg-secondary/10 flex gap-2 rounded-lg p-1">
              {(['top', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => handleSettingChange('timerPosition', pos)}
                  className={cn(
                    'rounded-md px-4 py-1.5 text-xs font-bold transition-all',
                    settings.timerPosition === pos
                      ? 'bg-primary text-background shadow-lg'
                      : 'text-secondary hover:text-foreground',
                  )}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface SettingRowProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (val: boolean) => void;
  icon?: React.ReactNode;
}

function SettingRow({ title, description, enabled, onToggle, icon }: SettingRowProps) {
  return (
    <div className="bg-secondary/5 border-secondary/10 hover:border-secondary/20 group flex items-center justify-between rounded-xl border p-6 transition-colors">
      <div className="flex flex-col gap-1">
        <div className="text-foreground flex items-center gap-2 font-bold lowercase transition-colors">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </div>
        <div className="text-xs opacity-60">{description}</div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}
