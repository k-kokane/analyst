const ALLOWED_HOSTS = [
  'www.screener.in',
  'screener.in',
  'stockanalysis.com',
  'trendlyne.com',
  'in.investing.com',
  'investing.com',
  'query1.finance.yahoo.com',
  'query2.finance.yahoo.com',
  'dhan.co',
];

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { url, secret } = event.queryStringParameters || {};

  if (!process.env.PROXY_SECRET || secret !== process.env.PROXY_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'url query parameter required' }) };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid URL' }) };
  }

  if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: `Host not allowed: ${parsedUrl.hostname}` }),
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        DNT: '1',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(25000),
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    const body = await response.text();

    return {
      statusCode: 200,
      headers: {
        'X-Proxy-Status': response.status.toString(),
        'X-Proxy-Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'X-Proxy-Status': 'error', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
