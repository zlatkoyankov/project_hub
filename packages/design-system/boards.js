// Which faint board backdrop (boards.css) each calculator kind uses.
const BY_KIND = {
  tile: 'tiles',
  adhesive: 'tiles',
  flooring: 'planks',
  masonry: 'bricks',
  drywall: 'studs',
  insulation: 'studs',
}

export function boardFor(kind) {
  return BY_KIND[kind] ?? 'blueprint'
}
