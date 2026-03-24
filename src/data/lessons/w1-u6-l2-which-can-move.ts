/**
 * W1-U6-L2: どの駒が動ける？
 * 盤面を見て、どの駒がどこに動けるかを判断する
 */
import type { Lesson } from '../../types/lesson';

export const W1_U6_L2_WHICH_CAN_MOVE: Lesson = {
  id: 'w1-u6-l2',
  title: 'どの こまが うごける？',
  unitId: 'w1-u6',
  worldId: 'w1',
  order: 2,
  steps: [
    {
      type: 'explain',
      text: 'ばんめんを みて、こまが どこに うごけるか かんがえて みましょう。',
      coachText: 'ちょっと むずかしいけど、やってみよう！',
    },
    {
      type: 'tap_square',
      instruction: 'ふが すすめる マスを タップしてね。',
      coachText: 'ふは まえに 1マスだよ。',
      sfen: '9/9/9/9/9/3P5/9/9/9',
      correctSquares: [{ row: 4, col: 3 }],
      highlights: [{ row: 5, col: 3 }],
      successText: 'いいね！',
      failText: 'ふは まえに 1マスだけだよ。',
    },
    {
      type: 'tap_square',
      instruction: 'きんが あいての ふを とれるよ。とれる ふを タップしてね。',
      coachText: 'きんが うごける マスに いる ふは？',
      sfen: '9/9/9/4p4/3G5/9/9/9/9',
      correctSquares: [{ row: 3, col: 4 }],
      highlights: [{ row: 4, col: 3 }],
      successText: 'そのとおり！ななめまえの ふを とれるね。',
      failText: 'きんは ななめまえにも うごけるよ。',
    },
    {
      type: 'board_quiz',
      question: 'ぎんしょうが まうしろに うごけるのは ただしい？',
      coachText: 'ぎんの にがてな ほうこうは どこだっけ？',
      boardOptions: [
        { sfen: '9/9/9/9/4S4/4S4/9/9/9', label: 'うごける' },
        { sfen: '9/9/9/9/4S4/9/9/9/9', label: 'うごけない' },
      ],
      correctIndex: 1,
      explanation: 'ぎんは まうしろには うごけません。よこと まうしろが にがてです。',
    },
    {
      type: 'quiz',
      question: 'ひしゃの まえに あいての こまが ある とき、とびこえて うごける？',
      coachText: 'おおごまの ルールを おもいだそう。',
      choices: ['とびこえられる', 'とびこえられない', 'こまによる'],
      correctIndex: 1,
      explanation: 'ひしゃも かくも、ほかの こまを とびこえることは できません。',
    },
    {
      type: 'quiz',
      question: 'つぎの うち、おおごまは どれ？',
      coachText: 'とおくまで うごける こまだよ。',
      choices: ['ふと きん', 'ひしゃと かく', 'きんと ぎん'],
      correctIndex: 1,
      explanation: 'ひしゃと かくが おおごまです。なんマスでも うごける つよい こまです。',
    },
  ],
};
