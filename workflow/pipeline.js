import fs from 'node:fs/promises'
import path from 'node:path'
import { analyzePlace } from './step1-analyze.js'
import { restoreImage, restoreImageFromPromptAndImage } from './step2-restore.js'
import { createWorldFromImage } from './step3-world.js'

function parseArgs(argv) {
  const args = {}
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue
    args[token.slice(2)] = argv[index + 1]
    index += 1
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.input || !args.era) {
    console.error('Usage: node workflow/pipeline.js --input photo.jpg --era "目标年代描述" --output ./workflow/output/')
    process.exit(1)
  }
  const outputDir = args.output || './workflow/output'
  await fs.mkdir(outputDir, { recursive: true })

  console.log('[1/3] Analyzing place and target era...')
  const analysis = await analyzePlace({ input: args.input, era: args.era })
  const analysisPath = path.join(outputDir, 'analysis.json')
  await fs.writeFile(analysisPath, JSON.stringify(analysis, null, 2), 'utf8')
  console.log(`Wrote ${analysisPath}`)

  console.log('[2/3] Generating restoration image from text + source image...')
  const restoredPath = path.join(outputDir, 'restored.jpg')
  const restoreMode = args['restore-mode'] || 'auto'
  if (restoreMode === 'generate') {
    await restoreImage({ prompt: analysis.restoration_prompt, output: restoredPath })
  } else {
    try {
      await restoreImageFromPromptAndImage({
        image: args.input,
        prompt: analysis.restoration_prompt,
        output: restoredPath,
      })
    } catch (error) {
      if (restoreMode === 'edit') throw error
      console.warn(`[2/3] Image edit failed, falling back to text-only generation: ${error.message}`)
      await restoreImage({ prompt: analysis.restoration_prompt, output: restoredPath })
    }
  }
  console.log(`Wrote ${restoredPath}`)

  if (args['skip-world'] === 'true') {
    console.log('[3/3] Skipped World Labs generation because --skip-world true was provided.')
    return
  }

  console.log('[3/3] Generating World Labs / Marble world from restored image...')
  const worldDir = path.join(outputDir, 'world')
  const worldResult = await createWorldFromImage({
    image: restoredPath,
    prompt: analysis.restoration_prompt,
    outputDir: worldDir,
    displayName: `${analysis.name || '见声'} · ${analysis.era || args.era}`,
    model: args['world-model'] || process.env.WORLDLABS_MODEL || 'marble-1.1',
    wait: args['no-wait'] !== 'true',
  })
  console.log(`Wrote ${path.join(worldDir, worldResult.world ? 'world.json' : 'operation-start.json')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
