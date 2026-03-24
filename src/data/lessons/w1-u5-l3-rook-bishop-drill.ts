/**
 * W1-U5-L3: 飛角ドリル
 * 飛車と角行の動きの反復練習
 */
import type { Lesson } from '../../types/lesson';

export const W1_U5_L3_ROOK_BISHOP_DRILL: Lesson = {
  id: 'w1-u5-l3',
  title: 'ひかく ドリル',
  unitId: 'w1-u5',
  worldId: 'w1',
  order: 3,
  steps: [
    {
      type: 'tap_square',
      instruction: 'ひしゃが うごける マスを ひとつ タップしてね。',
      coachText: 'たてよこだよ！',
      sfen: '9/9/9/9/9/9/2R6/9/9',
      correctSquares: [
        { row: 0, col: 2 },
        { row: 1, col: 2 },
        { row: 2, col: 2 },
        { row: 3, col: 2 },
        { row: 4, col: 2 },
        { row: 5, col: 2 },
        { row: 7, col: 2 },
        { row: 8, col: 2 },
        { row: 6, col: 0 },
        { row: 6, col: 1 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 6, col: 8 },
      ],
      highlights: [{ row: 6, col: 2 }],
      successText: 'そのとおり！',
      failText: 'ひしゃは たてと よこだよ。ななめには いけないよ。',
    },
    {
      type: 'move',
      instruction: 'ひしゃで あいての ふを とろう。',
      coachText: 'まっすぐ すすんで とれるよ。',
      sfen: '9/9/4p4/9/9/9/4R4/9/9',
      correctMove: {
        from: { row: 6, col: 4 },
        to: { row: 2, col: 4 },
      },
      successText: 'すごい！とおくの こまも いっきに とれるんだね。',
      failText: 'ひしゃは たてに まっすぐ すすんで とれるよ。',
    },
    {
      type: 'quiz',
      question: 'ななめに うごけるのは ひしゃと かく、どっち？',
      coachText: 'じゅうじと バツ、どっちが ななめ？',
      choices: ['ひしゃ', 'かく', 'どちらも'],
      correctIndex: 1,
      explanation: 'かくが ななめ（X）、ひしゃは たてよこ（＋）です。',
    },
    {
      type: 'review',
      source: 'mistakes_in_lesson',
      count: 3,
    },
  ],
};
