/**
 * Roadmap data: World / Unit / Lesson metadata
 * Builder-B will define full types; this is a minimal working version.
 */

export interface LessonMeta {
  id: string;
  title: string;
}

export interface UnitMeta {
  id: string;
  title: string;
  lessons: LessonMeta[];
}

export interface WorldMeta {
  id: string;
  title: string;
  units: UnitMeta[];
}

/** World 1 placeholder data */
export const worlds: WorldMeta[] = [
  {
    id: 'w1',
    title: 'World 1: はじめての将棋',
    units: [
      {
        id: 'w1-u1',
        title: '将棋のルール',
        lessons: [
          { id: 'w1-u1-l1', title: '将棋盤と駒' },
          { id: 'w1-u1-l2', title: '駒の並べ方' },
          { id: 'w1-u1-l3', title: '勝ち方（王を詰ます）' },
        ],
      },
      {
        id: 'w1-u2',
        title: '駒の動かし方（前編）',
        lessons: [
          { id: 'w1-u2-l1', title: '歩兵の動き' },
          { id: 'w1-u2-l2', title: '金将の動き' },
          { id: 'w1-u2-l3', title: '銀将の動き' },
        ],
      },
      {
        id: 'w1-u3',
        title: '駒の動かし方（後編）',
        lessons: [
          { id: 'w1-u3-l1', title: '飛車の動き' },
          { id: 'w1-u3-l2', title: '角行の動き' },
          { id: 'w1-u3-l3', title: '桂馬・香車の動き' },
        ],
      },
      {
        id: 'w1-u4',
        title: '成りと持ち駒',
        lessons: [
          { id: 'w1-u4-l1', title: '成りのルール' },
          { id: 'w1-u4-l2', title: '持ち駒を使う' },
          { id: 'w1-u4-l3', title: 'まとめクイズ' },
        ],
      },
    ],
  },
];
