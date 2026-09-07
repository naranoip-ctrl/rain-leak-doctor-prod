'use client';

import React, { useEffect, useId, useState } from 'react';
import { Camera } from 'lucide-react';
import { compressImage } from '@/lib/image-compression';

interface ImageUploadProps {
  maxImages?: number;
  onImagesChange: (files: File[]) => void;
  onBusyChange?: (busy: boolean) => void;
  images: File[];
}

export function ImageUpload({
  maxImages = 3,
  onImagesChange,
  onBusyChange,
  images,
}: ImageUploadProps) {
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);
  const inputId = useId();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // 削除後に同じ写真を選び直した場合も change が発火するようにする。
      e.target.value = '';
      if (files.length === 0) return;
      if (files.length + images.length > maxImages) {
        setError(`画像は最大${maxImages}枚までアップロードできます。`);
        return;
      }

      setCompressing(true);
      onBusyChange?.(true);
      setError('');

      try {
        // 各画像を圧縮（長辺1920px、品質0.7）
        const compressedFiles: File[] = [];
        for (const file of files) {
          try {
            const compressed = await compressImage(file, 1920, 1920, 0.7);
            compressedFiles.push(compressed);
          } catch (compressError) {
            console.warn(`画像圧縮失敗（元ファイルを使用）: ${file.name}`, compressError);
            // 圧縮失敗時は元のファイルをそのまま使用
            compressedFiles.push(file);
          }
        }

        onImagesChange([...images, ...compressedFiles]);
      } catch (err) {
        console.error('画像処理エラー:', err);
        setError('画像の処理中にエラーが発生しました。もう一度お試しください。');
      } finally {
        setCompressing(false);
        onBusyChange?.(false);
      }
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p id={`${inputId}-label`} className="sr-only">
        雨漏り箇所の写真（必須）
      </p>
      <p id={`${inputId}-help`} className="text-sm text-slate-600 mb-4 leading-relaxed">
        1枚からOK。最大{maxImages}枚まで選べます。
      </p>

      {images.length < maxImages && (
        <label htmlFor={inputId} className={`w-full border-2 border-dashed border-cyan-200 bg-cyan-50/50 rounded-lg text-center cursor-pointer hover:border-accent-dark hover:bg-cyan-50 transition-colors ${images.length > 0 ? 'flex items-center justify-center gap-3 px-4 py-3' : 'block px-4 py-6 sm:py-8'} ${compressing ? 'opacity-50 pointer-events-none' : ''}`}>
          {compressing ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 shrink-0 border-b-2 border-accent-dark mx-auto"></div>
              <p className="mt-2 text-sm text-primary font-bold">
                写真を準備しています…
              </p>
            </>
          ) : (
            <>
              <Camera className={`${images.length > 0 ? 'h-5 w-5 shrink-0' : 'mx-auto h-10 w-10 mb-3'} text-accent-dark`} strokeWidth={1.5} aria-hidden="true" />
              <p className="text-base text-primary font-bold">
                {images.length > 0 ? '写真を追加する' : '写真を選ぶ'}
              </p>
            </>
          )}
          <input
            id={inputId}
            aria-labelledby={`${inputId}-label`}
            aria-describedby={`${inputId}-help`}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="sr-only"
            disabled={compressing}
          />
        </label>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index}>
              <ImagePreview image={image} index={index} />
              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label={`写真${index + 1}を削除`}
                className="w-full min-h-11 mt-2 px-2 py-2 border border-slate-200 text-slate-600 bg-white rounded-lg text-xs hover:bg-slate-50 disabled:opacity-50"
                disabled={compressing}
              >
                写真{index + 1}を削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImagePreview({ image, index }: { image: File; index: number }) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <div className="aspect-[4/3] bg-slate-50 rounded-lg border border-slate-200">
      {previewUrl && <img src={previewUrl} alt={`選択した写真${index + 1}`} className="w-full h-full object-contain rounded-lg" />}
    </div>
  );
}
