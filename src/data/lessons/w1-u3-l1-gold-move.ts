/**
 * W1-U3-L1: 金は6方向
 * 金将が6方向に動けることを学ぶ
 */
import type { Lesson } from '../../types/lesson';

export const W1_U3_L1_GOLD_MOVE: Lesson = {
  id: 'w1-u3-l1',
  title: 'きんは 6ほうこう',
  unitId: 'w1-u3',
  worldId: 'w1',
  order: 1,
  steps: [
    {
      type: 'explain',
      text: '「きんしょう（金将）」は、おうの そばで まもる たのもしい こまです。6つの ほうこうに うごけます。',
      coachText: 'こんどは きんしょうを やってみよう！',
    },
    {
      type: 'explain',
      text: 'きんは まえ、ななめまえ、よこ、うしろ の 6ほうこうに 1マス うごけます。ななめうしろ だけは いけません。',
      coachText: 'ふと くらべると、たくさん うごけるね！',
      sfen: '9/9/9/9/4G4/9/9/9/9',
      highlights: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 4, col: 3 },
        { row: 4, col: 5 },
        { row: 5, col: 4 },
      ],
    },
    {
      type: 'tap_square',
      instruction: 'きんが うごける マスを ひとつ タップしてね。',
      coachText: '6つの うち、どれでも いいよ。',
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
      successText: 'そのとおり！きんは そこに うごけるよ。',
      failText: 'きんは ななめうしろには いけないよ。ほかの マスを さがしてみよう。',
    },
    {
      type: 'explain',
      text: 'きんは ななめうしろ（ひだりうしろ と みぎうしろ）には うごけません。それいがいは ぜんぶ いけます。',
      coachText: '「ななめうしろ いがい」って おぼえよう。',
    },
    {
      type: 'move',
      instruction: 'きんを まえに うごかしてみよう。',
      coachText: 'まっすぐ まえに 1マス！',
      sfen: '9/9/9/9/9/4G4/9/9/9',
      correctMove: {
        from: { row: 5, col: 4 },
        to: { row: 4, col: 4 },
      },
      successText: 'いいね！きんは まえにも うごけるんだね。',
      failText: 'まっすぐ まえに 1マス すすめてみよう。',
    },
    {
      type: 'quiz',
      question: 'きんしょうは なんほうこうに うごけるかな？',
      coachText: 'かぞえてみよう！',
      choices: ['4ほうこう', '6ほうこう', '8ほうこう'],
      correctIndex: 1,
      explanation: 'きんしょうは 6ほうこうに うごけます。ななめうしろの 2ほうこう だけ いけません。',
    },
  ],
};
