// Using Node.js built-in crypto
// import crypto from "crypto"

/**
 * Generate Wikimedia Commons URL for a given filename
 * @param {string} filename - e.g. "Zh-cóng.ogg"
 * @returns {string} full URL
 */
// export function getWikimediaUrl(filename: string) {
//   // Encode filename for URL
//   const encoded = encodeURIComponent(filename)

//   // Compute MD5 hash of the filename
//   const hash = Crypto.createHash("md5").update(filename).digest("hex")

//   // First char = folder1, first 2 chars = folder2
//   const folder1 = hash[0]
//   const folder2 = hash.slice(0, 2)

//   // Construct full URL
//   return `https://upload.wikimedia.org/wikipedia/commons/${folder1}/${folder2}/${encoded}`
// }
