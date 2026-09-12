# PWA Icons Guide

## Required Icons for PWA

You need to create the following icon sizes for the PWA to work properly:

### Icon Sizes:
- **icon-72x72.png** - For smaller devices
- **icon-96x96.png** - For badge notifications
- **icon-128x128.png** - For medium devices
- **icon-144x144.png** - For tablets
- **icon-152x152.png** - For iOS devices
- **icon-192x192.png** - For Android devices (required)
- **icon-384x384.png** - For larger screens
- **icon-512x512.png** - For splash screens (required)

### How to Create Icons:

#### Option 1: Using Online Tools
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your logo/icon (minimum 512x512px recommended)
3. Download the generated icon pack
4. Extract and place all icons in the `/public/icons/` directory

#### Option 2: Using Design Tools
1. Open your logo in Photoshop, Figma, or any design tool
2. Export the logo in the sizes listed above
3. Save as PNG format with transparency
4. Name them exactly as shown above
5. Place in `/public/icons/` directory

#### Option 3: Using ImageMagick (Command Line)
If you have a source image (e.g., `logo.png`), run these commands:

```bash
# Install ImageMagick first if not installed
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: apt-get install imagemagick

# Then generate all sizes:
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

### Design Recommendations:
- Use a simple, recognizable logo
- Avoid text that becomes unreadable at small sizes
- Use high contrast colors for visibility
- Test on both light and dark backgrounds
- Square aspect ratio (1:1)
- Transparent or solid background (not gradient)
- Minimum 20% padding around the logo

### Current Status:
⚠️ **Icons are missing!** Please create and add the icons listed above for the PWA to function correctly.

Once you add the icons, the PWA will:
- ✅ Show proper app icon when installed
- ✅ Display branded notifications
- ✅ Appear in app drawer/home screen with your logo
- ✅ Show splash screen on launch
