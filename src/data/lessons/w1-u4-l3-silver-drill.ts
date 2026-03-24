/**
 * W1-U4-L3: 銀のドリル
 * 銀将の動きの反復練習
 */
import type { Lesson } from '../../types/lesson';

export const W1_U4_L3_SILVER_DRILL: Lesson = {
  id: 'w1-u4-l3',
  title: 'ぎんの ドリル',
  unitId: 'w1-u4',
  worldId: 'w1',
  order: 3,
  steps: [
    {
      type: 'tap_square',
      instruction: 'ぎんが うごける マスを ぜんぶ みつけて、ひとつ タップしてね。',
      coachText: '5ほうこう おぼえてるかな？',
      sfen: '9/9/9/9/9/9/3S5/9/9',
      correctSquares: [
        { row: 5, col: 2 },
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 7, col: 2 },
        { row: 7, col: 4 },
      ],
      highlights: [{ row: 6, col: 3 }],
      successText: 'いいね！',
      failText: 'ぎんは まえ、ななめまえ、ななめうしろに うごけるよ。',
    },
    {
      type: 'move',
      instruction: 'ぎんを ななめまえに うごかしてみよう。',
      coachText: 'ななめまえに すすめてね。',
      sfen: '9/9/9/9/9/9/4S4/9/9',
      correctMove: {
        from: { row: 6, col: 4 },
        to: { row: 5, col: 5 },
      },
      successText: 'すごい！ぎんは ななめに うごくのが とくいだね。',
      failText: 'ななめまえ（みぎうえ）に うごかしてみよう。',
    },
    {
      type: 'quiz',
      question: 'ぎんが いけないのは どの ほうこう？',
      coachText: 'にがてな ほうこうは？',
      choices: ['ななめまえ', 'よこ', 'ななめうしろ'],
      correctIndex: 1,
      explanation: 'ぎんは よこと まうしろには いけません。まえ、ななめまえ、ななめうしろの 5ほうこうだけです。',
    },
    {
      type: 'review',
      source: 'mistakes_in_lesson',
      count: 3,
    },
  ],
};
