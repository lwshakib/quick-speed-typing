import { cn } from '@/lib/utils';

describe('Utils Library', () => {
  describe('cn (Tailwind Merge)', () => {
    it('merges class names correctly', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    it('handles conditional classes', () => {
      expect(cn('text-red-500', true && 'bg-blue-500', false && 'hidden')).toBe(
        'text-red-500 bg-blue-500',
      );
    });

    it('resolves tailwind conflicts correctly', () => {
      // bg-red-500 should be overwritten by bg-blue-500 if it comes after in twMerge
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('handles array and object inputs', () => {
      expect(cn(['bg-red-500', 'text-white'], { flex: true, hidden: false })).toBe(
        'bg-red-500 text-white flex',
      );
    });
  });
});
