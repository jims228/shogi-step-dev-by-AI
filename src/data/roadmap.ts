/**
 * Shogi Step - World 1 Roadmap Index
 * 全レッスン・ユニット・ワールドのメタデータとエクスポート
 */
import type { Lesson, Unit, World } from '../types/lesson';

// --- Lesson Imports ---

// Unit 1-1: 将棋ってどんなゲーム？
import { W1_U1_L1_BOARD } from './lessons/w1-u1-l1-board';
import { W1_U1_L2_PIECES } from './lessons/w1-u1-l2-pieces';
import { W1_U1_L3_GOAL } from './lessons/w1-u1-l3-goal';

// Unit 1-2: 歩の動き
import { W1_U2_L1_PAWN_MOVE } from './lessons/w1-u2-l1-pawn-move';
import { W1_U2_L2_PAWN_CAPTURE } from './lessons/w1-u2-l2-pawn-capture';
import { W1_U2_L3_PAWN_DRILL } from './lessons/w1-u2-l3-pawn-drill';

// Unit 1-3: 金将の動き
import { W1_U3_L1_GOLD_MOVE } from './lessons/w1-u3-l1-gold-move';
import { W1_U3_L2_GOLD_DEFENSE } from './lessons/w1-u3-l2-gold-defense';
import { W1_U3_L3_GOLD_DRILL } from './lessons/w1-u3-l3-gold-drill';

// Unit 1-4: 銀将の動き
import { W1_U4_L1_SILVER_MOVE } from './lessons/w1-u4-l1-silver-move';
import { W1_U4_L2_GOLD_VS_SILVER } from './lessons/w1-u4-l2-gold-vs-silver';
import { W1_U4_L3_SILVER_DRILL } from './lessons/w1-u4-l3-silver-drill';

// Unit 1-5: 飛車と角行
import { W1_U5_L1_ROOK } from './lessons/w1-u5-l1-rook';
import { W1_U5_L2_BISHOP } from './lessons/w1-u5-l2-bishop';
import { W1_U5_L3_ROOK_BISHOP_DRILL } from './lessons/w1-u5-l3-rook-bishop-drill';

// Unit 1-6: World 1 まとめ
import { W1_U6_L1_REVIEW_ALL } from './lessons/w1-u6-l1-review-all';
import { W1_U6_L2_WHICH_CAN_MOVE } from './lessons/w1-u6-l2-which-can-move';
import { W1_U6_L3_CHALLENGE } from './lessons/w1-u6-l3-challenge';

// --- All Lessons ---

export const W1_LESSONS: Lesson[] = [
  W1_U1_L1_BOARD,
  W1_U1_L2_PIECES,
  W1_U1_L3_GOAL,
  W1_U2_L1_PAWN_MOVE,
  W1_U2_L2_PAWN_CAPTURE,
  W1_U2_L3_PAWN_DRILL,
  W1_U3_L1_GOLD_MOVE,
  W1_U3_L2_GOLD_DEFENSE,
  W1_U3_L3_GOLD_DRILL,
  W1_U4_L1_SILVER_MOVE,
  W1_U4_L2_GOLD_VS_SILVER,
  W1_U4_L3_SILVER_DRILL,
  W1_U5_L1_ROOK,
  W1_U5_L2_BISHOP,
  W1_U5_L3_ROOK_BISHOP_DRILL,
  W1_U6_L1_REVIEW_ALL,
  W1_U6_L2_WHICH_CAN_MOVE,
  W1_U6_L3_CHALLENGE,
];

// --- Units ---

export const W1_UNITS: Unit[] = [
  {
    id: 'w1-u1',
    title: 'しょうぎって どんな ゲーム？',
    worldId: 'w1',
    order: 1,
    lessonIds: ['w1-u1-l1', 'w1-u1-l2', 'w1-u1-l3'],
  },
  {
    id: 'w1-u2',
    title: 'ふの うごき',
    worldId: 'w1',
    order: 2,
    lessonIds: ['w1-u2-l1', 'w1-u2-l2', 'w1-u2-l3'],
  },
  {
    id: 'w1-u3',
    title: 'きんしょうの うごき',
    worldId: 'w1',
    order: 3,
    lessonIds: ['w1-u3-l1', 'w1-u3-l2', 'w1-u3-l3'],
  },
  {
    id: 'w1-u4',
    title: 'ぎんしょうの うごき',
    worldId: 'w1',
    order: 4,
    lessonIds: ['w1-u4-l1', 'w1-u4-l2', 'w1-u4-l3'],
  },
  {
    id: 'w1-u5',
    title: 'ひしゃと かくぎょう',
    worldId: 'w1',
    order: 5,
    lessonIds: ['w1-u5-l1', 'w1-u5-l2', 'w1-u5-l3'],
  },
  {
    id: 'w1-u6',
    title: 'World 1 まとめ',
    worldId: 'w1',
    order: 6,
    lessonIds: ['w1-u6-l1', 'w1-u6-l2', 'w1-u6-l3'],
  },
];

// --- World ---

export const WORLD_1: World = {
  id: 'w1',
  title: 'しょうぎの せかいへ ようこそ',
  order: 1,
  unitIds: ['w1-u1', 'w1-u2', 'w1-u3', 'w1-u4', 'w1-u5', 'w1-u6'],
};

// --- Lookup helpers ---

export function getLessonById(id: string): Lesson | undefined {
  return W1_LESSONS.find((l) => l.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return W1_UNITS.find((u) => u.id === id);
}

export function getLessonsByUnitId(unitId: string): Lesson[] {
  const unit = getUnitById(unitId);
  if (!unit) return [];
  return unit.lessonIds
    .map((id) => getLessonById(id))
    .filter((l): l is Lesson => l !== undefined);
}
