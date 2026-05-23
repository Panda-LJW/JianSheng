import { Camera, Landmark } from 'lucide-react'
import { useRef } from 'react'

interface UploadPageProps {
  onPhotoSelected: (photoUrl: string) => void
  onUseExample: () => void
}

export function UploadPage({ onPhotoSelected, onUseExample }: UploadPageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onPhotoSelected(url)
    event.target.value = ''
  }

  return (
    <main className="app-frame upload-page">
      <style>{`
        .upload-page {
          min-height: 100dvh;
          background:
            radial-gradient(circle at 50% 12%, rgba(198, 155, 73, 0.1), transparent 18rem),
            linear-gradient(180deg, var(--bg-primary), var(--bg-deep) 68%);
        }

        .upload-page__shell {
          display: grid;
          min-height: 100dvh;
          align-content: center;
          gap: 30px;
          padding: 28px 18px;
        }

        .upload-page__brand {
          display: grid;
          justify-items: start;
          gap: 10px;
        }

        .upload-page__brand h1 {
          margin: 0;
          color: var(--text-primary);
          font-size: clamp(3rem, 14vw, 3.5rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          line-height: 1.1;
        }

        .upload-page__brand p:not(.section-kicker) {
          margin: 0 0 8px;
          color: var(--text-secondary);
          font-size: 0.98rem;
          line-height: 1.8;
        }

        .upload-page__actions {
          display: grid;
          gap: 18px;
        }

        .upload-dropzone {
          display: grid;
          min-height: 188px;
          justify-items: center;
          align-content: center;
          gap: 12px;
          border: 1px dashed var(--border-medium);
          border-radius: 8px;
          padding: 24px;
          background: rgba(42, 35, 24, 0.42);
          color: var(--text-primary);
          text-align: center;
          transition: transform 260ms ease, border-color 260ms ease, background 260ms ease;
        }

        .upload-dropzone:hover {
          transform: translateY(-2px);
          border-color: var(--accent-gold);
          background: rgba(61, 53, 42, 0.48);
        }

        .upload-dropzone svg {
          width: 34px;
          height: 34px;
          color: var(--accent-gold);
        }

        .upload-dropzone strong {
          font-size: 1.15rem;
          font-weight: 600;
        }

        .upload-dropzone span {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.7;
        }

        .upload-divider {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          color: var(--text-dim);
          font-size: 0.78rem;
        }

        .upload-divider span {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-medium), transparent);
        }

        .upload-divider p {
          margin: 0;
        }

        .example-photo-button {
          display: inline-flex;
          min-height: 52px;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 1px solid rgba(232, 223, 208, 0.08);
          border-radius: 8px;
          background: var(--accent-gold);
          color: var(--bg-deep);
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-size: 0.98rem;
          font-weight: 700;
          transition: filter 220ms ease, transform 220ms ease;
        }

        .example-photo-button:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .example-photo-button svg {
          width: 18px;
          height: 18px;
        }

        .upload-page__hint,
        .upload-page__footer {
          margin: 0;
          color: var(--text-dim);
          font-size: 0.78rem;
          line-height: 1.8;
          text-align: center;
        }

        .upload-page__footer {
          align-self: end;
        }
      `}</style>
      <section className="upload-page__shell">
        <div className="upload-page__brand">
          <p className="section-kicker">time · travel · experience</p>
          <h1>见 声</h1>
          <p>看见过去的样子，听见过去的声音</p>
          <span className="gold-rule" />
        </div>

        <div className="upload-page__actions">
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
          />
          <button type="button" className="upload-dropzone" onClick={() => inputRef.current?.click()}>
            <Camera aria-hidden="true" />
            <strong>拍摄 / 上传照片</strong>
            <span>点击此处拍照或选择相册照片</span>
          </button>

          <div className="upload-divider">
            <span />
            <p>或者</p>
            <span />
          </div>

          <button type="button" className="example-photo-button" onClick={onUseExample}>
            <Landmark aria-hidden="true" />
            <span>使用天津示例照片</span>
          </button>
          <p className="upload-page__hint">使用预置的天津地标照片体验穿越</p>
        </div>

        <p className="upload-page__footer">AI 将识别照片中的地点，带你穿越回它最辉煌的时代</p>
      </section>
    </main>
  )
}
