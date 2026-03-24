/**
 * W1-U5-L2: 角行はナナメに
 * 角行が斜めに何マスでも動けることを学ぶ
 */
import type { Lesson } from '../../types/lesson';

export const W1_U5_L2_BISHOP: Lesson = {
  id: 'w1-u5-l2',
  title: 'かくは ナナメに',
  unitId: 'w1-u5',
  worldId: 'w1',
  order: 2,
  steps: [
    {
      type: 'explain',
      text: '「かくぎょう（角行）」は ななめに なんマスでも すすめる こまです。ひしゃと ならぶ「おおごま」です。',
      coachText: 'もうひとつの おおごまだよ！',
    },
    {
      type: 'explain',
      text: 'かくは ななめ 4ほうこうに どこまでも すすめます。たてや よこには うごけません。',
      coachText: 'バツ（X）の かたちを イメージしてね。',
      sfen: '9/9/9/9/4B4/9/9/9/9',
      highlights: [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
        { row: 3, col: 3 },
        { row: 5, col: 5 },
        { row: 6, col: 6 },
        { row: 7, col: 7 },
        { row: 8, col: 8 },
        { row: 0, col: 8 },
        { row: 1, col: 7 },
        { row: 2, col: 6 },
        { row: 3, col: 5 },
        { row: 5, col: 3 },
        { row: 6, col: 2 },
        { row: 7, col: 1 },
        { row: 8, col: 0 },
      ],
    },
    {
      type: 'tap_square',
      instruction: 'かくが うごける マスを ひとつ タップしてね。',
      coachText: 'ななめの マスだよ。',
      sfen: '9/9/9/9/4B4/9/9/9/9',
      correctSquares: [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
        { row: 3, col: 3 },
        { row: 5, col: 5 },
        { row: 6, col: 6 },
        { row: 7, col: 7 },
        { row: 8, col: 8 },
        { row: 0, col: 8 },
        { row: 1, col: 7 },
        { row: 2, col: 6 },
        { row: 3, col: 5 },
        { row: 5, col: 3 },
        { row: 6, col: 2 },
        { row: 7, col: 1 },
        { row: 8, col: 0 },
      ],
      highlights: [{ row: 4, col: 4 }],
      successText: 'いいね！ななめに どこまでも いけるよ。',
      failText: 'かくは ななめだけだよ。たてよこには いけないの。',
    },
    {
      type: 'explain',
      text: 'かくも ほかの こまを とびこえられません。あいだに こまが あると、そこまでしか いけません。',
      coachText: 'ひしゃと おなじルールだね。',
    },
    {
      type: 'quiz',
      question: 'ひしゃは たてよこ、かくは？',
      coachText: 'ひしゃと かくの ちがいだよ。',
      choices: ['たてよこ', 'ななめ', 'ぜんほうこう'],
      correctIndex: 1,
      explanation: 'ひしゃは たてよこ（＋）、かくは ななめ（X）です。セットで おぼえよう！',
    },
  ],
};
