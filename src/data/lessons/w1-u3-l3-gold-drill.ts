/**
 * W1-U3-L3: 金のドリル
 * 金将の動きの反復練習
 */
import type { Lesson } from '../../types/lesson';

export const W1_U3_L3_GOLD_DRILL: Lesson = {
  id: 'w1-u3-l3',
  title: 'きんの ドリル',
  unitId: 'w1-u3',
  worldId: 'w1',
  order: 3,
  steps: [
    {
      type: 'tap_square',
      instruction: 'きんが うごける マスを タップしてね。',
      coachText: '6ほうこう おぼえてる？',
      sfen: '9/9/9/9/4G4/9/9/9/9',
      correctSquares: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 4, col: 3 },
        { row: 4, col: 5 },
        { row: 5, col: 4 },
      ],
      highlights: [{ row: 4, col: 4 }],
      successText: 'いいね！',
      failText: 'ななめうしろには いけないよ。ほかの ほうこうを ためしてみよう。',
    },
    {
      type: 'tap_square',
      instruction: 'きんが うごけない マスを さがして タップしてね。',
      coachText: 'いけない ほうこうは どこだっけ？',
      sfen: '9/9/9/9/4G4/9/9/9/9',
      correctSquares: [
        { row: 5, col: 3 },
        { row: 5, col: 5 },
      ],
      highlights: [{ row: 4, col: 4 }],
      successText: 'そう！ななめうしろには いけないんだね。',
      failText: 'きんは ななめうしろの 2マスだけ いけないよ。',
    },
    {
      type: 'tap_square',
      instruction: 'きんが あいての ふを とれる ばしょに いるよ。とれる ふを タップしてね。',
      coachText: 'きんが うごける マスに いる ふを さがそう。',
      sfen: '9/9/9/3p5/4G4/9/9/9/9',
      correctSquares: [{ row: 3, col: 3 }],
      highlights: [{ row: 4, col: 4 }],
      successText: 'すごい！ななめまえの ふを とれるね。',
      failText: 'きんが うごける マスに ある ふを さがしてみよう。',
    },
    {
      type: 'move',
      instruction: 'きんを よこに うごかしてみよう。',
      coachText: 'きんは よこにも いけるよ。',
      sfen: '9/9/9/9/4G4/9/9/9/9',
      correctMove: {
        from: { row: 4, col: 4 },
        to: { row: 4, col: 5 },
      },
      successText: 'かんぺき！きんは よこにも うごけるんだね。',
      failText: 'みぎよこの マスに うごかしてみよう。',
    },
    {
      type: 'quiz',
      question: 'きんが いけないのは どっち？',
      coachText: 'にがてな ほうこうは？',
      choices: ['まえ', 'よこ', 'ななめうしろ'],
      correctIndex: 2,
      explanation: 'きんは ななめうしろ だけは いけません。それいがいの 6ほうこうに うごけます。',
    },
    {
      type: 'review',
      source: 'mistakes_in_lesson',
      count: 3,
    },
  ],
};
