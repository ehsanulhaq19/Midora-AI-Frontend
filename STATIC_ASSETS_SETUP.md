# Static Assets Setup

## Required Static Assets

The following static assets need to be copied from the Chat folder to the midora.ai-frontend public/img folder:

### Images to Copy

Copy these files from `../Chat/static/img/` to `public/img/`:

1. **6122191-1-1.png** - AI Detection icon
2. **6122191-1.png** - AI Detection icon variant  
3. **avatar-3.png** - Default user avatar
4. **image-26-1.svg** - AI Humanizer icon
5. **image-26-2.svg** - AI Humanizer icon variant
6. **image-26.svg** - AI Humanizer icon
7. **logo-2.png** - Logo variant 2
8. **size-lg-type-image-indicator-none.png** - Avatar placeholder
9. **vector.svg** - Vector icon for model selection

### Manual Copy Commands

Run these commands from the midora.ai-frontend directory:

```bash
# Copy all required images
cp ../Chat/static/img/6122191-1-1.png public/img/
cp ../Chat/static/img/6122191-1.png public/img/
cp ../Chat/static/img/avatar-3.png public/img/
cp ../Chat/static/img/image-26-1.svg public/img/
cp ../Chat/static/img/image-26-2.svg public/img/
cp ../Chat/static/img/image-26.svg public/img/
cp ../Chat/static/img/logo-2.png public/img/
cp ../Chat/static/img/size-lg-type-image-indicator-none.png public/img/
cp ../Chat/static/img/vector.svg public/img/
```

### Verification

After copying, verify the files exist:

```bash
ls -la public/img/ | grep -E "(6122191|avatar-3|image-26|logo-2|size-lg|vector)"
```

### Notes

- These assets are required for the chat UI to display properly
- The images are referenced in the chat components
- Make sure to maintain the exact filenames as they are used in the code
- If any files are missing, the UI will show broken image placeholders
