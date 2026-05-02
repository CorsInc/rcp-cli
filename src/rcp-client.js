import puppeteer from 'puppeteer';

const BASE_URL = 'https://rceapi.estado.pr.gov';
const SEARCH_ENDPOINT = `${BASE_URL}/api/corporation/search`;
const INFO_ENDPOINT = `${BASE_URL}/api/corporation/info`;

/**
 * Search corporations by name or registration number.
 * @param {string} query - Search query (name or registration number)
 * @returns {Promise<Array>} List of matching corporations
 */
export async function searchCorporations(query) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to the search page first to handle Cloudflare
    await page.goto(`${BASE_URL}/api/`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Perform the search via the API endpoint
    const response = await page.evaluate(async (q) => {
      const res = await fetch(`${BASE_URL}/api/corporation/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    }, query);

    return response.data || response;
  } finally {
    await browser.close();
  }
}

/**
 * Get detailed information about a corporation by its ID.
 * @param {string} id - Corporation ID
 * @returns {Promise<Object>} Corporation details
 */
export async function getCorporationInfo(id) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; Win64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to the API base first to handle Cloudflare
    await page.goto(`${BASE_URL}/api/`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Fetch corporation info
    const response = await page.evaluate(async (corpId) => {
      const res = await fetch(`${BASE_URL}/api/corporation/info/${corpId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    }, id);

    return response.data || response;
  } finally {
    await browser.close();
  }
}
