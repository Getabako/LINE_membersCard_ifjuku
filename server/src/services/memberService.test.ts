import { describe, it, expect } from 'vitest';
import { generateMemberNumber, calculateRank, getPointsToNextRank } from './memberService.js';

describe('memberService', () => {
  describe('generateMemberNumber', () => {
    it('should generate a member number in correct format', () => {
      const memberNumber = generateMemberNumber();

      // 形式チェック: 0001-XXXX-XXXX
      expect(memberNumber).toMatch(/^0001-\d{4}-\d{4}$/);
    });

    it('should generate unique member numbers', () => {
      const numbers = new Set();
      for (let i = 0; i < 100; i++) {
        numbers.add(generateMemberNumber());
      }
      // ほぼすべて一意であることを確認（衝突は非常に稀）
      expect(numbers.size).toBeGreaterThan(95);
    });
  });

  describe('calculateRank', () => {
    it('should return BRONZE for points less than 1000', () => {
      expect(calculateRank(0)).toBe('BRONZE');
      expect(calculateRank(500)).toBe('BRONZE');
      expect(calculateRank(999)).toBe('BRONZE');
    });

    it('should return SILVER for points between 1000 and 4999', () => {
      expect(calculateRank(1000)).toBe('SILVER');
      expect(calculateRank(2500)).toBe('SILVER');
      expect(calculateRank(4999)).toBe('SILVER');
    });

    it('should return GOLD for points between 5000 and 9999', () => {
      expect(calculateRank(5000)).toBe('GOLD');
      expect(calculateRank(7500)).toBe('GOLD');
      expect(calculateRank(9999)).toBe('GOLD');
    });

    it('should return PLATINUM for points 10000 and above', () => {
      expect(calculateRank(10000)).toBe('PLATINUM');
      expect(calculateRank(50000)).toBe('PLATINUM');
    });
  });

  describe('getPointsToNextRank', () => {
    it('should return points needed to reach SILVER from BRONZE', () => {
      expect(getPointsToNextRank(0)).toBe(1000);
      expect(getPointsToNextRank(500)).toBe(500);
      expect(getPointsToNextRank(999)).toBe(1);
    });

    it('should return points needed to reach GOLD from SILVER', () => {
      expect(getPointsToNextRank(1000)).toBe(4000);
      expect(getPointsToNextRank(3000)).toBe(2000);
    });

    it('should return points needed to reach PLATINUM from GOLD', () => {
      expect(getPointsToNextRank(5000)).toBe(5000);
      expect(getPointsToNextRank(8000)).toBe(2000);
    });

    it('should return null for PLATINUM rank (max rank)', () => {
      expect(getPointsToNextRank(10000)).toBeNull();
      expect(getPointsToNextRank(50000)).toBeNull();
    });
  });
});
