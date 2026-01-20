import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatRelativeTime,
  formatDate,
  isOverdue,
  isDueToday,
  cn,
} from '../../lib/utils';

describe('utils', () => {
  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "just now" for recent times', () => {
      const date = new Date('2024-01-15T11:59:30.000Z').toISOString();
      expect(formatRelativeTime(date)).toBe('just now');
    });

    it('returns minutes ago', () => {
      const date = new Date('2024-01-15T11:50:00.000Z').toISOString();
      expect(formatRelativeTime(date)).toBe('10m ago');
    });

    it('returns hours ago', () => {
      const date = new Date('2024-01-15T09:00:00.000Z').toISOString();
      expect(formatRelativeTime(date)).toBe('3h ago');
    });

    it('returns days ago', () => {
      const date = new Date('2024-01-13T12:00:00.000Z').toISOString();
      expect(formatRelativeTime(date)).toBe('2d ago');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2024-03-15T00:00:00.000Z';
      expect(formatDate(date)).toBe('Mar 15, 2024');
    });
  });

  describe('isOverdue', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns true for past dates', () => {
      expect(isOverdue('2024-01-14T00:00:00.000Z')).toBe(true);
    });

    it('returns false for future dates', () => {
      expect(isOverdue('2024-01-16T00:00:00.000Z')).toBe(false);
    });
  });

  describe('isDueToday', () => {
    it('returns true for today', () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      expect(isDueToday(today.toISOString())).toBe(true);
    });

    it('returns false for other days', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isDueToday(tomorrow.toISOString())).toBe(false);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isDueToday(yesterday.toISOString())).toBe(false);
    });
  });

  describe('cn', () => {
    it('joins class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('filters out falsy values', () => {
      expect(cn('foo', false, undefined, 'bar')).toBe('foo bar');
    });
  });
});
