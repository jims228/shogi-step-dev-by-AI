/**
 * W1-U2-L3: 歩のドリル
 * 歩の動きの反復練習
 */
import type { Lesson } from '../../types/lesson';

export const W1_U2_L3_PAWN_DRILL: Lesson = {
  id: 'w1-u2-l3',
  title: 'ふの ドリル',
  unitId: 'w1-u2',
  worldId: 'w1',
  order: 3,
  steps: [
    {
      type: 'tap_square',
      instruction: 'ふが すすめる マスを タップしてね。',
      coachText: 'まえは どこかな？',
      sfen: '9/9/9/9/9/9/9/2P6/9',
      correctSquares: [{ row: 6, col: 2 }],
      highlights: [{ row: 7, col: 2 }],
      successText: 'そのとおり！',
      failText: 'ふは まえに 1マスだよ。もういっかい！',
    },
    {
      type: 'tap_square',
      instruction: 'ふが すすめる マスを タップしてね。',
      coachText: 'どこに すすめるかな？',
      sfen: '9/9/9/9/9/P8/9/9/9',
      correctSquares: [{ row: 4, col: 0 }],
      highlights: [{ row: 5, col: 0 }],
      successText: 'いいね！ばっちり。',
      failText: 'まえに 1マスだけ すすめるよ。',
    },
    {
      type: 'tap_square',
      instruction: 'ふが すすめる マスを タップしてね。',
      coachText: 'こんどは みぎの ほうだよ。',
      sfen: '9/9/9/9/9/9/8P/9/9',
      correctSquares: [{ row: 5, col: 8 }],
      highlights: [{ row: 6, col: 8 }],
      successText: 'すごいよ！もう わかってきたね。',
      failText: 'ふは まえに 1マスだよ。がんばって！',
    },
    {
      type: 'move',
      instruction: 'ふを まえに すすめよう。',
      coachText: 'やってみよう！',
      sfen: '9/9/9/9/9/9/9/4P4/9',
      correctMove: {
        from: { row: 7, col: 4 },
        to: { row: 6, col: 4 },
      },
      successText: 'かんぺき！',
      failText: 'まえに 1マスだよ。もういっかい！',
    },
    {
      type: 'move',
      instruction: 'ふで あいての ふを とろう。',
      coachText: 'まえに すすんで とるんだよ。',
      sfen: '9/9/9/9/9/3p5/3P5/9/9',
      correctMove: {
        from: { row: 6, col: 3 },
        to: { row: 5, col: 3 },
      },
      successText: 'やったね！うまく とれたよ。',
      failText: 'あいての ふの マスに すすもう。',
    },
    {
      type: 'quiz',
      question: 'ふは 「なり」って なにかに へんしん できるよ。なにに なるか しってる？',
      coachText: 'まだ ならってないから、しらなくても だいじょうぶ！',
      choices: ['きんしょう', 'ぎんしょう', 'まだ ならってない'],
      correctIndex: 2,
      explanation: 'ふの「なり」は あとで ならいます。たのしみに しててね！',
    },
    {
      type: 'review',
      source: 'mistakes_in_lesson',
      count: 3,
    },
  ],
};
