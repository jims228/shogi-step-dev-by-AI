/**
 * W1-U4-L2: 金と銀を見分ける
 * 金将と銀将の動きの違いを比較して理解する
 */
import type { Lesson } from '../../types/lesson';

export const W1_U4_L2_GOLD_VS_SILVER: Lesson = {
  id: 'w1-u4-l2',
  title: 'きんと ぎんを みわける',
  unitId: 'w1-u4',
  worldId: 'w1',
  order: 2,
  steps: [
    {
      type: 'tap_square',
      instruction: 'きんが うごけて、ぎんが うごけない マスを タップしてね。',
      coachText: 'きんだけ いける ところは どこかな？',
      sfen: '9/9/9/9/4G4/9/9/9/9',
      correctSquares: [
        { row: 4, col: 3 },
        { row: 4, col: 5 },
        { row: 5, col: 4 },
      ],
      highlights: [{ row: 4, col: 4 }],
      successText: 'いいね！よこと まうしろは きんだけ いけるんだね。',
      failText: 'きんだけ いけるのは よこと まうしろだよ。',
    },
    {
      type: 'tap_square',
      instruction: 'ぎんが うごけて、きんが うごけない マスを タップしてね。',
      coachText: 'ぎんだけ いける ところは？',
      sfen: '9/9/9/9/4S4/9/9/9/9',
      correctSquares: [
        { row: 5, col: 3 },
        { row: 5, col: 5 },
      ],
      highlights: [{ row: 4, col: 4 }],
      successText: 'そう！ななめうしろは ぎんだけ いけるんだよ。',
      failText: 'ぎんだけ いけるのは ななめうしろだよ。',
    },
    {
      type: 'quiz',
      question: 'きんが いけなくて ぎんが いける ほうこうは？',
      coachText: 'ちがいを おぼえよう！',
      choices: ['よこ', 'まえ', 'ななめうしろ'],
      correctIndex: 2,
      explanation: 'ななめうしろは ぎんだけ いけます。きんは ななめうしろに いけません。',
    },
    {
      type: 'quiz',
      question: 'おうを まもるのに むいているのは どっち？',
      coachText: 'うごける ほうこうを かんがえてみよう。',
      choices: ['きんしょう', 'ぎんしょう', 'どちらも おなじ'],
      correctIndex: 0,
      explanation: 'きんしょうは よこにも うしろにも いけるので、おうの まわりを まもるのに むいています。',
    },
    {
      type: 'explain',
      text: 'きんは「まもり」、ぎんは「せめ」に むいています。きんは おうの そばで まもり、ぎんは まえに すすんで せめます。',
      coachText: 'ふたつの こまの やくわりが わかったね！',
    },
  ],
};
