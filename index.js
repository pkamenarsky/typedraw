const canvas = require('canvas');
const fs = require('fs');

function draw(file, typemap, text) {
  const cvs = new canvas(1280, 480);
  const ctx = cvs.getContext('2d');

  const lines = text.match(/[^\r\n]+/g);

  ctx._setFont('500', 'normal', 18, 'px', 'Fira Code');

  const x = 18;
  const y = 18;

  const spacing = 10.8;
  const leading = 36;

  const offset_y = -18;
  const offset_x = -2;
  const size = 27;

  lines.forEach((line, line_index) => {
    // ctx.fillText(line, x, y + line_index * leading);

    let char_index = 0;
    line.split(' ').forEach((word) => {
      if (typemap[word] !== undefined) {
        typemap[word].forEach(([nx, ny, nw, nh, color]) => {
          ctx.fillStyle = color;
          ctx.fillRect(
            nx * size + x + char_index * spacing + offset_x,
            ny * size + y + line_index * leading + offset_y,
            nw * size,
            nh * size
          );
        });

        char_index += 3;
      }
      else {
        ctx.fillStyle = '#333';
        ctx.fillText(word, x + char_index * spacing, y + line_index * leading);

        // word.split('').forEach((c) => {
        //   ctx.fillText(c, x + char_index * spacing, y + line_index * leading);
        //   char_index++;
        // });

        char_index += word.length + 1;
      }
    });
  });

  fs.writeFileSync(file, cvs.toBuffer());
}

const typemap = {
  'st': [
    [ 0, 0, 1, 1, '#333' ],
    [ 0.25, 0.25, 0.5, 0.5, '#D4145A' ]
  ],
  'stt': [
    [ 0.25, 0.25, 0.5, 0.5, '#D4145A' ]
  ],
  'k': [
    [ 0.25, 0.25, 0.5, 0.5, '#29ABE2' ]
  ],
  'v': [
    [ 0.25, 0.25, 0.5, 0.5, '#F7931E' ]
  ]
};

const text =
      'foreach :: ( k × v -> k × v -> Ordering ) \n' +
      '           ( v -> Boolean ) \n' +
      '        -> Lens st stt                             | stt ~ Map k v\n' +
      '        -> ( Lens st v -> ( st -> st ) -> Component st )\n' +
      '        -> Component st\n';

const zoom =
      'zoom :: Lens st stt -> Component stt -> Component st';

const zoomUn =
      'zoomUn :: Lens st stt -> (((Component st -> Component stt ) -> Component stt ) -> Component st';

draw('out.png', typemap, text);
