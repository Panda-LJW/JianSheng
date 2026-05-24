import { ArrowLeft, Camera, Landmark, Map } from 'lucide-react'
import { useRef } from 'react'

interface UploadPageProps {
  onBack: () => void
  onBrowseLocations: () => void
  onPhotoSelected: (photoUrl: string, filename?: string) => void
  onUseExample: () => void
}

export function UploadPage({ onBack, onBrowseLocations, onPhotoSelected, onUseExample }: UploadPageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onPhotoSelected(url, file.name)
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
          <p>选择一张天津地标照片，创建一次 AI 文旅体验任务。</p>
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
            <span>进入任务状态流程，后续可衔接图像识别、历史资料检索、复原图和 TTS。</span>
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
          <p className="upload-page__hint">当前会优先连接本地 API；若服务未启动，页面会自动降级到本地体验流程。</p>
        </div>

        <p className="upload-page__footer">任务模型已预留：地点识别、资料检索、复原图、TTS 与 Marble world 可分步接入。</p>
      </section>
    </main>
  )
}
