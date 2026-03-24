/**
 * W1-U2-L1: 歩は前に一歩
 * 歩が前に1マスだけ動けることを学ぶ
 */
import type { Lesson } from '../../types/lesson';

export const W1_U2_L1_PAWN_MOVE: Lesson = {
  id: 'w1-u2-l1',
  title: 'ふは まえに いっぽ',
  unitId: 'w1-u2',
  worldId: 'w1',
  order: 1,
  steps: [
    {
      type: 'explain',
      text: '「ふ（歩）」は いちばん かずが おおい こまです。まえに 1マスだけ すすめます。',
      coachText: 'こんどは こまを うごかしてみよう！',
    },
    {
      type: 'explain',
      text: 'ふは まっすぐ まえに 1マスだけ すすめます。よこや うしろには うごけません。',
      coachText: 'まえだけ！シンプルだね。',
      sfen: '9/9/9/9/9/9/4P4/9/9',
      highlights: [{ row: 5, col: 4 }],
    },
    {
      type: 'move',
      instruction: 'ふを まえに 1マス うごかしてみよう。',
      coachText: 'ふを タップして、まえの マスを タップしてね。',
      sfen: '9/9/9/9/9/9/4P4/9/9',
      correctMove: {
        from: { row: 6, col: 4 },
        to: { row: 5, col: 4 },
      },
      successText: 'いいね！ふは まえに 1マス すすめたね。',
      failText: 'おしいね。ふは まっすぐ まえに 1マスだけ うごけるよ。',
    },
    {
      type: 'tap_square',
      instruction: 'ふが つぎに すすめる マスを タップしてね。',
      coachText: 'まえは どっちかな？',
      sfen: '9/9/9/9/4P4/9/9/9/9',
      correctSquares: [{ row: 3, col: 4 }],
      highlights: [{ row: 4, col: 4 }],
      successText: 'そのとおり！まっすぐ まえだね。',
      failText: 'ふは まえに 1マスだけ すすめるよ。もういっかい やってみよう。',
    },
    {
      type: 'explain',
      text: 'ふは まえにしか すすめません。うしろや よこには いけないので、すすむ ときは よく かんがえよう。',
      coachText: 'いちど すすんだら もどれないんだ。',
    },
    {
      type: 'quiz',
      question: 'ふは どの ほうこうに うごける？',
      coachText: 'ならったばかりだね！',
      choices: ['まえと うしろ', 'まえだけ', 'どの ほうこうにも'],
      correctIndex: 1,
      explanation: 'ふは まえに 1マスだけ うごけます。うしろや よこには うごけません。',
    },
  ],
};
