/**
 * W1-U2-L2: 歩で取る
 * 歩で相手の駒を取る方法を学ぶ
 */
import type { Lesson } from '../../types/lesson';

export const W1_U2_L2_PAWN_CAPTURE: Lesson = {
  id: 'w1-u2-l2',
  title: 'ふで とる',
  unitId: 'w1-u2',
  worldId: 'w1',
  order: 2,
  steps: [
    {
      type: 'explain',
      text: 'こまは あいての こまが ある マスに すすむと、あいての こまを「とる」ことが できます。',
      coachText: 'とる、って どういうことか みてみよう！',
    },
    {
      type: 'explain',
      text: 'ふの まえに あいての こまが あれば、そのまま まえに すすんで とれます。',
      coachText: 'まえに すすむだけで とれるんだよ。',
      sfen: '9/9/9/9/4p4/4P4/9/9/9',
      highlights: [{ row: 5, col: 4 }, { row: 4, col: 4 }],
    },
    {
      type: 'move',
      instruction: 'ふで あいての ふを とってみよう。',
      coachText: 'じぶんの ふを まえに すすめてね。',
      sfen: '9/9/9/9/4p4/4P4/9/9/9',
      correctMove: {
        from: { row: 5, col: 4 },
        to: { row: 4, col: 4 },
      },
      successText: 'やったね！あいての ふを とれたよ。',
      failText: 'おしいね。じぶんの ふを あいての ふの マスに うごかそう。',
    },
    {
      type: 'explain',
      text: 'とった こまは「もちごま」に なります。もちごまの つかいかたは、あとで ならいます。',
      coachText: 'とった こまは また つかえるんだ。たのしみだね！',
    },
    {
      type: 'quiz',
      question: 'ふで あいての こまを とるには、どうすればいい？',
      coachText: 'さっき やったね！',
      choices: [
        'よこに うごかす',
        'まえに すすんで あいての こまの マスに いく',
        'うしろに さがる',
      ],
      correctIndex: 1,
      explanation: 'ふは まえに すすんで、あいての こまが ある マスに いくと とれます。',
    },
  ],
};
