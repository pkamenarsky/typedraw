const canvas = require('canvas');
const fs = require('fs');

function intersperse(a, x) {
  return [].concat(...a.map(e => [x, e])).slice(1);
}

function splitConcat(words, str) {
  return [].concat.apply([], words.map((w) => intersperse(w.split(str), str)));
}

function draw(file, typemap, text) {
  const lines = text.split(/\r?\n/);

  const x = 36;
  const y = 36;

  const spacing = 10.8;
  const leading = 36;

  const offset_y = -19;
  const offset_x = 3;
  const size = 27;

  let max_length = 0;

  lines.forEach((line) => {
    max_length = Math.max(max_length, line.length);
  });

  const cvs = new canvas(x + (max_length + 3) * spacing, y + lines.length * leading);
  const ctx = cvs.getContext('2d');

  ctx._setFont('500', 'normal', 18, 'px', 'Fira Code');

  lines.forEach((line, line_index) => {
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

if (process.argv.length < 4) {
  console.log('Usage: node index.js <typemap.json> <out.png>');
}
else {
  const typemap = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
  const data = fs.readFileSync('/dev/stdin').toString();
  console.log('Writing to ', process.argv[3]);
  draw(process.argv[3], typemap, data);
}
