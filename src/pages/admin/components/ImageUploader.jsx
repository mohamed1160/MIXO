import { useState, useRef } from 'react';
import { Upload, X, Star } from 'lucide-react';

export default function ImageUploader({ images = [], onChange, maxImages = 8 }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFiles = (files) => {
    const newImages = [...images];
    for (const file of files) {
      if (newImages.length >= maxImages) break;
      if (!file.type.startsWith('image/')) continue;
      newImages.push({
        id: Date.now() + Math.random(),
        file,
        preview: URL.createObjectURL(file),
        isPrimary: newImages.length === 0,
      });
    }
    onChange?.(newImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (id) => {
    const updated = images.filter((img) => img.id !== id);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange?.(updated);
  };

  const handleSetPrimary = (id) => {
    const updated = images.map((img) => ({ ...img, isPrimary: img.id === id }));
    onChange?.(updated);
  };

  return (
    <div>
      <div
        className={`admin-image-uploader ${dragOver ? 'dragover' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload size={28} style={{ color: 'var(--admin-text-muted)', marginBottom: 8 }} />
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>
          Drop images here or <span style={{ color: 'var(--admin-gold)', fontWeight: 600 }}>browse</span>
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: 4 }}>
          Max {maxImages} images. Click an image to set as primary.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="admin-image-grid">
          {images.map((img) => (
            <div
              key={img.id}
              className={`admin-image-thumb ${img.isPrimary ? 'primary' : ''}`}
              onClick={() => handleSetPrimary(img.id)}
              title={img.isPrimary ? 'Primary image' : 'Click to set as primary'}
            >
              <img src={img.preview || img.url} alt="" />
              {img.isPrimary && (
                <div style={{
                  position: 'absolute', bottom: 4, left: 4,
                  background: 'var(--admin-gold)', color: 'white',
                  borderRadius: 4, padding: '1px 4px', fontSize: '0.6rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 2,
                }}>
                  <Star size={8} /> Primary
                </div>
              )}
              <button
                className="remove-btn"
                onClick={(e) => { e.stopPropagation(); handleRemove(img.id); }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
