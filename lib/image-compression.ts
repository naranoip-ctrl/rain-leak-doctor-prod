/**
 * lib/image-compression.ts
 * フロントエンド画像圧縮ユーティリティ
 * 
 * スマホの高解像度画像（4000x3000px、10MB超）を
 * アップロード前に長辺1920px以下、品質0.7に圧縮する。
 * HEIC形式もCanvas APIでJPEGに変換される。
 */

/**
 * 画像ファイルを圧縮してリサイズする
 * @param file 元の画像ファイル
 * @param maxWidth 最大幅（デフォルト: 1920px）
 * @param maxHeight 最大高さ（デフォルト: 1920px）
 * @param quality JPEG品質（0-1、デフォルト: 0.7）
 * @returns 圧縮後のFileオブジェクト
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.7
): Promise<File> {
  return new Promise((resolve, reject) => {
    // 画像を読み込む
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // リサイズ比率を計算
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Canvasに描画して圧縮
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);

          // JPEG形式でBlobに変換
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('画像の圧縮に失敗しました'));
                return;
              }

              // 元のファイル名を維持しつつ拡張子をjpgに
              const originalName = file.name.replace(/\.[^.]+$/, '');
              const compressedFile = new File(
                [blob],
                `${originalName}.jpg`,
                { type: 'image/jpeg' }
              );

              console.log(
                `[画像圧縮] ${file.name}: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB (${width}x${height})`
              );

              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => {
        reject(new Error('画像の読み込みに失敗しました'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * 複数画像を一括圧縮
 */
export async function compressImages(
  files: File[],
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.7
): Promise<File[]> {
  const compressed = await Promise.all(
    files.map((file) => compressImage(file, maxWidth, maxHeight, quality))
  );
  return compressed;
}
