export class AssetLoader {
  constructor() {
    this.images = {};
  }

  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images[key] = img;
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }

  async loadAll(imageList) {
    const promises = imageList.map(({ key, src }) => this.loadImage(key, src));
    await Promise.all(promises);
    return this.images;
  }

  get(key) {
    return this.images[key];
  }
}
