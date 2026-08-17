import {createRequire} from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');

const routes = [
  'overview','formulation','learning-sequence','features','data','embeddings','math','activations',
  'sigmoid','relu','tanh','softmax','gelu','losses','bce','categorical-cross-entropy','mse','mae','huber','focal-loss','contrastive-loss','ranknet-loss',
  'architectures','arch-linear','arch-logistic','arch-matrix-factorization','arch-tree','arch-gbdt','arch-lambdamart','arch-dnn','arch-wide-deep','arch-dcn','arch-cnn','arch-rnn','arch-transformer','arch-two-tower','arch-cross-encoder','arch-mmoe',
  'optimization','evaluation','precision','recall','f1','roc-auc','pr-auc','normalized-entropy','recall-at-k','ndcg','rmse','r-squared','iou','dice','mean-average-precision','silhouette','perplexity',
  'stages','recommenders','retrieval','serving','tasks','task-binary','task-multiclass','task-multilabel','task-regression','task-scoring','task-embedding','task-retrieval','task-clustering','task-anomaly','task-detection','task-segmentation','task-forecasting','task-generation','ltr','next-video','ad-ctr','visual-search','content-safety','study'
];

const browserPath = chromium.executablePath();
if (!fs.existsSync(browserPath)) {
  console.log(`Browser audit skipped: Playwright Chromium is not installed at ${browserPath}.`);
  console.log('Install it with `npx playwright install chromium`, then rerun this script.');
  process.exit(0);
}
const browser = await chromium.launch({headless:true});
const failures = [];
for (const viewport of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}]) {
  const page = await browser.newPage({viewport});
  page.on('pageerror', error => failures.push(`${viewport.name}: page error: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') failures.push(`${viewport.name}: console error: ${message.text()}`); });
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:8080/#${route}`, {waitUntil:'domcontentloaded'});
    await page.waitForSelector('#content h1');
    const result = await page.evaluate(() => ({
      title: document.querySelector('#content h1')?.textContent?.trim(),
      contentLength: document.querySelector('#content')?.textContent?.trim().length || 0,
      badText: /\b(?:undefined|NaN)\b/.test(document.querySelector('#content')?.textContent || ''),
      viewportOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    }));
    if (!result.title || result.contentLength < 80) failures.push(`${viewport.name}/${route}: missing substantive content`);
    if (result.badText) failures.push(`${viewport.name}/${route}: rendered undefined or NaN`);
    if (result.viewportOverflow) failures.push(`${viewport.name}/${route}: page-level horizontal overflow`);
  }
  await page.goto('http://127.0.0.1:8080/#softmax');
  await page.waitForSelector('#conceptPlot path.plot-series');
  await page.goto('http://127.0.0.1:8080/#bce');
  await page.waitForSelector('#lossCurve path.plot-series');
  await page.goto('http://127.0.0.1:8080/#arch-transformer');
  await page.waitForSelector('.attention-matrix-example');
  await page.goto('http://127.0.0.1:8080/#next-video');
  await page.waitForSelector('.system-model-diagram');
  await page.screenshot({path:`/tmp/ml-atlas-${viewport.name}.png`,fullPage:true});
  await page.close();
}
await browser.close();

console.log(`Browser audit: ${routes.length} routes × 2 viewports checked.`);
if (failures.length) {
  console.error(failures.map(x=>`- ${x}`).join('\n'));
  process.exit(1);
}
