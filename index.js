const canvas = require('canvas');
const fs = require('fs');

function intersperse(a, x) {
  return [].concat(...a.map(e => [x, e])).slice(1);
}

function splitConcat(words, str) {
  return [].concat.apply([], words.map((w) => intersperse(w.split(str), str)));
}

function draw(file, typemap, text) {
  const cvs = new canvas(1280, 480);
  const ctx = cvs.getContext('2d');

  const lines = text.match(/[^\r\n]+/g);

  ctx._setFont('500', 'normal', 18, 'px', 'Fira Code');

  const x = 20;
  const y = 20;

  const spacing = 10.8;
  const leading = 36;

  const offset_y = -19;
  const offset_x = 3;
  const size = 27;

  lines.forEach((line, line_index) => {
    // ctx.fillText(line, x, y + line_index * leading);

    let adjust = 0;
    Object.entries(typemap).forEach(([k, v]) => {
      const re = new RegExp('\\b' + k + '\\b', 'g');

      while ((match = re.exec(line)) != null) {
        v.forEach(([type, color, nx, ny, nw, nh ]) => {
          ctx.fillStyle = color;

          switch (type) {
          case 'rect':
            ctx.fillRect(
              nx * size + x + match.index * spacing - ((3 - k.length) / 2 * spacing) + offset_x,
              ny * size + y + line_index * leading + offset_y,
              nw * size,
              nh * size
            );
            break;

          case 'circle':
            ctx.beginPath();
            r = nw;
            ctx.arc(
              nx * k.length * spacing + x + match.index * spacing,
              ny * size + y + line_index * leading - leading / 2 - 1,
              r * size,
              0,
              2 * Math.PI
            );
            ctx.fill();
            break;
          }
        });
      }

      line = line.replace(re, ' '.repeat(k.length));
    });

    ctx.fillStyle = '#333';
    ctx.fillText(line, x, y + line_index * leading);
  });

  fs.writeFileSync(file, cvs.toBuffer());
}

const typemap = {
  'st1': [
    [ 'rect', '#333', 0, 0, 1, 1 ],
    [ 'rect', '#D4145A', 0.25, 0.25, 0.5, 0.5 ]
  ],
  's': [
    [ 'rect', '#D4145A', 0.25, 0.25, 0.5, 0.5 ]
  ],
  'k': [
    [ 'rect', '#29ABE2', 0.25, 0.25, 0.5, 0.5 ]
  ],
  'v': [
    [ 'rect', '#F7931E', 0.25, 0.25, 0.5, 0.5 ]
  ],
};

const typemap2 = {
  'st': [
    [ 'circle', '#333', 0.5, 0.5, 0.5 ],
    [ 'circle', '#D4145A', 0.5, 0.5, 0.25 ]
  ],
  's': [
    [ 'circle', '#D4145A', 0.5, 0.5, 0.25 ]
  ],
  'k': [
    [ 'circle', '#29ABE2', 0.5, 0.5, 0.25 ]
  ],
  'v': [
    [ 'circle', '#F7931E', 0.5, 0.5, 0.25 ]
  ]
};

const text =
      'foreach :: (k × v -> k × v -> Ordering)\n' +
      '        -> (v -> Boolean)\n' +
      '        -> Lens st s                              -- | s ~ Map k v\n' +
      '        -> (Lens st v -> (st -> st) -> Component st)\n' +
      '        -> Component st\n';

const zoom =
      'zoom :: Lens st s -> Component s -> Component st';

const zoomUn =
      'zoomUn :: Lens st s -> (((Component u -> Component s) -> Component s) -> Component st';

draw('out.png', typemap2, zoomUn);
