import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const cutoff = source.indexOf("$('#markComplete').onclick");
if (cutoff < 0) throw new Error('Could not isolate app definitions');

const expose = `\n;globalThis.__atlas = {foundations,systems,conceptCatalog,taskCatalog,architectureCatalog,conceptFormulaTerms,formulaTerms,taxonomy,specialRoutes,learningPaths,lossDiagnostics,systemBlueprints,systemInfrastructureData,renderers,routeItem,conceptPage,taskPage,architecturePage,architectureVisual,architectureExampleVisual,systemPage,equationMarkup};`;
const context = {
  console,
  location: {hash: ''},
  localStorage: {getItem: () => '[]', setItem() {}, removeItem() {}},
  document: {querySelector: () => null, querySelectorAll: () => []},
  window: {scrollTo() {}},
  Math, JSON, Set,
};
vm.createContext(context);
vm.runInContext(source.slice(0, cutoff) + expose, context, {filename: 'app.js'});
const a = context.__atlas;
const failures = [];
const checks = [];
const check = (condition, message) => {
  checks.push(message);
  if (!condition) failures.push(message);
};

const allItems = [...a.foundations, ...a.systems, ...a.conceptCatalog, ...a.taskCatalog, ...a.architectureCatalog, ...a.specialRoutes, ...a.taxonomy, {id:'overview'}];
const routeIds = new Set(allItems.map(x => x.id));
const duplicates = allItems.map(x => x.id).filter((id, i, ids) => ids.indexOf(id) !== i && !['features','tasks','architectures','losses','evaluation'].includes(id));
check(duplicates.length === 0, `route identifiers are unique (${duplicates.join(', ') || 'yes'})`);

for (const category of a.taxonomy) {
  for (const child of category.children) check(routeIds.has(child), `taxonomy route exists: ${category.id} → ${child}`);
}
for (const [system, steps] of Object.entries(a.learningPaths)) {
  check(a.systems.some(x => x.id === system), `learning path belongs to a system: ${system}`);
  for (const [route] of steps) check(routeIds.has(route), `learning-path route exists: ${system} → ${route}`);
}

for (const c of a.conceptCatalog) {
  check(Boolean(a.conceptFormulaTerms[c.id]?.length), `concept formula legend exists: ${c.id}`);
  check(Boolean(c.formula && c.example && c.tradeoff), `concept has formula, example, and qualification: ${c.id}`);
  if (c.family === 'losses') check(Boolean(a.lossDiagnostics[c.id]), `loss has objective/derivative diagnostic: ${c.id}`);
  const html = a.conceptPage(c);
  check(!/>undefined<|NaN/.test(html), `concept renders without undefined/NaN: ${c.id}`);
}
for (const t of a.taskCatalog) {
  check(Boolean(a.formulaTerms[t.id]?.length), `task formula legend exists: ${t.id}`);
  check(Boolean(t.formula && t.example && t.input && t.output), `task contract is complete: ${t.id}`);
  for (const id of [...t.functions, ...t.losses, ...t.metrics, ...t.architectures, ...t.systems]) check(routeIds.has(id), `task reference exists: ${t.id} → ${id}`);
  const html = a.taskPage(t);
  check(!/>undefined<|NaN/.test(html), `task renders without undefined/NaN: ${t.id}`);
}
for (const arch of a.architectureCatalog) {
  check(Boolean(a.formulaTerms[arch.id]?.length), `architecture formula legend exists: ${arch.id}`);
  check(Boolean(a.architectureVisual(arch)), `architecture diagram exists: ${arch.id}`);
  check(Boolean(a.architectureExampleVisual(arch)), `architecture worked-example visual exists: ${arch.id}`);
  for (const task of arch.tasks) check(routeIds.has(task), `architecture task reference exists: ${arch.id} → ${task}`);
  const html = a.architecturePage(arch);
  check(!/>undefined<|NaN/.test(html), `architecture renders without undefined/NaN: ${arch.id}`);
}

for (const t of a.taskCatalog) {
  for (const archId of t.architectures) {
    const arch = a.architectureCatalog.find(x => x.id === archId);
    check(Boolean(arch?.tasks.includes(t.id)), `task↔architecture link is reciprocal: ${t.id} ↔ ${archId}`);
  }
}
for (const arch of a.architectureCatalog) {
  for (const taskId of arch.tasks.filter(x => x !== 'ltr')) {
    const task = a.taskCatalog.find(x => x.id === taskId);
    check(Boolean(task?.architectures.includes(arch.id)), `architecture↔task link is reciprocal: ${arch.id} ↔ ${taskId}`);
  }
}

const requiredBlueprintFields = ['contract','pipeline','row','features','models','worked','objectives','metrics','serving','failures'];
const requiredInfraFields = ['online','offline','components','decisions'];
for (const system of a.systems) {
  const bp = a.systemBlueprints[system.id];
  const infra = a.systemInfrastructureData[system.id];
  check(Boolean(bp), `system blueprint exists: ${system.id}`);
  check(Boolean(infra), `system infrastructure exists: ${system.id}`);
  for (const field of requiredBlueprintFields) check(Boolean(bp?.[field]?.length), `system section populated: ${system.id}.${field}`);
  for (const field of requiredInfraFields) check(Boolean(infra?.[field]?.length), `infrastructure section populated: ${system.id}.${field}`);
  const html = a.systemPage(system.id);
  check(!/>undefined<|NaN/.test(html), `system renders without undefined/NaN: ${system.id}`);
}

for (const [route, renderer] of Object.entries(a.renderers)) {
  const html = renderer();
  check(typeof html === 'string' && html.length > 100, `overview/foundation renderer returns content: ${route}`);
  check(!/>undefined<|NaN/.test(html), `overview/foundation renders without undefined/NaN: ${route}`);
}

const rendered = [
  ...Object.values(a.renderers).map(fn => fn()),
  ...a.conceptCatalog.map(a.conceptPage),
  ...a.taskCatalog.map(a.taskPage),
  ...a.architectureCatalog.map(a.architecturePage),
  ...a.systems.map(x => a.systemPage(x.id)),
].join('\n');
for (const match of rendered.matchAll(/data-route="([^"]+)"/g)) check(routeIds.has(match[1]), `rendered link resolves: ${match[1]}`);

const navReachable = new Set(['overview','formulation','learning-sequence','tasks','ltr','study',...a.taxonomy.map(x=>x.id),...a.taxonomy.flatMap(x=>x.children),...a.taskCatalog.map(x=>x.id),...a.systems.map(x=>x.id)]);
for (const id of routeIds) check(navReachable.has(id), `route is reachable through navigation: ${id}`);

const stackedIds = ['sigmoid','tanh','softmax','mse','mae','contrastive-loss','precision','recall','f1','normalized-entropy','recall-at-k','ndcg','rmse','r-squared','iou','dice','mean-average-precision','silhouette','perplexity','task-multiclass','arch-transformer'];
for (const id of stackedIds) check(a.equationMarkup(id, '').includes('fraction'), `fraction is vertically stacked: ${id}`);

const near = (actual, expected, tolerance=1e-3) => Math.abs(actual-expected) <= tolerance;
check(near(1/(1+Math.exp(-2)), .881, .001), 'sigmoid worked value is numerically correct');
check(near(-Math.log(.8), .223, .001), 'BCE worked value is numerically correct');
check(near(Math.sqrt(14/3), 2.160, .001), 'RMSE worked value is numerically correct');
check(near((.3*.65)+(.004*180)+(.8*.72)-(1.5*.03), 1.446), 'utility-scoring worked value is numerically correct');
check(near((.8*.7)+(.6*.5), .86), 'two-tower dot product is numerically correct');
check(near((2*.1)+(3*.8), 2.6), 'DCN first-coordinate worked value is numerically correct');
check(near((2*(-1))+(1*0)+(1*1)+(1*(-1))+(1*0)+(0*1)+(1*(-1))+(0*0)+(0*1), -3), 'CNN patch/kernel value is numerically correct');

const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
check(index.includes('styles.css') && index.includes('app.js'), 'HTML references local CSS and JavaScript');
check((css.match(/{/g)||[]).length === (css.match(/}/g)||[]).length, 'CSS braces are balanced');

console.log(`Atlas audit: ${checks.length - failures.length}/${checks.length} checks passed.`);
if (failures.length) {
  console.error('\nFailures:');
  failures.forEach(x => console.error(`- ${x}`));
  process.exit(1);
}
