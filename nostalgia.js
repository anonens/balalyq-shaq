(function (global) {
  'use strict';
  var TAU = Math.PI * 2;

  function loadImage(src) {
    var image = new Image();
    var ready = new Promise(function (resolve) {
      image.onload = function () { resolve(image); };
      image.onerror = function () { resolve(null); };
    });
    image.src = src;
    return { image: image, ready: ready };
  }

  /* Use the actual photographed print, rather than the previous 1990s scans.
     Sampling is done at render time; the uploaded reference is kept intact. */
  function createChips() {
    var source = loadImage('nostalgia/chips-reference.png');
    var defs = [
      { id: 'blue-48', name: 'SpongeBob · 48 point', series: 'Көк фишкалар', blue: true, point: 48 },
      { id: 'hero-hulk', name: 'Hulk', series: 'Суперқаһармандар', blue: false, atk: 658522, def: 625482 },
      { id: 'blue-13', name: 'SpongeBob · 13 point', series: 'Көк фишкалар', blue: true, point: 13 },
      { id: 'hero-82', name: 'Hulk · Күш', series: 'Суперқаһармандар', blue: false, atk: 825482, def: 825482 },
      { id: 'blue-22', name: 'SpongeBob · 22 point', series: 'Көк фишкалар', blue: true, point: 22 },
      { id: 'hero-52', name: 'Hulk · Қорғаныс', series: 'Суперқаһармандар', blue: false, atk: 458452, def: 485256 },
      { id: 'blue-02', name: 'SpongeBob · 02 point', series: 'Көк фишкалар', blue: true, point: 2 },
      { id: 'hero-72', name: 'Hulk · Аула чемпионы', series: 'Суперқаһармандар', blue: false, atk: 525482, def: 585222 }
    ];
    defs.forEach(function (def, i) { def.n = i + 1; def.rare = i === 7; });
    function draw(context, def, radius, back) {
      var reverse = back === true;
      context.save();
      context.beginPath(); context.arc(0, 0, radius, 0, TAU); context.clip();
      var gradient = context.createLinearGradient(-radius, -radius, radius, radius);
      gradient.addColorStop(0, '#edfaff'); gradient.addColorStop(.22, '#18b4eb');
      gradient.addColorStop(.51, '#e6faff'); gradient.addColorStop(.75, '#047ab8'); gradient.addColorStop(1, '#a9eaff');
      context.fillStyle = gradient; context.fillRect(-radius, -radius, radius * 2, radius * 2);
      if (!reverse && source.image.complete && source.image.naturalWidth) {
        context.save();
        context.beginPath(); context.arc(0, 0, radius * .965, 0, TAU); context.clip();
        if (def.blue) {
          context.rotate(-2.36);
          context.drawImage(source.image, 704, 390, 329, 329, -radius, -radius, radius * 2, radius * 2);
        } else {
          context.drawImage(source.image, 146, 957, 260, 260, -radius, -radius, radius * 2, radius * 2);
        }
        context.restore();
      }
      if (reverse) {
        for (var i = 0; i < 12; i++) {
          context.save(); context.rotate(i * TAU / 12);
          context.fillStyle = i % 2 ? '#ffffff60' : '#006da64d';
          context.beginPath(); context.moveTo(0, 0); context.lineTo(radius, 0); context.lineTo(radius, radius * .3); context.fill();
          context.restore();
        }
        context.fillStyle = '#ffffffdc'; context.beginPath(); context.arc(0, 0, radius * .69, 0, TAU); context.fill();
        context.textAlign = 'center'; context.fillStyle = '#087fb8';
        context.font = '900 ' + radius * .24 + 'px Arial, sans-serif';
        context.fillText('POINT', 0, -radius * .2);
        context.font = '900 ' + radius * .55 + 'px Arial, sans-serif';
        context.fillText(def.blue ? String(def.point).padStart(2, '0') : '★', 0, radius * .31);
      } else {
        /* Score bands also keep the edge of the photographed hand out of view. */
        context.fillStyle = def.blue ? '#e7faff' : '#102638f2';
        context.fillRect(-radius, radius * (def.blue ? .45 : .58), radius * 2, radius * .55);
        context.textAlign = 'center';
        context.font = '900 ' + radius * (def.blue ? .18 : .105) + 'px Arial, sans-serif';
        if (def.blue) {
          context.fillStyle = '#073549'; context.fillText(String(def.point).padStart(2, '0') + ' point', 0, radius * .77);
        } else {
          context.fillStyle = '#ff8f75'; context.fillText('ATK ' + def.atk, 0, radius * .73);
          context.fillStyle = '#f7fcff'; context.fillText('DEF ' + def.def, 0, radius * .89);
        }
      }
      context.strokeStyle = '#f4fbffcc'; context.lineWidth = radius * .025;
      context.beginPath(); context.arc(0, 0, radius * .98, 0, TAU); context.stroke();
      if (back === 'locked') {
        context.fillStyle = '#e9f4f0b0'; context.fillRect(-radius, -radius, radius * 2, radius * 2);
      }
      context.restore();
    }
    function paint(canvas, def, back) {
      var context = canvas.getContext('2d'), size = canvas.width;
      context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, size, size);
      context.translate(size / 2, size / 2); draw(context, def, size / 2 - 1, back);
    }
    function render(def, size, back) {
      var canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
      paint(canvas, def, back); return canvas;
    }
    function asykShape(c, r) {
      c.beginPath(); c.moveTo(-r, -.25 * r);
      c.bezierCurveTo(-1.08 * r, -.75 * r, -.58 * r, -.75 * r, -.42 * r, -.5 * r);
      c.bezierCurveTo(-.17 * r, -.33 * r, .17 * r, -.33 * r, .42 * r, -.5 * r);
      c.bezierCurveTo(.58 * r, -.75 * r, 1.08 * r, -.75 * r, r, -.25 * r);
      c.lineTo(r, .25 * r); c.bezierCurveTo(1.08 * r, .75 * r, .58 * r, .75 * r, .42 * r, .5 * r);
      c.bezierCurveTo(.17 * r, .33 * r, -.17 * r, .33 * r, -.42 * r, .5 * r);
      c.bezierCurveTo(-.58 * r, .75 * r, -1.08 * r, .75 * r, -r, .25 * r); c.closePath();
    }
    return {
      DEFS: defs, ready: source.ready, draw: draw, paint: paint, render: render,
      pick: function () { return defs[Math.floor(Math.random() * defs.length)]; },
      asykShape: asykShape, setSprites: function () {}, setLogo: function () {}
    };
  }

  function createFactController(element, reduce) {
    var timer = 0, hideTimer = 0, selected = null, version = 0;
    function hide() {
      selected = null; version++; clearTimeout(timer); clearTimeout(hideTimer);
      element.classList.remove('is-visible');
      hideTimer = setTimeout(function () { element.hidden = true; }, reduce ? 0 : 460);
    }
    document.addEventListener('pointerdown', hide, { passive: true });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') hide(); });
    window.addEventListener('blur', hide);
    function show(item, event) {
      clearTimeout(timer); clearTimeout(hideTimer); selected = item;
      var token = ++version; element.textContent = item.fact; element.hidden = false;
      var x = event ? event.clientX : innerWidth / 2, y = event ? event.clientY : innerHeight / 2;
      element.style.left = Math.max(12, Math.min(x + 12, innerWidth - element.offsetWidth - 12)) + 'px';
      element.style.top = Math.max(12, Math.min(y - element.offsetHeight - 20, innerHeight - element.offsetHeight - 12)) + 'px';
      requestAnimationFrame(function () { if (version === token) element.classList.add('is-visible'); });
      timer = setTimeout(hide, 5200);
    }
    return { show: show, hide: hide, current: function () { return selected; } };
  }

  /* Small, real mesh models. The same factories serve the floating scene and
     the courtyard viewer; no model CDN or third-party API is required. */
  function createModels(T) {
    var materialCache = {};
    function material(color, options) {
      if (!options && materialCache[color]) return materialCache[color];
      var settings = { color: new T.Color(color).convertSRGBToLinear(), roughness: .43, metalness: 0 };
      for (var k in options) settings[k] = options[k];
      var result = new T.MeshStandardMaterial(settings);
      if (!options) materialCache[color] = result; return result;
    }
    function put(group, geometry, color, x, y, z, options) {
      var mesh = new T.Mesh(geometry, material(color, options)); mesh.position.set(x || 0, y || 0, z || 0); group.add(mesh); return mesh;
    }
    function box(group, w, h, d, color, x, y, z) {
      return put(group, new T.BoxGeometry(w, h, d), color, x, y, z);
    }
    function ball(group, x, y, z, rx, ry, rz, color) {
      var mesh = put(group, new T.SphereGeometry(1, 20, 14), color, x, y, z);
      mesh.scale.set(rx, ry, rz); return mesh;
    }
    function roundGeometry(w, h, d, r) {
      var shape = new T.Shape(), x = -w / 2, y = -h / 2;
      shape.moveTo(x + r, y); shape.lineTo(x + w - r, y); shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r); shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h); shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
      var geometry = new T.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: .035, bevelSize: .035, bevelSegments: 3, curveSegments: 6 });
      geometry.center(); return geometry;
    }
    function round(group, w, h, d, color, x, y, z, r) {
      return put(group, roundGeometry(w, h, d, r || .08), color, x, y, z);
    }
    function rod(group, a, b, radius, color) {
      var from = new T.Vector3(a[0], a[1], a[2]), to = new T.Vector3(b[0], b[1], b[2]);
      var mesh = put(group, new T.CylinderGeometry(radius, radius * .96, from.distanceTo(to), 10), color);
      mesh.position.copy(from).add(to).multiplyScalar(.5);
      mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), to.clone().sub(from).normalize()); return mesh;
    }
    function texture(w, h, draw, pixel) {
      var canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      draw(canvas.getContext('2d'), w, h);
      var map = new T.CanvasTexture(canvas); map.encoding = T.sRGBEncoding;
      if (pixel) { map.magFilter = map.minFilter = T.NearestFilter; map.generateMipmaps = false; }
      return map;
    }
    function label(group, text, w, h, x, y, z, color) {
      var map = texture(256, 64, function (c) {
        c.fillStyle = color || '#ffffff'; c.font = '900 44px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 128, 35);
      });
      var mesh = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: map, transparent: true, depthWrite: false }));
      mesh.position.set(x, y, z); group.add(mesh); return mesh;
    }
    function eyes(group, y, z, skin) {
      [-1, 1].forEach(function (side) {
        ball(group, side * .105, y, z, .072, .085, .035, '#ffffff');
        ball(group, side * .105, y - .004, z + .03, .032, .047, .015, skin || '#367f96');
        ball(group, side * .105, y - .005, z + .044, .017, .031, .008, '#172235');
        ball(group, side * .105 - .009, y + .018, z + .05, .009, .012, .005, '#ffffff');
      });
    }
    function smile(group, y, z, color) {
      var curve = new T.CatmullRomCurve3([new T.Vector3(-.065, y + .025, z), new T.Vector3(0, y, z + .01), new T.Vector3(.065, y + .025, z)]);
      put(group, new T.TubeGeometry(curve, 10, .009, 5, false), color || '#a2524f');
    }

    function makeSteve() {
      var group = new T.Group(), head = new T.Group(); group.add(head);
      var face = texture(16, 16, function (c) {
        c.fillStyle = '#b88665'; c.fillRect(0, 0, 16, 16);
        c.fillStyle = '#32251f'; c.fillRect(0, 0, 16, 4); c.fillRect(0, 4, 2, 5); c.fillRect(14, 4, 2, 5);
        c.fillStyle = '#e3cbb8'; c.fillRect(3, 7, 4, 2); c.fillRect(9, 7, 4, 2);
        c.fillStyle = '#5553b2'; c.fillRect(5, 7, 2, 2); c.fillRect(9, 7, 2, 2);
        c.fillStyle = '#8d5844'; c.fillRect(7, 9, 2, 3);
        c.fillStyle = '#4e3027'; c.fillRect(5, 12, 6, 3); c.fillStyle = '#9d684d'; c.fillRect(7, 12, 2, 1);
      }, true);
      var skin = material('#b88665'), hair = material('#32251f');
      var faceMat = new T.MeshStandardMaterial({ map: face, roughness: .9 });
      var mesh = new T.Mesh(new T.BoxGeometry(.72, .72, .72), [hair, hair, hair, skin, faceMat, hair]); mesh.position.y = .98; head.add(mesh);
      box(group, .75, .94, .4, '#14b7bc', 0, .17, 0);
      box(group, .22, .20, .42, '#a7795e', 0, .57, .012);
      [-1, 1].forEach(function (side) {
        box(group, .27, .35, .4, '#14b7bc', side * .52, .47, 0);
        box(group, .27, .62, .4, '#b88665', side * .52, -.015, 0);
        box(group, .35, .91, .4, '#4945a5', side * .20, -.75, 0);
        box(group, .35, .16, .44, '#39394c', side * .20, -1.25, .02);
      });
      var pickaxe = new T.Group(); pickaxe.position.set(.8, -.06, .18); pickaxe.rotation.z = -.4; group.add(pickaxe);
      box(pickaxe, .08, .66, .08, '#715133', 0, 0, 0);
      for (var i = 0; i < 6; i++) box(pickaxe, .11, .1, .11, '#29d7cc', -.2 + i * .1, .32 - Math.max(0, i - 3) * .08, 0);
      return group;
    }
    function makeCreeper() {
      var group = new T.Group();
      function greenFace(withFace) {
        return texture(16, 16, function (c) {
          var colors = ['#42972e', '#6bb83e', '#88cf55', '#2f7429', '#a3d36c'];
          for (var y = 0; y < 16; y += 2) for (var x = 0; x < 16; x += 2) {
            c.fillStyle = colors[(x * 13 + y * 7 + x * y) % colors.length]; c.fillRect(x, y, 2, 2);
          }
          if (withFace) {
            c.fillStyle = '#101c14'; c.fillRect(3, 4, 4, 4); c.fillRect(9, 4, 4, 4);
            c.fillRect(6, 8, 4, 5); c.fillRect(4, 10, 3, 5); c.fillRect(9, 10, 3, 5);
          }
        }, true);
      }
      var bodyMat = new T.MeshStandardMaterial({ map: greenFace(false), roughness: 1 });
      var faceMat = new T.MeshStandardMaterial({ map: greenFace(true), roughness: 1 });
      var head = new T.Mesh(new T.BoxGeometry(.81, .81, .81), [bodyMat, bodyMat, bodyMat, bodyMat, faceMat, bodyMat]); head.position.y = .82; group.add(head);
      var body = new T.Mesh(new T.BoxGeometry(.56, .91, .4), bodyMat); body.position.y = -.02; group.add(body);
      [-1, 1].forEach(function (x) { [-1, 1].forEach(function (z) {
        var foot = new T.Mesh(new T.BoxGeometry(.32, .46, .42), bodyMat); foot.position.set(x * .23, -.7, z * .24); group.add(foot);
      }); });
      return group;
    }
    function makeJake() {
      var group = new T.Group(), skin = '#e7b590', blue = '#479cd5';
      round(group, .61, .74, .38, '#f4f3e9', 0, .08, 0, .14);
      round(group, .22, .67, .13, blue, -.22, .1, .21, .06); round(group, .22, .67, .13, blue, .22, .1, .21, .06);
      label(group, 'J', .15, .08, -.22, .14, .325, '#f7f4e8');
      ball(group, 0, .79, .02, .37, .42, .33, skin);
      ball(group, -.31, .79, .02, .075, .11, .07, skin); ball(group, .31, .79, .02, .075, .11, .07, skin);
      ball(group, -.28, .99, -.04, .13, .27, .25, '#65422a'); ball(group, .28, .99, -.04, .13, .27, .25, '#65422a');
      eyes(group, .83, .31, '#76523b'); ball(group, 0, .73, .355, .06, .065, .065, skin); smile(group, .63, .317);
      [-1, 1].forEach(function (side) {
        var brow = round(group, .16, .036, .025, '#51372a', side * .115, .96, .315, .012); brow.rotation.z = -side * .09;
      });
      put(group, new T.SphereGeometry(.39, 24, 12, 0, TAU, 0, Math.PI / 2), '#e24438', 0, 1.04, 0);
      round(group, .44, .07, .36, '#d33530', 0, 1.055, -.35, .06);
      round(group, .32, .18, .04, '#faf7e9', 0, 1.15, .32, .04);
      label(group, 'J', .12, .095, 0, 1.16, .385, '#d73836');
      [-1, 1].forEach(function (side) {
        rod(group, [side * .28, .32, 0], [side * .48, -.06, .05], .12, '#f5f5ed');
        rod(group, [side * .48, -.06, .05], [side * .42, -.36, .19], .10, '#f5f5ed');
        ball(group, side * .42, -.38, .19, .105, .12, .09, '#3e4b50');
        round(group, .25, .72, .31, '#467bb0', side * .17, -.63, 0, .05);
        round(group, .30, .18, .51, '#63a74b', side * .18, -1.04, .11, .06);
        round(group, .32, .07, .53, '#f8f1df', side * .18, -1.13, .11, .025);
        round(group, .27, .07, .12, '#d84236', side * .18, -1.02, .36, .025);
      });
      rod(group, [.43, -.3, .23], [.43, .06, .23], .075, '#79bf39');
      ball(group, .43, .07, .23, .07, .04, .07, '#dededb');
      return group;
    }
    function makeDoll(monster) {
      var group = new T.Group(), skin = monster ? '#f2c2d4' : '#edbd9f', hair = monster ? '#25232f' : '#efc451', pink = monster ? '#e63f97' : '#f47dc0';
      ball(group, 0, .82, .02, .28, .34, .26, skin);
      ball(group, 0, .91, -.15, .32, .4, .23, hair);
      [-1, 1].forEach(function (side) {
        var lock = ball(group, side * .26, .49, -.16, .14, .65, .15, hair); lock.rotation.z = side * -.13;
        if (monster) {
          var stripe = ball(group, side * .31, .45, -.04, .048, .58, .06, pink); stripe.rotation.z = side * -.13;
          ball(group, side * .30, .94, -.10, .13, .13, .12, pink);
        }
        ball(group, side * .19, 1.065, .14, .15, .08, .16, hair);
      });
      eyes(group, .86, .257, monster ? '#ab5e95' : '#398dca'); smile(group, .68, .246, '#c14977');
      ball(group, 0, .77, .279, .035, .041, .035, skin);
      rod(group, [0, .39, 0], [0, .55, 0], .08, skin);
      put(group, new T.CylinderGeometry(.17, .22, .52, 16), pink, 0, .16, 0);
      put(group, new T.CylinderGeometry(.21, .52, .63, 24), monster ? '#292434' : '#ef67b2', 0, -.40, 0);
      [-1, 1].forEach(function (side) {
        rod(group, [side * .17, .35, 0], [side * .34, -.02, .03], .065, skin);
        rod(group, [side * .34, -.02, .03], [side * .28, -.32, .13], .055, skin);
        ball(group, side * .28, -.34, .13, .064, .09, .05, skin);
        rod(group, [side * .16, -.66, 0], [side * .17, -1.12, 0], .065, monster ? '#69505e' : skin);
        round(group, .17, monster ? .29 : .12, .29, monster ? '#dd4496' : '#e84aa0', side * .17, -1.15, .06, .045);
      });
      if (monster) {
        label(group, '♥', .10, .09, -.19, .72, .24, '#db4788');
        round(group, .29, .10, .05, '#f3f2ee', 0, .39, .16, .02);
      } else {
        for (var i = 0; i < 9; i++) ball(group, Math.sin(i * .35 - 1.4) * .15, .39 - Math.cos(i * .35 - 1.4) * .065, .17, .018, .018, .018, '#fff2d2');
        for (var j = 0; j < 10; j++) {
          var a = j * TAU / 10; rod(group, [Math.sin(a) * .24, -.14, Math.cos(a) * .24], [Math.sin(a) * .49, -.68, Math.cos(a) * .49], .008, '#ffd4ed');
        }
      }
      return group;
    }
    function makeBird() {
      var group = new T.Group();
      ball(group, 0, 0, 0, .72, .67, .6, '#df3b32');
      ball(group, 0, -.25, .43, .49, .39, .18, '#f6dfbd');
      [-1, 1].forEach(function (side) {
        ball(group, side * .22, .19, .51, .21, .23, .12, '#ffffff');
        ball(group, side * .17, .18, .62, .07, .09, .03, '#181d24');
        var brow = box(group, .47, .10, .11, '#231f21', side * .23, .40, .58); brow.rotation.z = side * .25;
      });
      var beak = put(group, new T.ConeGeometry(.23, .42, 4), '#ffb637', 0, -.02, .77); beak.rotation.x = Math.PI / 2;
      var tuft = ball(group, -.12, .68, -.04, .10, .28, .10, '#d92f2c'); tuft.rotation.z = -.35;
      tuft = ball(group, .04, .69, -.07, .08, .23, .08, '#d92f2c'); tuft.rotation.z = .25;
      [-1, 0, 1].forEach(function (i) { var tail = box(group, .13, .45, .08, '#26212a', .04 + i * .10, .13, -.62); tail.rotation.x = -.8; tail.rotation.z = i * .4; });
      return group;
    }
    function makeSega() {
      var group = new T.Group();
      round(group, 3.35, 1.68, .35, '#151d29', 0, 0, 0, .14);
      round(group, 3.28, 1.62, .075, '#247ac2', 0, 0, .17, .13);
      round(group, 3.22, 1.55, .08, '#222b39', 0, 0, .22, .12);
      round(group, 1.96, 1.35, .065, '#080f1b', 0, .035, .28, .065);
      var map = texture(512, 320, function (c) {
        c.fillStyle = '#236bd7'; c.fillRect(0, 0, 512, 320);
        c.fillStyle = '#ffffff'; for (var i = 0; i < 5; i++) c.fillRect(i * 120 + 20, 40 + i % 2 * 25, 60, 13);
        for (var y = 235; y < 320; y += 22) for (var x = 0; x < 512; x += 22) { c.fillStyle = (x / 22 + y / 22) % 2 ? '#a55c20' : '#62361d'; c.fillRect(x, y, 22, 22); }
        c.fillStyle = '#78cf32'; c.fillRect(0, 219, 512, 20); c.strokeStyle = '#ffe450'; c.lineWidth = 5;
        for (var j = 0; j < 8; j++) { c.beginPath(); c.arc(230 + j * 30, 184, 9, 0, TAU); c.stroke(); }
        c.fillStyle = '#1a78ef'; c.beginPath(); c.arc(169, 190, 25, 0, TAU); c.fill();
        c.fillStyle = '#ffffff'; c.fillRect(160, 171, 20, 12); c.fillStyle = '#ef4932'; c.fillRect(145, 216, 25, 8);
        c.fillStyle = '#fff557'; c.font = 'bold 19px monospace'; c.fillText('SCORE  2012', 18, 27);
      }, true);
      var image = loadImage('nostalgia/sega-reference.jpg');
      image.ready.then(function (loaded) {
        if (!loaded) return;
        var c = map.image.getContext('2d'); c.drawImage(loaded, 370, 169, 652, 407, 0, 0, 512, 320); map.needsUpdate = true;
      });
      var screen = new T.Mesh(new T.PlaneGeometry(1.75, 1.08), new T.MeshBasicMaterial({ map: map, toneMapped: false })); screen.position.set(0, .07, .36); group.add(screen);
      round(group, .57, .17, .10, '#0b111b', -1.28, .18, .33, .03);
      round(group, .17, .57, .10, '#0b111b', -1.28, .18, .33, .03);
      [['Y', 0, .25], ['X', -.22, .03], ['B', .22, .03], ['A', 0, -.19]].forEach(function (button) {
        var mesh = put(group, new T.CylinderGeometry(.115, .115, .07, 18), '#101823', 1.27 + button[1], .12 + button[2], .33); mesh.rotation.x = Math.PI / 2;
        label(group, button[0], .10, .065, 1.27 + button[1], .12 + button[2], .373, '#c9d2dd');
      });
      for (var sy = 0; sy < 3; sy++) for (var sx = 0; sx < 4; sx++) ball(group, -1.43 + sx * .09, -.43 - sy * .08, .306, .022, .022, .012, '#060c13');
      label(group, 'SEGA', .5, .11, 0, -.61, .36, '#e2e7ee');
      round(group, .18, .055, .045, '#080e18', 1.04, -.57, .29, .02);
      round(group, .18, .055, .045, '#080e18', 1.39, -.57, .29, .02);
      label(group, 'SELECT  START', .62, .045, 1.22, -.69, .30, '#c5cdd5');
      round(group, 1.5, .96, .025, '#101722', 0, -.03, -.20, .04);
      return group;
    }
    var factories = {
      jake: makeJake, steve: makeSteve, creeper: makeCreeper, sega: makeSega,
      barbie: function () { return makeDoll(false); }, monster: function () { return makeDoll(true); }, bird: makeBird
    };
    return { make: function (key) { return factories[key] ? factories[key]() : makeSteve(); } };
  }

  var TOYS = [
    ['jake', 'Jake', 'Subway Surfers', 'Пойыздың үстімен жүгіріп, инспектордан қашқан кез есіңде ме?'],
    ['steve', 'Steve', 'Minecraft', 'Алғашқы үйің топырақтан еді. Бірақ өз үйің болатын.'],
    ['creeper', 'Creeper', 'Minecraft', 'Тссс… Артыңа бір қарап қой!'],
    ['sega', 'Sega', 'Қалтадағы ойын әлемі', 'Sonic, сақиналар және «тағы бір деңгей ғана».'],
    ['barbie', 'Barbie', 'Қуыршақтар әлемі', 'Көйлек ауыстырып, қуыршақтарға үй жасайтын күндер.'],
    ['monster', 'Draculaura', 'Monster High', 'Қара мен қызғылт шашы бар ең сүйікті қуыршақ.'],
    ['bird', 'Red', 'Angry Birds', 'Бір рогатка. Үш құс. Құламай тұрған соңғы мұнара.']
  ];

  function fallbackArt(key) {
    var content = '';
    if (key === 'steve') content = '<path d="M50 64H107V119H50Z" fill="#20b8be"/><path d="M50 117H77V157H50ZM81 117H107V157H81Z" fill="#5553ab"/><path d="M30 66H49V118H30ZM108 66H127V118H108Z" fill="#b98767"/><path d="M47 8H111V67H47Z" fill="#bf9475"/><path d="M47 8H111V29H47Z" fill="#423024"/><path d="M57 36H72V43H57ZM87 36H102V43H87Z" fill="#fff"/><path d="M66 36H72V43H66ZM87 36H93V43H87Z" fill="#5553ab"/><path d="M68 53H91V61H68Z" fill="#57372a"/>';
    else if (key === 'creeper') content = '<path d="M45 3H115V70H45Z" fill="#78bc49"/><path d="M55 71H105V124H55Z" fill="#589d3c"/><path d="M43 118H75V157H43ZM85 118H117V157H85Z" fill="#81c54c"/><path d="M57 25H73V41H57ZM87 25H103V41H87ZM72 41H88V57H72ZM64 49H76V64H64ZM84 49H96V64H84Z" fill="#142317"/>';
    else if (key === 'bird') content = '<path d="M54 43L57 12L73 38L80 8L88 41Z" fill="#dc3b30"/><ellipse cx="80" cy="92" rx="62" ry="54" fill="#e54135"/><ellipse cx="80" cy="119" rx="42" ry="26" fill="#fae2b9"/><ellipse cx="60" cy="79" rx="20" ry="23" fill="white"/><ellipse cx="100" cy="79" rx="20" ry="23" fill="white"/><circle cx="68" cy="81" r="7" fill="#211d25"/><circle cx="92" cy="81" r="7" fill="#211d25"/><path d="M35 52L79 64M125 52L81 64" stroke="#211d25" stroke-width="11"/><path d="M80 89L106 107L62 109Z" fill="#ffc346"/>';
    else if (key === 'jake') content = '<path d="M56 95H76V150H49ZM84 95H104L111 150H84Z" fill="#4d80b4"/><path d="M48 148H79V158H40ZM82 148H114V158H82Z" fill="#5baf51"/><path d="M46 61H113L122 104H34Z" fill="#f9f5df"/><path d="M49 61H70V109H49ZM90 61H111V109H90Z" fill="#479cd5"/><ellipse cx="80" cy="41" rx="29" ry="32" fill="#e9bc98"/><path d="M50 32C43 -4 118 -4 111 31Z" fill="#df463c"/><path d="M71 8H91V25H71Z" fill="#fff7e7"/><circle cx="70" cy="40" r="4" fill="#42352b"/><circle cx="91" cy="40" r="4" fill="#42352b"/><path d="M70 55Q80 62 91 55" fill="none" stroke="#9e5e4b" stroke-width="2"/>';
    else if (key === 'barbie' || key === 'monster') {
      var monster = key === 'monster', hair = monster ? '#292438' : '#edc25b', skirt = monster ? '#302735' : '#ed6eaf';
      content = '<path d="M40 17Q80 -12 120 17V98H40Z" fill="' + hair + '"/><path d="M65 113H75V153H65ZM85 113H95V153H85Z" fill="#e8bda5"/><path d="M63 61H98L123 123H38Z" fill="' + skirt + '"/><path d="M63 59H98V87H63Z" fill="#f37bb6"/><ellipse cx="80" cy="36" rx="24" ry="29" fill="' + (monster ? '#edc0d6' : '#f0c6a6') + '"/><path d="M57 17Q77 32 104 14" fill="none" stroke="' + hair + '" stroke-width="13"/><circle cx="70" cy="35" r="4" fill="#5292ac"/><circle cx="90" cy="35" r="4" fill="#5292ac"/><path d="M72 49Q80 54 88 49" fill="none" stroke="#d05b87" stroke-width="2"/><path d="M59 151H77V158H55ZM84 151H101V158H84Z" fill="#dd4598"/>';
      if (monster) content += '<path d="M45 14L37 105M115 14L122 105" stroke="#e7449d" stroke-width="10"/>';
    }
    return content ? '<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">' + content + '</svg>' : '';
  }

  function initShowcase(reduce, facts) {
    var root = document.getElementById('memoryViewer'), canvas = document.getElementById('memoryCanvas');
    if (!root || !canvas) return;
    var buttons = root.querySelectorAll('[data-memory-toy]'), current = 'jake', renderer = null, T = global.THREE;
    var scene, camera, group = null, models, modelCache = {}, rotation = -.18, dragging = false, moved = false, startX = 0;
    function describe(key) {
      var row = TOYS.filter(function (toy) { return toy[0] === key; })[0] || TOYS[0];
      document.getElementById('memoryName').textContent = row[1];
      document.getElementById('memorySeries').textContent = row[2];
      document.getElementById('memoryStory').textContent = row[3];
      buttons.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.memoryToy === key)); });
      canvas.setAttribute('aria-label', row[1] + ' көлемді моделі. Айналдыру үшін сүйре.');
      return row;
    }
    function show(key) {
      current = key; describe(key);
      if (!renderer) return;
      if (group) scene.remove(group);
      if (!modelCache[key]) {
        var model = models.make(key);
        var bounds = new T.Box3().setFromObject(model), center = bounds.getCenter(new T.Vector3()), size = bounds.getSize(new T.Vector3());
        model.position.sub(center); var wrapper = new T.Group(); wrapper.add(model);
        wrapper.scale.setScalar(2.9 / Math.max(size.x, size.y, size.z));
        modelCache[key] = wrapper;
      }
      group = modelCache[key]; group.position.y = 0; group.rotation.y = -.18; rotation = -.18; scene.add(group);
    }
    buttons.forEach(function (button) { button.addEventListener('click', function () { facts.hide(); show(button.dataset.memoryToy); }); });
    try {
      if (!T) throw new Error('no_webgl');
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.5)); renderer.outputEncoding = T.sRGBEncoding;
      renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
      scene = new T.Scene(); camera = new T.PerspectiveCamera(32, 1, .1, 40); camera.position.set(0, .15, 7);
      scene.add(new T.HemisphereLight('#f8f4ff', '#78a9a4', .65));
      var light = new T.DirectionalLight('#ffffff', 1.1); light.position.set(-3, 4, 5); scene.add(light);
      light = new T.DirectionalLight('#c8d8ff', .35); light.position.set(3, 0, -2); scene.add(light);
      models = createModels(T);
      function size() {
        var w = canvas.clientWidth || 360, h = canvas.clientHeight || 340;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      var observer = new ResizeObserver(size); observer.observe(canvas); size();
      var visible = false, last = 0;
      var intersection = new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { rootMargin: '100px' }); intersection.observe(root);
      function frame(now) {
        requestAnimationFrame(frame);
        if (!visible || document.hidden || !group) { last = now; return; }
        var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
        if (!dragging && !reduce) rotation += dt * .16;
        group.rotation.y += (rotation - group.rotation.y) * (reduce ? 1 : 1 - Math.exp(-dt * 8));
        group.position.y = reduce ? 0 : Math.sin(now * .0012) * .035;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(frame);
      canvas.addEventListener('pointerdown', function (event) {
        dragging = true; moved = false; startX = event.clientX; canvas.setPointerCapture(event.pointerId);
      });
      canvas.addEventListener('pointermove', function (event) {
        if (!dragging) return;
        var dx = event.clientX - startX; if (Math.abs(dx) > 3) moved = true;
        rotation += dx * .012; startX = event.clientX;
      });
      canvas.addEventListener('pointerup', function (event) {
        dragging = false;
        if (!moved) { var row = describe(current); facts.show({ fact: row[3] }, event); }
      });
      canvas.addEventListener('pointercancel', function () { dragging = false; });
      canvas.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault(); rotation += event.key === 'ArrowLeft' ? -.3 : .3;
        }
      });
      canvas.addEventListener('webglcontextlost', function (event) { event.preventDefault(); root.classList.add('viewer-fallback'); });
    } catch (error) {
      renderer = null; root.classList.add('viewer-fallback');
      document.getElementById('memoryHint').textContent = 'Образды таңда — таныс естелікті оқы.';
    }
    show(current);
  }

  global.Nostalgia = {
    createChips: createChips, createModels: createModels, createFactController: createFactController,
    initShowcase: initShowcase, fallbackArt: fallbackArt, toys: TOYS
  };
})(window);
