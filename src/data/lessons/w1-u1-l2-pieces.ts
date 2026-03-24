/**
 * W1-U1-L2: 駒の紹介
 * 8種類の駒、20枚ずつ、駒の向きで先手・後手を区別
 */
import type { Lesson } from '../../types/lesson';

export const W1_U1_L2_PIECES: Lesson = {
  id: 'w1-u1-l2',
  title: 'こまの しょうかい',
  unitId: 'w1-u1',
  worldId: 'w1',
  order: 2,
  steps: [
    {
      type: 'explain',
      text: 'しょうぎには 8しゅるいの こまが あります。おうしょう、ひしゃ、かくぎょう、きんしょう、ぎんしょう、けいま、きょうしゃ、ふ の 8つです。',
      coachText: 'たくさん あるけど、すこしずつ おぼえれば だいじょうぶ！',
    },
    {
      type: 'explain',
      text: 'こまは ぜんぶで 40まい。ふたりの プレイヤーが 20まいずつ もちます。',
      coachText: 'じぶんの こまと あいての こまが あるんだよ。',
      sfen: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL',
    },
    {
      type: 'explain',
      text: 'こまの むきで じぶんの こまか あいての こまか わかります。じぶんの こまは てまえ、あいての こまは むこうがわを むいています。',
      coachText: 'むきを みれば わかるよ！',
      sfen: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL',
    },
    {
      type: 'quiz',
      question: 'しょうぎの こまは ぜんぶで なんまい あるかな？',
      coachText: 'ふたりぶん あわせて かんがえてね。',
      choices: ['20まい', '40まい', '60まい'],
      correctIndex: 1,
      explanation: 'ひとり 20まいずつ、ふたりで ぜんぶ 40まいです。',
    },
    {
      type: 'quiz',
      question: 'しょうぎの こまは なんしゅるい あるかな？',
      coachText: 'さいしょに ならったね。',
      choices: ['6しゅるい', '8しゅるい', '10しゅるい'],
      correctIndex: 1,
      explanation: 'しょうぎの こまは 8しゅるい あります。ぜんぶ おぼえなくても、すこしずつ れんしゅう しようね。',
    },
  ],
};
