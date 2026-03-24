/**
 * W1-U6-L1: 5つの駒を振り返ろう
 * World 1で学んだ全駒の総復習
 */
import type { Lesson } from '../../types/lesson';

export const W1_U6_L1_REVIEW_ALL: Lesson = {
  id: 'w1-u6-l1',
  title: '5つの こまを ふりかえろう',
  unitId: 'w1-u6',
  worldId: 'w1',
  order: 1,
  steps: [
    {
      type: 'explain',
      text: 'ここまでに 5つの こまを ならいました。ふ、きん、ぎん、ひしゃ、かく。ふりかえって みましょう。',
      coachText: 'よく がんばったね！おさらい しよう。',
    },
    {
      type: 'quiz',
      question: 'まえに 1マスだけ うごける こまは どれ？',
      coachText: 'いちばん さいしょに ならった こまだよ。',
      choices: ['きんしょう', 'ふ', 'ひしゃ'],
      correctIndex: 1,
      explanation: 'ふは まえに 1マスだけ うごけます。いちばん シンプルな こまです。',
    },
    {
      type: 'quiz',
      question: '6ほうこうに うごけて、おうを まもるのが とくいな こまは？',
      coachText: 'まもりの こまだったね。',
      choices: ['ぎんしょう', 'ふ', 'きんしょう'],
      correctIndex: 2,
      explanation: 'きんしょうは 6ほうこうに うごけて、おうの そばで まもるのが やくわりです。',
    },
    {
      type: 'quiz',
      question: '5ほうこうに うごけて、せめるのが とくいな こまは？',
      coachText: 'ななめうしろにも いけたね。',
      choices: ['ぎんしょう', 'きんしょう', 'ふ'],
      correctIndex: 0,
      explanation: 'ぎんしょうは 5ほうこうに うごけます。ななめに うごけるので、せめに むいています。',
    },
    {
      type: 'quiz',
      question: 'たてと よこに なんマスでも うごける こまは？',
      coachText: 'じゅうじの かたち！',
      choices: ['かくぎょう', 'ひしゃ', 'きんしょう'],
      correctIndex: 1,
      explanation: 'ひしゃは たてと よこに なんマスでも うごけます。じゅうじ（＋）の かたちです。',
    },
    {
      type: 'quiz',
      question: 'ななめに なんマスでも うごける こまは？',
      coachText: 'バツの かたち！',
      choices: ['ひしゃ', 'ぎんしょう', 'かくぎょう'],
      correctIndex: 2,
      explanation: 'かくぎょうは ななめに なんマスでも うごけます。バツ（X）の かたちです。',
    },
  ],
};
