import { ArrowLeft, Camera, Landmark, Map } from 'lucide-react'
import { useRef } from 'react'

interface UploadPageProps {
  onBack: () => void
  onBrowseLocations: () => void
  onPhotoSelected: (photoUrl: string) => void
  onUseExample: () => void
}

export function UploadPage({ onBack, onBrowseLocations, onPhotoSelected, onUseExample }: UploadPageProps) {
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
      <button type="button" className="back-button upload-back" onClick={onBack} aria-label="返回见声首页">
        <ArrowLeft aria-hidden="true" />
        <span>返回首页</span>
      </button>
      <section className="upload-page__shell">
        <div className="upload-page__brand">
          <p className="section-kicker">offline ai workflow</p>
          <h1>上传照片</h1>
          <p>选择一张天津地标照片，体验离线 AI workflow 已生成的示例结果。</p>
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
            <span>当前演示不会把照片上传到实时服务器，会进入契约演示流程。</span>
          </button>

          <div className="upload-divider">
            <span />
            <p>或者</p>
            <span />
          </div>

          <button type="button" className="primary-action example-photo-button" onClick={onUseExample}>
            <Landmark aria-hidden="true" />
            <span>使用已生成示例</span>
          </button>
          <button type="button" className="secondary-action browse-locations-button" onClick={onBrowseLocations}>
            <Map aria-hidden="true" />
            <span>直接浏览地标</span>
          </button>
          <p className="upload-page__hint">示例结果来自本地静态素材与 workflow 产物契约，不是实时 API 调用。</p>
        </div>

        <p className="upload-page__footer">后续接入任务队列/API 后，这里会承接真实上传、分析、复原图与 TTS 生成状态。</p>
      </section>
    </main>
  )
}
