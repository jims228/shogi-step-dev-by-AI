/**
 * W1-U3-L2: 金で取る＆守る
 * 金で駒を取る・王を守る概念を学ぶ
 */
import type { Lesson } from '../../types/lesson';

export const W1_U3_L2_GOLD_DEFENSE: Lesson = {
  id: 'w1-u3-l2',
  title: 'きんで とる＆まもる',
  unitId: 'w1-u3',
  worldId: 'w1',
  order: 2,
  steps: [
    {
      type: 'explain',
      text: 'きんは うごける マスに あいての こまが あれば、とることが できます。',
      coachText: 'きんで とってみよう！',
      sfen: '9/9/9/9/4p4/4G4/9/9/9',
      highlights: [{ row: 4, col: 4 }, { row: 5, col: 4 }],
    },
    {
      type: 'move',
      instruction: 'きんで あいての ふを とってみよう。',
      coachText: 'まえに すすめば とれるよ。',
      sfen: '9/9/9/9/4p4/4G4/9/9/9',
      correctMove: {
        from: { row: 5, col: 4 },
        to: { row: 4, col: 4 },
      },
      successText: 'やったね！きんで ふを とれたよ。',
      failText: 'きんを まえに すすめて、あいての ふを とろう。',
    },
    {
      type: 'explain',
      text: 'きんは「まもる こま」として とても だいじです。おうの よこに おいて まもることが おおいです。',
      coachText: 'きんは おうの ボディガード みたいだね。',
      sfen: '9/9/9/9/9/9/9/9/4KG3',
      highlights: [{ row: 8, col: 4 }, { row: 8, col: 5 }],
    },
    {
      type: 'explain',
      text: 'おうの そばに きんを おくと、あいての こまが ちかづきにくく なります。これが「まもり」です。',
      coachText: 'まもりって だいじなんだ。',
    },
    {
      type: 'quiz',
      question: 'きんしょうは どんな やくわりが おおいかな？',
      coachText: 'さっき ならったね！',
      choices: [
        'とおくに とんでいく やくわり',
        'おうを まもる やくわり',
        'うごかない やくわり',
      ],
      correctIndex: 1,
      explanation: 'きんしょうは おうの そばで まもる やくわりが おおいです。たのもしい こまですね。',
    },
  ],
};
