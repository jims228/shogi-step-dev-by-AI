/**
 * W1-U1-L3: 将棋の目的
 * 王を詰ませることがゴール
 */
import type { Lesson } from '../../types/lesson';

export const W1_U1_L3_GOAL: Lesson = {
  id: 'w1-u1-l3',
  title: 'しょうぎの もくてき',
  unitId: 'w1-u1',
  worldId: 'w1',
  order: 3,
  steps: [
    {
      type: 'explain',
      text: 'しょうぎの もくてきは、あいての「おう」を つかまえる ことです。これを「つみ」と いいます。',
      coachText: 'おうを つかまえたら かちだよ！',
    },
    {
      type: 'explain',
      text: 'おうは いちばん たいせつな こまです。おうが にげられなく なったら まけに なります。',
      coachText: 'おうを まもるのが だいじなんだ。',
      sfen: '9/9/9/9/4K4/9/9/9/9',
      highlights: [{ row: 4, col: 4 }],
    },
    {
      type: 'explain',
      text: '「つみ」とは、あいての おうが どこにも にげられない じょうたいの ことです。くわしくは あとで ならうよ。',
      coachText: 'いまは「おうを つかまえる」って おぼえておこう！',
    },
    {
      type: 'quiz',
      question: 'しょうぎで かつには、あいての なにを つかまえればいい？',
      coachText: 'さっき ならったね！',
      choices: ['ふ', 'おう', 'ひしゃ'],
      correctIndex: 1,
      explanation: 'あいての「おう」を つかまえたら かちです。おうが いちばん だいじな こまです。',
    },
    {
      type: 'quiz',
      question: 'しょうぎで いちばん たいせつな こまは どれかな？',
      coachText: 'まもらなきゃ いけない こまだよ。',
      choices: ['きんしょう', 'ひしゃ', 'おうしょう'],
      correctIndex: 2,
      explanation: 'おうしょう（おう）が いちばん たいせつです。おうを とられたら まけなので、しっかり まもりましょう。',
    },
  ],
};
