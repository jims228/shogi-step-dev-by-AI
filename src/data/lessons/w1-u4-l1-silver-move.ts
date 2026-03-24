/**
 * W1-U4-L1: 銀は5方向
 * 銀将が5方向に動けることを学ぶ
 */
import type { Lesson } from '../../types/lesson';

export const W1_U4_L1_SILVER_MOVE: Lesson = {
  id: 'w1-u4-l1',
  title: 'ぎんは 5ほうこう',
  unitId: 'w1-u4',
  worldId: 'w1',
  order: 1,
  steps: [
    {
      type: 'explain',
      text: '「ぎんしょう（銀将）」は、まえと ななめに うごける こまです。5つの ほうこうに うごけます。',
      coachText: 'こんどは ぎんしょうだよ！',
    },
    {
      type: 'explain',
      text: 'ぎんは まえ、ななめまえ、ななめうしろ の 5ほうこうに 1マス うごけます。よこと まうしろには いけません。',
      coachText: 'きんとは ちょっと ちがうね。',
      sfen: '9/9/9/9/4S4/9/9/9/9',
      highlights: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 5, col: 3 },
        { row: 5, col: 5 },
      ],
    },
    {
      type: 'explain',
      text: 'きんは「ななめうしろ いがい」、ぎんは「よこと まうしろ いがい」。にているけど ちがうんです。',
      coachText: 'ここが ポイントだよ！',
    },
    {
      type: 'tap_square',
      instruction: 'ぎんが うごける マスを ひとつ タップしてね。',
      coachText: '5ほうこう おぼえたかな？',
      sfen: '9/9/9/9/4S4/9/9/9/9',
      correctSquares: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 5, col: 3 },
        { row: 5, col: 5 },
      ],
      highlights: [{ row: 4, col: 4 }],
      successText: 'そのとおり！ぎんは そこに うごけるよ。',
      failText: 'ぎんは よこと まうしろには いけないよ。もういっかい やってみよう。',
    },
    {
      type: 'explain',
      text: 'ぎんは ななめに うごけるので、「せめ」に つかうことが おおいです。まえに どんどん すすめます。',
      coachText: 'ぎんは せめの こまなんだ。',
      sfen: '9/9/9/9/4S4/9/9/9/9',
    },
    {
      type: 'quiz',
      question: 'ぎんしょうは なんほうこうに うごけるかな？',
      coachText: 'きんと くらべてみよう。',
      choices: ['4ほうこう', '5ほうこう', '6ほうこう'],
      correctIndex: 1,
      explanation: 'ぎんしょうは 5ほうこうに うごけます。きんは 6ほうこうだったね。',
    },
  ],
};
