const fs = require('fs');
const vm = require('vm');

async function main() {
  const code = fs.readFileSync('plugins/vaapp/ophim.js', 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const manifest = JSON.parse(sandbox.getManifest());
  console.log('Manifest:', manifest.id, manifest.name, manifest.version, manifest.type);

  const listUrl = sandbox.getUrlList('phim-moi-cap-nhat', JSON.stringify({ page: 1 }));
  console.log('List URL:', listUrl);

  const listRes = await fetch(listUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const listText = await listRes.text();
  const parsedList = JSON.parse(sandbox.parseListResponse(listText));

  console.log('List status:', listRes.status, '| parsed items:', parsedList.items.length);

  const first = parsedList.items[0];
  if (!first) {
    console.log('No item parsed from list.');
    return;
  }

  console.log('First item:', first.id, '|', first.title, '|', first.year);

  const detailUrl = sandbox.getUrlDetail(first.id);
  console.log('Detail URL:', detailUrl);

  const detailRes = await fetch(detailUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const detailText = await detailRes.text();
  const parsedDetail = JSON.parse(sandbox.parseMovieDetail(detailText));

  console.log('Detail status:', detailRes.status, '| title:', parsedDetail.title);
  console.log('Episode groups:', (parsedDetail.episodes || []).length);

  const ep = parsedDetail.episodes?.[0]?.items?.[0];
  if (!ep) {
    console.log('No episode found in parsed detail.');
    return;
  }

  const streamObj = JSON.parse(
    sandbox.parseDetailResponse(JSON.stringify({ streamUrl: ep.streamUrl })),
  );

  console.log(
    'Stream sample:',
    streamObj.streamUrl ? 'ok' : 'missing',
    '| headers:',
    Object.keys(streamObj.headers || {}).join(',') || 'none',
  );
}

main().catch((err) => {
  console.error('Demo failed:', err.message);
  process.exit(1);
});
