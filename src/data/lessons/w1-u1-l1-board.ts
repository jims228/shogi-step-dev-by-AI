/**
 * W1-U1-L1: 将棋の盤面
 * 9x9の盤面、マス目、座標を知る
 */
import type { Lesson } from '../../types/lesson';

export const W1_U1_L1_BOARD: Lesson = {
  id: 'w1-u1-l1',
  title: 'しょうぎの ばんめん',
  unitId: 'w1-u1',
  worldId: 'w1',
  order: 1,
  steps: [
    {
      type: 'explain',
      text: 'しょうぎは、ひろい ばんの うえで あそぶ ゲームです。ばんは たてと よこに マスが ならんでいます。',
      coachText: 'いっしょに みてみよう！',
    },
    {
      type: 'explain',
      text: 'しょうぎの ばんは、たて9マス よこ9マスで できています。ぜんぶで 81マス あります。',
      coachText: 'ひろいね！でも だいじょうぶ、すこしずつ おぼえよう。',
      sfen: '9/9/9/9/9/9/9/9/9',
    },
    {
      type: 'tap_square',
      instruction: 'ばんの まんなかの マスを タップしてね。',
      coachText: 'まんなかは どこかな？',
      sfen: '9/9/9/9/9/9/9/9/9',
      correctSquares: [{ row: 4, col: 4 }],
      successText: 'そのとおり！ここが まんなかの マスだよ。',
      failText: 'おしいね。もうすこし まんなかを さがしてみよう。',
    },
    {
      type: 'explain',
      text: 'ばんの よこの ならびを「すじ」、たての ならびを「だん」と いいます。みぎから 1すじ、2すじ…と かぞえます。',
      coachText: 'すじと だん、おぼえてね。',
      sfen: '9/9/9/9/9/9/9/9/9',
    },
    {
      type: 'quiz',
      question: 'しょうぎの ばんは ぜんぶで なんマス あるかな？',
      coachText: 'たてと よこ、かけざん してみよう！',
      choices: ['64マス', '81マス', '100マス'],
      correctIndex: 1,
      explanation: 'たて9マス かける よこ9マスで、81マスです。',
    },
  ],
};
