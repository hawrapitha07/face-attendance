import { useState } from 'react';

export default function PhotoUploader({
  multiple = false,
  onFiles,
  label = 'Drop photo here or click to browse',
  hint = 'Supports JPG, PNG',
}) {
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState([]);
  const inputId = `uploader-${Math.random().toString(36).slice(2)}`;

  const handleFiles = (incoming) => {
    const arr = Array.from(incoming);
    setFiles(arr);
    onFiles(arr);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId).click()}
        style={{
          border: `2px dashed ${drag ? 'var(--green)' : 'var(--border)'}`,
          borderRadius: 'var(--radius2)',
          padding: '36px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: drag ? 'var(--greenglow)' : 'var(--bg2)',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 10 }}>◎</div>
        <div style={{ fontWeight: 500, marginBottom: 5, color: 'var(--text)' }}>
          {files.length > 0
            ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
            : label}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>{hint}</div>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={e => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div style={{
          marginTop: 12,
          display: 'grid',
          gridTemplateColumns: `repeat(${multiple ? 6 : 1}, 1fr)`,
          gap: 6,
        }}>
          {files.slice(0, multiple ? 12 : 1).map((f, i) => (
            <img
              key={i}
              src={URL.createObjectURL(f)}
              alt={`preview ${i + 1}`}
              style={{
                width: '100%',
                aspectRatio: multiple ? '1' : '16/9',
                objectFit: 'cover',
                borderRadius: 6,
                border: '1px solid var(--border)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
