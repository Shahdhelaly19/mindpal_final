// // Ultra Secure Crypto - JavaScript Version (Structured for AES → Chaos)

// import { pbkdf2Sync, createHmac, randomBytes, createCipheriv, timingSafeEqual, createDecipheriv, createHash } from "crypto";
// import { readFileSync, writeFileSync } from "fs";
// import sharp from "sharp";
// import { lookup } from "mime-types";

// // ========== Crypto Functions ==========
// function deriveKey(password, salt) {
//   return pbkdf2Sync(password, salt, 100000, 32, "sha256");
// }

// function signData(data, key) {
//   return createHmac("sha256", key).update(data).digest();
// }

// function encryptData(password, data, salt = null) {
//   if (!salt) salt = randomBytes(32);
//   const key = deriveKey(password, salt);
//   const nonce = randomBytes(16);
//   const cipher = createCipheriv("aes-256-gcm", key, nonce);
//   const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
//   const tag = cipher.getAuthTag();
//   const signature = signData(ciphertext, key);
//   return Buffer.concat([salt, nonce, tag, signature, ciphertext]);
// }

// function decryptData(password, blob) {
//   const salt = blob.slice(0, 32);
//   const nonce = blob.slice(32, 48);
//   const tag = blob.slice(48, 64);
//   const signature = blob.slice(64, 96);
//   const ciphertext = blob.slice(96);
//   const key = deriveKey(password, salt);
//   if (!timingSafeEqual(signature, signData(ciphertext, key)))
//     throw new Error("❌ Integrity check failed!");
//   const decipher = createDecipheriv("aes-256-gcm", key, nonce);
//   decipher.setAuthTag(tag);
//   const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
//   return { decrypted, salt };
// }

// // ========== Chaos Encryption ==========
// function hybridSequence(size, x0, r1, r2) {
//   const logistic = [], tent = [];
//   let x = x0;
//   for (let i = 0; i < size; i++) {
//     x = r1 * x * (1 - x);
//     logistic.push(x);
//   }
//   x = x0;
//   for (let i = 0; i < size; i++) {
//     x = x < 0.5 ? r2 * x : r2 * (1 - x);
//     tent.push(x);
//   }
//   return logistic.map((v, i) => Math.floor(((v + tent[i]) / 2) * 255));
// }

// function permuteImage(pixels, chaos) {
//   const indices = [...Array(pixels.length).keys()];
//   indices.sort((a, b) => chaos[a] - chaos[b]);
//   return { permuted: indices.map(i => pixels[i]), indices };
// }

// function unpermuteImage(pixels, indices) {
//   const output = new Array(pixels.length);
//   indices.forEach((idx, i) => output[idx] = pixels[i]);
//   return output;
// }

// function diffuse(pixels, chaos) {
//   const output = new Array(pixels.length);
//   output[0] = pixels[0] ^ chaos[0];
//   for (let i = 1; i < pixels.length; i++) {
//     output[i] = pixels[i] ^ chaos[i] ^ output[i - 1];
//   }
//   return output;
// }

// function reverseDiffuse(pixels, chaos) {
//   const output = new Array(pixels.length);
//   output[0] = pixels[0] ^ chaos[0];
//   for (let i = 1; i < pixels.length; i++) {
//     output[i] = pixels[i] ^ chaos[i] ^ pixels[i - 1];
//   }
//   return output;
// }

// // ========== Encrypt File ==========
// async function encryptFile(path, password) {
//   const mimeType = lookup(path);
//   const salt = randomBytes(32);
//   const key = deriveKey(password, salt);
//   const hash = createHash("sha256").update(key).digest();
//   const x0 = hash.readUInt32BE(0) / 2 ** 32;
//   const r1 = 3.9 + (hash[4] % 10) / 100;
//   const r2 = 1.9 + (hash[5] % 10) / 100;

//   if (mimeType && mimeType.startsWith("image")) {
//     const { data, info } = await sharp(path).grayscale().raw().toBuffer({ resolveWithObject: true });
//     const pixels = Array.from(data);
//     console.log("Original pixels (first 10):", pixels.slice(0, 10));
//     console.log("Width x Height:", info.width, "x", info.height);

//     const chaos = hybridSequence(pixels.length, x0, r1, r2);
//     const { permuted, indices } = permuteImage(pixels, chaos);
//     const diffused = diffuse(permuted, chaos);

//     const payload = JSON.stringify({
//       _chaotic_: true,
//       pixels: diffused,
//       indices,
//       width: info.width,
//       height: info.height
//     });

//     return encryptData(password, Buffer.from(payload), salt);
//   } else {
//     const raw = readFileSync(path);
//     return encryptData(password, raw, salt);
//   }
// }

// // ========== Decrypt File ==========
// async function decryptFile(encryptedBuffer, password, outputPath) {
//   const { decrypted, salt } = decryptData(password, encryptedBuffer);
//   const key = deriveKey(password, salt);

//   try {
//     const json = JSON.parse(decrypted.toString());
//     if (!json._chaotic_) throw new Error("Not a chaotic image payload");

//     const hash = createHash("sha256").update(key).digest();
//     const x0 = hash.readUInt32BE(0) / 2 ** 32;
//     const r1 = 3.9 + (hash[4] % 10) / 100;
//     const r2 = 1.9 + (hash[5] % 10) / 100;
//     const chaos = hybridSequence(json.pixels.length, x0, r1, r2);
//     const recovered = reverseDiffuse(json.pixels, chaos);
//     const original = unpermuteImage(recovered, json.indices);
//     console.log("First 10 pixel values:", original.slice(0, 10));
//     console.log("Image dimensions:", json.width, "x", json.height);

//     const buffer = Buffer.from(original);

//     await sharp(buffer, {
//       raw: {
//         width: json.width,
//         height: json.height,
//         channels: 1
//       }
//     })
//       .toColourspace("b-w")
//       .toFormat("jpeg")
//       .toFile(outputPath);
//   } catch {
//     writeFileSync(outputPath, decrypted);
//   }
// }

// export default {
//   encryptFile,
//   decryptFile
// };

import { pbkdf2Sync, createHmac, randomBytes, createCipheriv, timingSafeEqual, createDecipheriv, createHash } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import sharp from "sharp";
import { lookup } from "mime-types";

// ========== Crypto Functions ==========
export function deriveKey(password, salt) {
  return pbkdf2Sync(password, salt, 100000, 32, "sha256");
}

export function signData(data, key) {
  return createHmac("sha256", key).update(data).digest();
}

export function encryptData(password, data, salt = null) {
  if (!salt) salt = randomBytes(32);
  const key = deriveKey(password, salt);
  const nonce = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", key, nonce);
  const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  const signature = signData(ciphertext, key);
  return Buffer.concat([salt, nonce, tag, signature, ciphertext]);
}

export function decryptData(password, blob) {
  const salt = blob.slice(0, 32);
  const nonce = blob.slice(32, 48);
  const tag = blob.slice(48, 64);
  const signature = blob.slice(64, 96);
  const ciphertext = blob.slice(96);
  const key = deriveKey(password, salt);
  if (!timingSafeEqual(signature, signData(ciphertext, key)))
    throw new Error("❌ Integrity check failed!");
  const decipher = createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return { decrypted, salt };
}

// ========== Chaos Encryption ==========
export function hybridSequence(size, x0, r1, r2) {
  const logistic = [], tent = [];
  let x = x0;
  for (let i = 0; i < size; i++) {
    x = r1 * x * (1 - x);
    logistic.push(x);
  }
  x = x0;
  for (let i = 0; i < size; i++) {
    x = x < 0.5 ? r2 * x : r2 * (1 - x);
    tent.push(x);
  }
  return logistic.map((v, i) => Math.floor(((v + tent[i]) / 2) * 255));
}

export function permuteImage(pixels, chaos) {
  const indices = [...Array(pixels.length).keys()];
  indices.sort((a, b) => chaos[a] - chaos[b]);
  return { permuted: indices.map(i => pixels[i]), indices };
}

export function unpermuteImage(pixels, indices) {
  const output = new Array(pixels.length);
  indices.forEach((idx, i) => output[idx] = pixels[i]);
  return output;
}

export function diffuse(pixels, chaos) {
  const output = new Array(pixels.length);
  output[0] = pixels[0] ^ chaos[0];
  for (let i = 1; i < pixels.length; i++) {
    output[i] = pixels[i] ^ chaos[i] ^ output[i - 1];
  }
  return output;
}

export function reverseDiffuse(pixels, chaos) {
  const output = new Array(pixels.length);
  output[0] = pixels[0] ^ chaos[0];
  for (let i = 1; i < pixels.length; i++) {
    output[i] = pixels[i] ^ chaos[i] ^ pixels[i - 1];
  }
  return output;
}

// ========== Encrypt File ==========
export async function encryptFile(path, password) {
  const mimeType = lookup(path);
  const salt = randomBytes(32);
  const key = deriveKey(password, salt);
  const hash = createHash("sha256").update(key).digest();
  const x0 = hash.readUInt32BE(0) / 2 ** 32;
  const r1 = 3.9 + (hash[4] % 10) / 100;
  const r2 = 1.9 + (hash[5] % 10) / 100;

  if (mimeType && mimeType.startsWith("image")) {
    const { data, info } = await sharp(path).grayscale().raw().toBuffer({ resolveWithObject: true });
    const pixels = Array.from(data);
    console.log("Original pixels (first 10):", pixels.slice(0, 10));
    console.log("Width x Height:", info.width, "x", info.height);

    const chaos = hybridSequence(pixels.length, x0, r1, r2);
    const { permuted, indices } = permuteImage(pixels, chaos);
    const diffused = diffuse(permuted, chaos);

    const payload = JSON.stringify({
      _chaotic_: true,
      pixels: diffused,
      indices,
      width: info.width,
      height: info.height
    });

    return encryptData(password, Buffer.from(payload), salt);
  } else {
    const raw = readFileSync(path);
    return encryptData(password, raw, salt);
  }
}

// ========== Decrypt File ==========
export async function decryptFile(encryptedBuffer, password, outputPath) {
  const { decrypted, salt } = decryptData(password, encryptedBuffer);
  const key = deriveKey(password, salt);

  try {
    const json = JSON.parse(decrypted.toString());
    if (!json._chaotic_) throw new Error("Not a chaotic image payload");

    const hash = createHash("sha256").update(key).digest();
    const x0 = hash.readUInt32BE(0) / 2 ** 32;
    const r1 = 3.9 + (hash[4] % 10) / 100;
    const r2 = 1.9 + (hash[5] % 10) / 100;
    const chaos = hybridSequence(json.pixels.length, x0, r1, r2);
    const recovered = reverseDiffuse(json.pixels, chaos);
    const original = unpermuteImage(recovered, json.indices);
    console.log("First 10 pixel values:", original.slice(0, 10));
    console.log("Image dimensions:", json.width, "x", json.height);

    const buffer = Buffer.from(original);

    await sharp(buffer, {
      raw: {
        width: json.width,
        height: json.height,
        channels: 1
      }
    })
      .toColourspace("b-w")
      .toFormat("jpeg")
      .toFile(outputPath);
  } catch {
    writeFileSync(outputPath, decrypted);
  }
}
