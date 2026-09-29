import bcrypt from 'bcryptjs';

// Demo password for every seeded mock account. Real deployments never use
// this file — see server/seed.js for the MongoDB equivalent.
export const DEMO_PASSWORD = 'Aureus2026!';

function hash(pw) {
  return bcrypt.hashSync(pw, 10);
}

// Stable ids so portfolios/insights can reference their owner.
export const MOCK_USERS = [
  {
    id: 'mock-user-ibrahim',
    name: 'Ibrahim Reyes',
    email: 'ibrahim@aureuscapital.demo',
    role: 'client',
    initials: 'IR',
    passwordHash: hash(DEMO_PASSWORD),
  },
  {
    id: 'mock-user-marcus',
    name: 'Marcus Chen',
    email: 'marcus@aureuscapital.demo',
    role: 'client',
    initials: 'MC',
    passwordHash: hash(DEMO_PASSWORD),
  },
  {
    id: 'mock-user-raza',
    name: 'Raza Hussain',
    email: 'raza@aureuscapital.demo',
    role: 'advisor',
    initials: 'RH',
    passwordHash: hash(DEMO_PASSWORD),
  },
];

export const MOCK_PORTFOLIOS = {
  'mock-user-ibrahim': {
    clientName: 'Ibrahim Reyes',
    totalValue: 12450000,
    currency: 'USD',
    ytdReturn: 12.4,
    assetAllocation: [
      { category: 'Global Equities', percentage: 38.5, value: 4793250 },
      { category: 'Fixed Income', percentage: 24, value: 2988000 },
      { category: 'Private Equity', percentage: 18.5, value: 2303250 },
      { category: 'Real Assets', percentage: 12, value: 1494000 },
      { category: 'Cash & Liquidity', percentage: 7, value: 871500 },
    ],
    historicalPerformance: [
      { date: 'Jan 2026', value: 11080000 },
      { date: 'Feb 2026', value: 11240000 },
      { date: 'Mar 2026', value: 10950000 },
      { date: 'Apr 2026', value: 11410000 },
      { date: 'May 2026', value: 11680000 },
      { date: 'Jun 2026', value: 11540000 },
      { date: 'Jul 2026', value: 11920000 },
      { date: 'Aug 2026', value: 12180000 },
      { date: 'Sep 2026', value: 12450000 },
    ],
    lastUpdated: new Date().toISOString(),
  },
  'mock-user-marcus': {
    clientName: 'Marcus Chen',
    totalValue: 6875000,
    currency: 'USD',
    ytdReturn: 8.1,
    assetAllocation: [
      { category: 'Global Equities', percentage: 45, value: 3093750 },
      { category: 'Fixed Income', percentage: 30, value: 2062500 },
      { category: 'Real Assets', percentage: 15, value: 1031250 },
      { category: 'Cash & Liquidity', percentage: 10, value: 687500 },
    ],
    historicalPerformance: [
      { date: 'Jan 2026', value: 6360000 },
      { date: 'Feb 2026', value: 6410000 },
      { date: 'Mar 2026', value: 6290000 },
      { date: 'Apr 2026', value: 6520000 },
      { date: 'May 2026', value: 6610000 },
      { date: 'Jun 2026', value: 6540000 },
      { date: 'Jul 2026', value: 6710000 },
      { date: 'Aug 2026', value: 6790000 },
      { date: 'Sep 2026', value: 6875000 },
    ],
    lastUpdated: new Date().toISOString(),
  },
};

export const MOCK_INSIGHTS = [
  {
    title: 'Q3 macro outlook: rates, credit, and the case for duration',
    category: 'Quarterly Brief',
    date: 'Sep 12, 2026',
    cachedOffline: true,
    body: "Rate cuts are priced in, but the path matters more than the destination. We think investment-grade credit offers the better risk-adjusted entry point over the next two quarters, and we've extended duration modestly across fixed income sleeves accordingly.",
  },
  {
    title: 'Private equity secondaries: where the liquidity premium sits today',
    category: 'Private Markets',
    date: 'Sep 5, 2026',
    cachedOffline: true,
    body: 'Secondaries pricing has normalized from the 2023–24 discount cycle, but selective vintages still trade below NAV. We favor GP-led continuation vehicles over LP portfolio sales for new commitments this cycle.',
  },
  {
    title: 'Currency hedging for multi-jurisdiction holdings',
    category: 'Advisory Note',
    date: 'Aug 28, 2026',
    cachedOffline: true,
    body: 'For clients holding assets across three or more currencies, a rolling 6-month forward hedge on 50–70% of foreign-currency exposure has historically reduced portfolio volatility with minimal drag on realized returns.',
  },
  {
    title: 'Real assets teardown: infrastructure debt in a higher-for-longer regime',
    category: 'Research',
    date: 'Aug 19, 2026',
    cachedOffline: false,
    body: 'Infrastructure debt continues to offer an attractive spread over comparable-duration corporates, particularly in contracted-revenue assets (toll roads, regulated utilities) less exposed to demand-side volatility.',
  },
  {
    title: 'Estate planning check-in: 2026 exemption sunset considerations',
    category: 'Wealth Planning',
    date: 'Aug 10, 2026',
    cachedOffline: false,
    body: 'With the federal estate tax exemption scheduled to revert to a lower threshold, clients with taxable estates above the post-sunset level should evaluate gifting strategies before year-end with their estate counsel.',
  },
];

export function findMockUserByEmail(email) {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findMockUserById(id) {
  return MOCK_USERS.find((u) => u.id === id);
}

export function listMockClients() {
  return MOCK_USERS.filter((u) => u.role === 'client').map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    initials: u.initials,
    portfolio: MOCK_PORTFOLIOS[u.id],
  }));
}
