# ⚡ X Picture Hacker v1.337

> **Make Your Profile Picture Shine... Literally!**  
> Transform your images with HDR color profiles to create stunning, vibrant profile pictures that pop on modern displays.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![HDR](https://img.shields.io/badge/HDR-Rec2020--PQ-brightgreen?style=for-the-badge)

[Try It Live](#getting-started) • [How It Works](#-how-it-works) • [Twitter Guide](#-twitter--x-upload-guide)

</div>

---

## 🎯 What Is This?

**X Profile Hacker** is a web application that transforms regular images into HDR-enhanced profile pictures with a vibrant color palette. The resulting images display with stunning brightness and saturation on HDR-capable displays (modern smartphones, tablets, and monitors).

### ✨ Key Features

- 🎨 **7-Color Palette Transformation** - Reduces images to a carefully selected vibrant color palette
- 🌈 **Rec2020-PQ HDR Profile** - Embeds HDR color profile directly into PNG files
- 📱 **Optimized for OLED/AMOLED** - Looks incredible on modern smartphone displays
- 🎭 **Hacker Aesthetic UI** - Matrix-style terminal interface with glitch effects
- 💾 **Client-Side Processing** - All image processing happens in your browser (privacy-first)
- 🔥 **Twitter/X Compatible** - Perfect for profile pictures that stand out

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone git@github.com:BasedToschi/hackpfp.git
cd hackpfp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in your browser**
```
http://localhost:3000
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🎨 How to Use

1. **Upload Your Image**
   - Drag and drop an image onto the upload zone
   - Or click to select from your files

2. **Execute the Hack**
   - Click the "🔓 EXECUTE HACK" button
   - Watch your image transform with the vibrant color palette

3. **Download HDR Version**
   - Click "💾 DOWNLOAD HDR" to get your enhanced image
   - The image now has the Rec2020-PQ HDR color profile embedded

4. **Upload to Twitter/X**
   - Use the downloaded image as your profile picture
   - Enjoy the stunning HDR display on compatible devices!

---

## 🔬 How It Works

### The Technology Behind the Magic

#### 1. **Color Palette Reduction**

The app uses a **nearest-neighbor color quantization** algorithm with a custom 7-color palette:

```typescript
const PALETTE = [
  { r: 10, g: 10, b: 10 },       // Deep Black
  { r: 255, g: 255, b: 255 },    // Pure White
  { r: 0, g: 170, b: 120 },      // Vibrant Teal
  { r: 255, g: 80, b: 100 },     // Hot Pink
  { r: 255, g: 220, b: 120 },    // Bright Yellow
  { r: 170, g: 100, b: 200 },    // Electric Purple
  { r: 220, g: 200, b: 180 },    // Warm Skin Tone
];
```

**How it works:**
- For each pixel in your image, the algorithm calculates the **color distance** to each palette color
- Uses the **weighted Euclidean distance** formula that accounts for human perception:
  ```
  distance = √[(2 + R̄/256) × ΔR² + 4 × ΔG² + (2 + (255-R̄)/256) × ΔB²]
  ```
- Replaces each pixel with the closest matching palette color
- This creates a **posterized effect** with vibrant, saturated colors

#### 2. **HDR Color Profile Embedding**

The real magic happens when we embed the **Rec2020-PQ HDR color profile** into the PNG file.

**What is Rec2020-PQ?**
- **Rec2020**: Also called BT.2020, it's a wide color gamut standard that covers ~75% of visible colors (vs. sRGB's ~35%)
- **PQ (Perceptual Quantizer)**: An HDR transfer function (SMPTE ST 2084) that supports peak brightness up to 10,000 nits

**The Embedding Process:**

1. **PNG Chunk Manipulation**
   ```typescript
   // The PNG file is actually a series of "chunks"
   // We insert an iCCP (color profile) chunk after the IHDR chunk
   ```

2. **Profile Compression**
   ```typescript
   // The ICC profile (~9KB) is compressed using zlib/deflate
   const compressed = pako.deflate(iccBytes);
   ```

3. **Chunk Construction**
   ```
   [Length: 4 bytes] [Type: 'iCCP'] [Profile Data] [CRC32: 4 bytes]
   ```

4. **CRC32 Calculation**
   - Every PNG chunk needs a CRC32 checksum for validation
   - We calculate this for our new iCCP chunk to ensure file integrity

**Why This Works:**
- When you upload the image to Twitter/X, they preserve the ICC profile
- HDR-capable devices (iPhone 12+, Galaxy S20+, etc.) read the profile
- The display interprets colors in the wide Rec2020 color space
- Combined with PQ tone mapping, colors appear **incredibly vibrant and bright**

#### 3. **Canvas-Based Processing**

All image manipulation happens client-side using HTML5 Canvas:

```typescript
// Get pixel data
const imageData = ctx.getImageData(0, 0, width, height);
const data = imageData.data; // RGBA array

// Process each pixel (4 bytes: R, G, B, A)
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  const closest = findClosestColor(r, g, b);
  
  data[i] = closest.r;
  data[i + 1] = closest.g;
  data[i + 2] = closest.b;
  // Alpha (data[i + 3]) is preserved
}
```

---

## 📱 Twitter / X Upload Guide

### For Best Results:

1. **Use the Downloaded HDR Version**
   - Don't use the canvas preview directly
   - Always download the file with "💾 DOWNLOAD HDR"

2. **Upload on Mobile**
   - HDR effect is most noticeable on smartphones
   - Use the Twitter/X mobile app for uploading

3. **Supported Devices**
   - ✅ iPhone 12 and newer (HDR display)
   - ✅ iPhone 11 Pro series (HDR display)
   - ✅ Recent Samsung Galaxy flagships
   - ✅ Google Pixel 6 and newer
   - ✅ Most flagship OLED/AMOLED phones from 2020+

4. **View on Compatible Displays**
   - The HDR effect only appears on HDR-capable screens
   - On standard displays, it will look like a normal posterized image
   - On HDR displays, colors will **pop** with incredible vibrancy

### Why Some Platforms Work Better:

- **✅ Twitter/X**: Preserves ICC profiles in uploaded images
- **✅ Instagram**: Supports HDR images (in feed, not always in profile pics)
- **❌ Discord**: Strips ICC profiles during upload
- **❌ Facebook**: Often recompresses and removes profiles

---

## 🎭 The Hacker Aesthetic

The UI features a retro terminal/hacker theme with:

- **Scanline Animation**: Simulates old CRT monitors
- **Glitch Effects**: Text with RGB split and random jitter
- **Matrix Colors**: Classic green-on-black color scheme
- **Terminal Styling**: Monospace fonts and command-line aesthetics
- **Smooth Animations**: Hover effects, modals, and transitions

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5.0
- **UI**: React 19 with Hooks
- **Styling**: Custom CSS with animations
- **Image Processing**: HTML5 Canvas API
- **Compression**: Pako.js (zlib implementation)
- **QR Codes**: QRCode.js

### External Dependencies

```json
{
  "pako": "^2.1.0",        // zlib compression for ICC profile
  "qrcodejs": "^1.0.0"     // QR code generation for donations
}
```

---

## 🔍 Technical Deep Dive

### Color Science

**Why These 7 Colors?**

The palette was carefully chosen to:
1. Cover the main color families (RGB + CMY)
2. Include extremes (pure black, pure white)
3. Work well with skin tones (warm beige)
4. Be highly saturated for maximum HDR impact

**Color Distance Formula:**

We use a **perceptually-weighted Euclidean distance** because human eyes are more sensitive to green:

```
rmean = (R₁ + R₂) / 2

distance = √[
  (2 + rmean/256) × (R₁ - R₂)² +
  4 × (G₁ - G₂)² +
  (2 + (255 - rmean)/256) × (B₁ - B₂)²
]
```

This gives approximately **2× weight to green** and adjusts red/blue based on the mean red value.

### ICC Profile Details

The embedded ICC profile is a **Rec2020-PQ display profile**:

- **Color Primaries**: BT.2020/Rec.2020 wide gamut
- **Transfer Function**: PQ (SMPTE ST 2084)
- **White Point**: D65 (6504K)
- **Profile Size**: ~9KB (compressed to ~6KB)
- **Version**: ICC v4

**Base64 Encoded Profile:**
The profile is stored as a base64 string in the code and decoded at runtime.

---

## 🤔 FAQ

### Q: Will this work on my display?
**A:** The HDR effect requires an HDR-capable display. Check if your device supports:
- HDR10, HDR10+, or Dolby Vision
- OLED/AMOLED screens typically support HDR
- Most flagship phones from 2020+ have HDR displays

### Q: Why does it look normal on my computer?
**A:** Most desktop monitors don't support HDR, or browsers don't enable HDR for images. The effect is most noticeable on:
- Modern iPhones (12+)
- Recent Android flagships
- HDR-enabled tablets

### Q: Does Twitter compress my image?
**A:** Twitter does recompress images, but they generally preserve ICC color profiles. Profile pictures are shown at 400×400px on desktop and 200×200px on mobile.

### Q: Can I use any image?
**A:** Yes! But images with:
- Clear subjects (faces, logos)
- Good contrast
- Simple compositions
...work best with the 7-color palette reduction.

### Q: Is my image uploaded anywhere?
**A:** No! All processing happens **client-side** in your browser. Your images never leave your device.

---

## 🎯 Best Practices

### For Optimal Results:

1. **Image Preparation**
   - Use high-quality source images (at least 500×500px)
   - Well-lit photos work best
   - Clear subject with good contrast

2. **Color Composition**
   - Images with varied colors will show the most dramatic effect
   - Faces and portraits work particularly well
   - Logos with solid colors are great candidates

3. **Testing**
   - Download and test on your phone before uploading to Twitter
   - View the image in different lighting conditions
   - Compare standard vs HDR versions side-by-side

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 🎨 Improve the UI
- 📝 Enhance documentation
- 🔧 Submit pull requests

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Credits

Built with ⚡ by [0xdanya_xo](https://x.com/0xdanya_xo)

**Special Thanks:**
- The color science community for research on perceptual color spaces
- Twitter/X for preserving ICC profiles
- The open-source community for amazing tools

---

## 💎 Support

If you find this tool useful, consider supporting development:

**ETH/EVM Address:** `0x63428e70a8016d10E8e2f7da440c898063afA299`

(Supports: Ethereum, Polygon, Arbitrum, Base, BSC, Optimism, and all EVM chains)

---

<div align="center">

**Made with 🔥 by the community, for the community**

[Twitter](https://x.com/0xdanya_xo) • [GitHub](https://github.com/BasedToschi/hackpfp)

</div>
