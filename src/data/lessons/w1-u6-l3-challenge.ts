/**
 * W1-U6-L3: World 1 チャレンジ
 * World 1 の総合力を確認するミニテスト
 */
import type { Lesson } from '../../types/lesson';

export const W1_U6_L3_CHALLENGE: Lesson = {
  id: 'w1-u6-l3',
  title: 'World 1 チャレンジ',
  unitId: 'w1-u6',
  worldId: 'w1',
  order: 3,
  steps: [
    {
      type: 'explain',
      text: 'World 1 の さいごの チャレンジです。いままで ならったことを つかって こたえてね！',
      coachText: 'ぜんぶ できるかな？がんばろう！',
    },
    {
      type: 'move',
      instruction: 'ふを まえに すすめよう。',
      coachText: 'きほんの きほん！',
      sfen: '9/9/9/9/9/4P4/9/9/9',
      correctMove: {
        from: { row: 5, col: 4 },
        to: { row: 4, col: 4 },
      },
      successText: 'かんぺき！',
      failText: 'ふは まえに 1マスだよ。',
    },
    {
      type: 'tap_square',
      instruction: 'きんが うごけない マスを タップしてね。',
      coachText: 'きんの にがてな ほうこうは？',
      sfen: '9/9/9/9/4G4/9/9/9/9',
      correctSquares: [
        { row: 5, col: 3 },
        { row: 5, col: 5 },
      ],
      highlights: [{ row: 4, col: 4 }],
      successText: 'そう！ななめうしろは きんの にがてな ほうこうだね。',
      failText: 'きんは ななめうしろの 2マスだけ いけないよ。',
    },
    {
      type: 'move',
      instruction: 'ぎんを ななめまえに うごかそう。',
      coachText: 'ぎんが とくいな うごき！',
      sfen: '9/9/9/9/9/9/4S4/9/9',
      correctMove: {
        from: { row: 6, col: 4 },
        to: { row: 5, col: 3 },
      },
      successText: 'すごい！ぎんの ななめの うごき、ばっちりだね。',
      failText: 'ひだりななめまえに うごかしてみよう。',
    },
    {
      type: 'quiz',
      question: 'ひしゃは たてよこ、かくは ななめ。では ぎんと きんの ちがいは？',
      coachText: 'よく かんがえてね！',
      choices: [
        'きんは ななめうしろに いけない、ぎんは よこと まうしろに いけない',
        'きんは まえに いけない、ぎんは うしろに いけない',
        'きんと ぎんは おなじ うごき',
      ],
      correctIndex: 0,
      explanation: 'きんは ななめうしろが にがて、ぎんは よこと まうしろが にがてです。にている けど ちがいます。',
    },
    {
      type: 'quiz',
      question: 'しょうぎの ばんは なんマス あるかな？',
      coachText: 'さいしょの レッスンを おもいだそう！',
      choices: ['64マス', '81マス', '100マス'],
      correctIndex: 1,
      explanation: 'たて9 かける よこ9で 81マスです。',
    },
    {
      type: 'explain',
      text: 'おめでとう！World 1 を クリアしました。ふ、きん、ぎん、ひしゃ、かく の 5つの こまを おぼえたね！',
      coachText: 'すごいよ！つぎの World も たのしみだね。',
    },
    {
      type: 'review',
      source: 'mistakes_in_unit',
      count: 5,
    },
  ],
};
