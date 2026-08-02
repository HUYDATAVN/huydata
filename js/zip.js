"use strict";
/*
 * HuyData — Zip (Phase 3.4)
 * Tạo file .zip thuần trong trình duyệt bằng phương thức "store" (không nén),
 * không cần thư viện ngoài (hợp CSP). Đủ để đóng gói site tĩnh đem lên hosting.
 */
var Zip = (function () {
  var crcTable = (function () {
    var t = [];
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function strBytes(s) { return new TextEncoder().encode(s); }
  function dosDT(d) {
    d = d || new Date();
    var time = ((d.getHours() & 0x1f) << 11) | ((d.getMinutes() & 0x3f) << 5) | ((Math.floor(d.getSeconds() / 2)) & 0x1f);
    var date = (((d.getFullYear() - 1980) & 0x7f) << 9) | (((d.getMonth() + 1) & 0x0f) << 5) | (d.getDate() & 0x1f);
    return { time: time, date: date };
  }

  // build({ "path/file": string|Uint8Array, ... }) -> Blob(application/zip)
  function build(files) {
    var dt = dosDT(), chunks = [], entries = [], offset = 0;
    Object.keys(files).forEach(function (name) {
      var content = files[name];
      var data = (content instanceof Uint8Array) ? content : strBytes(content);
      var nameB = strBytes(name);
      var crc = crc32(data);
      var lh = new Uint8Array(30 + nameB.length), dv = new DataView(lh.buffer);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true); dv.setUint16(6, 0x0800, true); dv.setUint16(8, 0, true);
      dv.setUint16(10, dt.time, true); dv.setUint16(12, dt.date, true);
      dv.setUint32(14, crc, true); dv.setUint32(18, data.length, true); dv.setUint32(22, data.length, true);
      dv.setUint16(26, nameB.length, true); dv.setUint16(28, 0, true);
      lh.set(nameB, 30);
      chunks.push(lh); chunks.push(data);
      entries.push({ name: nameB, crc: crc, size: data.length, offset: offset });
      offset += lh.length + data.length;
    });
    var cdChunks = [], cdSize = 0;
    entries.forEach(function (e) {
      var ch = new Uint8Array(46 + e.name.length), dv = new DataView(ch.buffer);
      dv.setUint32(0, 0x02014b50, true);
      dv.setUint16(4, 20, true); dv.setUint16(6, 20, true); dv.setUint16(8, 0x0800, true); dv.setUint16(10, 0, true);
      dv.setUint16(12, dt.time, true); dv.setUint16(14, dt.date, true);
      dv.setUint32(16, e.crc, true); dv.setUint32(20, e.size, true); dv.setUint32(24, e.size, true);
      dv.setUint16(28, e.name.length, true);
      dv.setUint32(42, e.offset, true);
      ch.set(e.name, 46);
      cdChunks.push(ch); cdSize += ch.length;
    });
    var eocd = new Uint8Array(22), edv = new DataView(eocd.buffer);
    edv.setUint32(0, 0x06054b50, true);
    edv.setUint16(8, entries.length, true); edv.setUint16(10, entries.length, true);
    edv.setUint32(12, cdSize, true); edv.setUint32(16, offset, true);
    return new Blob(chunks.concat(cdChunks, [eocd]), { type: "application/zip" });
  }
  return { build: build };
})();
