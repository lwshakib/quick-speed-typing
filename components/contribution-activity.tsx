'use client';


import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Day {
  contributionCount: number;
  date: string;
}

interface Week {
  contributionDays: Day[];
}

interface ContributionActivityProps {
  calendar: Week[];
  totalContributions: number;
}

export function ContributionActivity({ calendar, totalContributions }: ContributionActivityProps) {
  // Flatten days and group them by month for labels
  const allDays = calendar.flatMap((w) => w.contributionDays);

  // Get month labels
  const monthLabels: { label: string; index: number }[] = [];
  calendar.forEach((week, i) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const date = parseISO(firstDay.date);
      const monthLabel = format(date, 'MMM');
      if (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].label !== monthLabel) {
        monthLabels.push({ label: monthLabel, index: i });
      }
    }
  });

  const lastDay = allDays[allDays.length - 1];
  const displayYear = lastDay ? format(parseISO(lastDay.date), 'yyyy') : format(new Date(), 'yyyy');

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  const getColor = (count: number) => {
    if (count === 0) return 'var(--muted)';
    if (count < 3) return 'var(--main-color)';
    if (count < 6) return 'var(--main-color)';
    if (count < 10) return 'var(--main-color)';
    return 'var(--main-color)';
  };

  const getOpacity = (count: number) => {
    if (count === 0) return 0.15;
    if (count < 3) return 0.35;
    if (count < 6) return 0.6;
    if (count < 10) return 0.85;
    return 1;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h2
            className="flex items-center gap-2 text-xl font-bold lowercase"
            style={{ color: 'var(--text-color)' }}
          >
            activity
          </h2>
          <p className="text-xs lowercase opacity-50">your typing sessions over the last year</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-2xl font-black" style={{ color: 'var(--main-color)' }}>
            {totalContributions}
          </span>
          <span className="text-[10px] font-black tracking-widest uppercase opacity-30">
            total tests
          </span>
        </div>
      </div>

      <div
        className="overflow-hidden p-0"
        style={{ backgroundColor: 'transparent', border: 'none' }}
      >
        <div className="flex w-full flex-col items-center overflow-hidden">
          <div className="inline-flex max-w-full flex-col gap-2 overflow-x-auto pb-2">
            {/* Month labels */}
            <div className="relative mb-1 ml-8 h-4 text-[9px] font-black tracking-widest uppercase opacity-30">
              {monthLabels.map((m, i) => (
                <div
                  key={`${m.label}-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${m.index * 16}px`,
                  }}
                  className="translate-y-[2px] whitespace-nowrap"
                >
                  {m.label}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {/* Day labels */}
              <div className="flex w-6 flex-col gap-[4px] pt-1 text-[9px] font-black tracking-tighter uppercase opacity-30">
                {dayLabels.map((label, i) => (
                  <div key={i} className="flex h-[12px] items-center">
                    {label}
                  </div>
                ))}
              </div>

              {/* The Grid */}
              <div className="flex gap-[4px]">
                <TooltipProvider delayDuration={100}>
                  {calendar.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[4px]">
                      {week.contributionDays.map((day, dayIndex) => (
                        <Tooltip key={day.date}>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: (weekIndex * 7 + dayIndex) * 0.0005,
                              }}
                              className="hover:ring-primary/50 h-[12px] w-[12px] cursor-pointer rounded-[3px] transition-all hover:ring-2"
                              style={{
                                backgroundColor: getColor(day.contributionCount),
                                opacity: getOpacity(day.contributionCount),
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="border-2 p-2 text-[10px] font-bold lowercase"
                            style={{
                              backgroundColor: 'var(--background)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-color)',
                            }}
                          >
                            <span style={{ color: 'var(--main-color)' }}>
                              {day.contributionCount} tests
                            </span>{' '}
                            on {format(parseISO(day.date), 'MMM d, yyyy')}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase opacity-40">
          <div>
            {totalContributions} sessions in {displayYear}
          </div>
          <div className="flex items-center gap-2">
            <span className="lowercase">less</span>
            <div className="flex gap-1">
              {[0, 2, 5, 8, 12].map((count) => (
                <div
                  key={count}
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{
                    backgroundColor: getColor(count),
                    opacity: getOpacity(count),
                  }}
                />
              ))}
            </div>
            <span className="lowercase">more</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContributionActivitySkeleton() {
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-3 w-48 rounded-lg" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-8 w-12 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
        </div>
      </div>

      <div className="p-0" style={{ backgroundColor: 'transparent', border: 'none' }}>
        <div className="flex w-full flex-col items-center overflow-hidden">
          <div className="inline-flex flex-col gap-2">
            <div className="mb-1 ml-8 flex h-4 gap-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-8 rounded-sm" />
              ))}
            </div>

            <div className="flex gap-2">
              <div className="flex w-6 flex-col gap-[4px] pt-1">
                {dayLabels.map((_, i) => (
                  <div key={i} className="flex h-[12px] items-center">
                    <Skeleton className="h-2 w-4 rounded-sm" />
                  </div>
                ))}
              </div>

              <div className="flex gap-[4px]">
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[4px]">
                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                      <Skeleton
                        key={dayIndex}
                        className="h-[12px] w-[12px] rounded-[3px] opacity-20"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Skeleton className="h-3 w-32 rounded-sm" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-8 rounded-sm" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-2.5 w-2.5 rounded-[2px]" />
              ))}
            </div>
            <Skeleton className="h-3 w-8 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
