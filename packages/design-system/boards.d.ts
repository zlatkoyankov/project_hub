export type Board = 'blueprint' | 'bricks' | 'planks' | 'studs' | 'tiles'
export function boardFor(kind: string | undefined | null): Board
