// Innovation Rush: game data and engine. Pure logic, no DOM, so it can be balance-tested in Node.

const NODES = {
  prob: 'Problem clarity',
  safe: 'Safety to experiment',
  data: 'Data and site access',
  path: 'Pilot-to-production pathway',
  reach: 'Ecosystem reach',
  champ: 'Site champions',
  trust: 'Innovator trust',
  focus: 'Portfolio focus',
};

const NODE_TIPS = {
  prob: 'Start with well-defined operational problems. Workshop them with site teams and measure against site KPIs.',
  safe: 'Make it safe to try and fail. Share lessons from closed pilots and never punish a well-run experiment.',
  data: 'Give innovators real data and site access through a secure sandbox and decent connectivity.',
  path: 'Build a path from pilot to production: light procurement, scale-up budgets and an exec owner.',
  reach: 'Take your problems to the global ecosystem through open challenges, consortia and scouting partners.',
  champ: 'Give site champions time and KPIs, and design trials with operators rather than around them.',
  trust: 'Treat innovators fairly: fair IP terms, fast payment, and a reply to every submission.',
  focus: 'Fund fewer things, with clear kill criteria. Measure value, not activity.',
};

const METRICS = [
  { id: 'eco', name: 'Ecosystem', desc: 'Innovators, researchers and partners working on your problems', w: { reach: 0.4, trust: 0.35, prob: 0.25 } },
  { id: 'adopt', name: 'Adoption', desc: 'Pilots that make it into production across your sites', w: { path: 0.3, champ: 0.3, safe: 0.15, data: 0.15, focus: 0.1 } },
  { id: 'value', name: 'Value', desc: 'Measured cost, safety, productivity and emissions impact', w: { prob: 0.3, focus: 0.3, path: 0.2, data: 0.2 } },
  { id: 'buyin', name: 'Buy-in', desc: 'How much site leaders trust and back your innovation team', w: { champ: 0.4, safe: 0.2, focus: 0.2, prob: 0.2 } },
];

const COMPANIES = [
  {
    id: 'junior', name: 'Lucky Strike Resources', size: 'Junior explorer', budget: 4, mascot: 'nugget', difficulty: 'Gentle',
    blurb: 'A 40-person explorer sitting on one promising lithium deposit. Not much money, not much bureaucracy, lots of ambition.',
    welcome: [
      'We found lithium! Now we need to work out how to mine it smarter than the majors, on a fraction of their budget.',
      'Our team is small and everyone knows everyone, but we have never worked with startups or run a pilot.',
      'Show us how open innovation can help a small miner punch above its weight.',
    ],
    nodes: { prob: 50, safe: 60, data: 45, path: 55, reach: 38, champ: 65, trust: 50, focus: 55 },
    drag: {},
  },
  {
    id: 'mid', name: 'Copper Canyon Mining', size: 'Mid-tier producer', budget: 20, mascot: 'truck', difficulty: 'Moderate',
    blurb: 'Two open-pit copper mines and a concentrator. Margins are tight, ore grades are falling and the board wants new ideas.',
    welcome: [
      'Our grades are dropping, energy costs are climbing and our haul fleet is getting old.',
      'We have run a few pilots before. Most of them quietly died once the vendor demo was over.',
      'We need you to turn innovation from a side hobby into something our sites actually rely on.',
    ],
    nodes: { prob: 48, safe: 50, data: 50, path: 46, reach: 50, champ: 50, trust: 50, focus: 48 },
    drag: { champ: -0.4 },
  },
  {
    id: 'major', name: 'Big Rocks', size: 'Global major', budget: 120, mascot: 'mammoth', difficulty: 'Brutal',
    blurb: 'Thirty sites on four continents, a famous brand and a big budget. Also seven approval committees and a long memory.',
    welcome: [
      'We have an innovation lab, a venture fund and a very nice video about the future of mining.',
      'What we do not have is many new technologies running on our sites. Startups say we are slow and hard to work with.',
      'You have the budget. Can you get this mammoth moving before the board loses patience?',
    ],
    nodes: { prob: 44, safe: 40, data: 50, path: 34, reach: 62, champ: 40, trust: 42, focus: 38 },
    drag: { path: -1.1, safe: -0.6, champ: -0.3 },
  },
];

// Each option: t = text, c = cost (% of tenure budget, negative returns budget), e = effect per quarter on hidden drivers, n = debrief note.
const INITIATIVES = [
  {
    id: 'problems', name: 'Problem statements', icon: 'target',
    desc: 'Innovators can only solve problems they understand. How will you decide what you want solved?',
    opts: [
      { t: 'Let innovators guess what we need', c: 0, e: { prob: -1, focus: -1 }, n: 'Without clear problems you get solutions looking for a home.' },
      { t: 'Annual wishlist from head office', c: 8, e: { prob: 1, champ: -1 }, n: 'Head office wishlists rarely match what hurts on site.' },
      { t: 'Workshop problems with site teams', c: 15, e: { prob: 4, champ: 2, focus: 1 }, n: 'Problems defined with the people who live them give innovators a real target.' },
      { t: 'Consultants write a 200-page technology roadmap', c: 35, e: { prob: 1, focus: -1, champ: -1 }, n: 'Expensive, and the roadmap described technologies, not problems.' },
    ],
  },
  {
    id: 'challenges', name: 'Open innovation challenges', icon: 'globe',
    desc: 'Take your problems to the global ecosystem of startups, researchers and other industries. What format?',
    opts: [
      { t: 'Put an "ideas portal" on the website', c: 0, e: { reach: 1, trust: -2, focus: -1 }, n: 'Portals without problems or replies become black holes that innovators learn to avoid.' },
      { t: 'One global challenge on a real site problem, with data', c: 18, e: { reach: 3, prob: 1, data: 1, trust: 2 }, n: 'A real problem, real data and a real prize brings serious solvers.' },
      { t: 'Celebrity-judged innovation awards night', c: 28, e: { reach: 1, focus: -2, trust: -1 }, n: 'Great photos, no pilots.' },
      { t: 'Quarterly challenges with paid pilots for winners', c: 35, e: { reach: 4, trust: 3, path: 2 }, n: 'A steady drumbeat of challenges with a pilot at the end builds a pipeline.' },
    ],
  },
  {
    id: 'hackathons', name: 'Hackathons', icon: 'code',
    desc: 'Hackathons can surface new talent and fresh approaches quickly. What kind will you run?',
    opts: [
      { t: 'Internal-only hack day', c: 5, e: { safe: 1 }, n: 'Fun, but the same people with the same ideas.' },
      { t: 'Open hackathon with real operational data', c: 15, e: { reach: 2, data: 2, safe: 1, prob: 1 }, n: 'Real data in front of fresh eyes reveals what is possible.' },
      { t: 'Open hackathon with follow-on funding for top teams', c: 25, e: { reach: 3, path: 2, trust: 2, data: 1 }, n: 'Follow-on funding turns weekend prototypes into pilots.' },
      { t: 'A huge livestreamed hackathon at a stadium', c: 38, e: { reach: 1, focus: -2 }, n: 'Lots of noise, very little follow-through.' },
    ],
  },
  {
    id: 'data', name: 'Data sharing', icon: 'database',
    desc: 'Innovators need real data to build anything useful. How will you share it?',
    opts: [
      { t: 'Data stays on site servers, sign an NDA to ask', c: 0, e: { data: -2, trust: -1 }, n: 'Locked-up data means every pilot starts from zero.' },
      { t: 'Share sanitised sample datasets', c: 8, e: { data: 1, reach: 1 }, n: 'A start, but samples rarely capture the messy reality.' },
      { t: 'Secure data sandbox for approved innovators', c: 22, e: { data: 4, trust: 1, path: 1 }, n: 'A sandbox gives real access without real risk.' },
      { t: 'Build an enterprise data lake first, share later', c: 45, e: { data: 1, focus: -2 }, n: 'Years of plumbing before any innovator sees a byte.' },
    ],
  },
  {
    id: 'pilotsite', name: 'Pilot sites', icon: 'flag',
    desc: 'New technology needs somewhere to be tested in the real world. Where will pilots run?',
    opts: [
      { t: 'Squeeze pilots in around production', c: 0, e: { path: -1, champ: -2 }, n: 'Production always wins, so pilots stall and sites resent them.' },
      { t: 'Dedicated pilot zone at one site', c: 22, e: { path: 3, champ: 2, safe: 1 }, n: 'A protected space to test, close to real operations.' },
      { t: 'Rotate pilots across all sites', c: 32, e: { path: 2, champ: 3, focus: -1 }, n: 'Spreads ownership, at some cost to focus.' },
      { t: 'Build an off-site innovation test mine', c: 50, e: { path: 2, champ: -1, reach: 1 }, n: 'Impressive, but far from the people who must adopt the result.' },
    ],
  },
  {
    id: 'procurement', name: 'Procurement for startups', icon: 'contract',
    desc: 'Startups have months of runway, not years. How will you buy from them?',
    opts: [
      { t: 'Same onboarding as a major contractor', c: 0, e: { path: -3, trust: -2 }, n: 'A nine-month onboarding kills startups before the pilot starts.' },
      { t: 'Faster payment terms only', c: 5, e: { trust: 2 }, n: 'Helps cash flow, but onboarding is still a wall.' },
      { t: 'Lightweight pilot contract and 30-day onboarding', c: 14, e: { path: 4, trust: 3 }, n: 'Cheap and powerful: removes the biggest barrier to working together.' },
      { t: 'A separate innovation procurement team', c: 30, e: { path: 2, trust: 1 }, n: 'Helps, but another team adds another queue.' },
    ],
  },
  {
    id: 'ip', name: 'IP and commercial terms', icon: 'key',
    desc: 'Who owns what when an innovator solves your problem?',
    opts: [
      { t: 'We own all IP developed in our pilots', c: 0, e: { trust: -4, reach: -2 }, n: 'The best innovators simply stop showing up.' },
      { t: 'Negotiate case by case', c: 8, e: { trust: 1, path: -1 }, n: 'Fair, but every deal takes months of legal back and forth.' },
      { t: 'Standard fair terms: innovator keeps IP, we get a licence', c: 10, e: { trust: 4, reach: 1, path: 1 }, n: 'Clear, fair terms build trust and speed everything up.' },
      { t: 'Swap equity for IP', c: 30, e: { reach: 1, focus: -1 }, n: 'Turns pilots into investment decisions, which slows everything.' },
    ],
  },
  {
    id: 'champions', name: 'Site champions', icon: 'helmet',
    desc: 'Someone on site has to own each new technology. How will you build that ownership?',
    opts: [
      { t: 'Innovation is head office\'s job', c: 0, e: { champ: -3 }, n: 'Sites treat head office projects as someone else\'s problem.' },
      { t: 'Nominate a champion per site, no time allocated', c: 5, e: { champ: 1 }, n: 'A title without time is a title without impact.' },
      { t: '20% time for site champions, with KPIs', c: 24, e: { champ: 4, safe: 1 }, n: 'Real time and real goals make champions effective.' },
      { t: 'Rotate operators into the innovation team', c: 34, e: { champ: 3, safe: 2, prob: 1 }, n: 'Operators bring credibility and real problems back and forth.' },
    ],
  },
  {
    id: 'venture', name: 'Corporate venture fund', icon: 'coins',
    desc: 'Some miners invest directly in startups. Should you?',
    opts: [
      { t: 'No venture investing', c: 0, e: {}, n: 'No harm done, no help either.' },
      { t: 'Co-invest alongside specialist VCs', c: 22, e: { reach: 2, trust: 1, path: 1 }, n: 'Specialists bring deal flow and discipline.' },
      { t: 'Buy promising startups outright', c: 40, e: { trust: -2, path: 1, reach: -1 }, n: 'Founders leave, the culture clashes and others get nervous.' },
      { t: 'Launch a $100M flagship fund with fanfare', c: 50, e: { reach: 3, focus: -2 }, n: 'Big headlines, and a lot of money chasing deals.' },
    ],
  },
  {
    id: 'scouting', name: 'Technology scouting', icon: 'search',
    desc: 'How will you find the technologies and people that can solve your problems?',
    opts: [
      { t: 'Wait for vendors to pitch us', c: 0, e: { reach: -1, focus: -1 }, n: 'You see whoever has the best sales team, not the best solution.' },
      { t: 'Attend mining conferences', c: 8, e: { reach: 1 }, n: 'Useful, but you meet the same people every year.' },
      { t: 'Partner with an open innovation ecosystem', c: 18, e: { reach: 4, trust: 1, prob: 1 }, n: 'An existing global network gets you to the right innovators fast.' },
      { t: 'Scouts in every global tech hub', c: 40, e: { reach: 3, focus: -1 }, n: 'Wide reach, high cost and lots of noise to sort through.' },
    ],
  },
  {
    id: 'stagegate', name: 'Stage-gate process', icon: 'gate',
    desc: 'How will you decide what to fund, continue and kill?',
    opts: [
      { t: 'No process: fund whatever the CEO likes', c: 0, e: { focus: -3, safe: -1 }, n: 'Pet projects crowd out real problems.' },
      { t: 'Annual portfolio review only', c: 5, e: { focus: 1 }, n: 'Better than nothing, but a year is a long time for a startup.' },
      { t: 'Lightweight three-gate process with clear kill criteria', c: 14, e: { focus: 4, path: 2, safe: 1 }, n: 'Fast decisions and clear criteria. Killing pilots early is a feature.' },
      { t: 'Seven-gate process with committee sign-off', c: 12, e: { focus: 1, path: -3, safe: -2 }, n: 'Rigorous on paper, glacial in practice.' },
    ],
  },
  {
    id: 'consortia', name: 'Industry collaboration', icon: 'link',
    desc: 'Many mining problems are shared across the industry. Will you work with your peers?',
    opts: [
      { t: 'Go it alone and keep everything secret', c: 0, e: { reach: -2, trust: -1 }, n: 'You pay for every problem alone.' },
      { t: 'Join an industry consortium', c: 14, e: { reach: 2, prob: 1 }, n: 'Shared learning at a shared cost.' },
      { t: 'Co-fund pre-competitive challenges with peers', c: 24, e: { reach: 3, trust: 2, data: 1, prob: 1 }, n: 'Bigger prizes, bigger datasets and a bigger market for innovators.' },
      { t: 'Launch your own branded consortium', c: 40, e: { reach: 2, focus: -1 }, n: 'Peers are wary of joining a competitor\'s club.' },
    ],
  },
  {
    id: 'culture', name: 'Permission to fail', icon: 'spark',
    desc: 'Most pilots should fail. How will you treat the people running them?',
    opts: [
      { t: 'Failed pilots go in performance reviews', c: 0, e: { safe: -4 }, n: 'Nobody volunteers for anything risky again.' },
      { t: 'Celebrate innovation wins only', c: 5, e: { safe: -1 }, n: 'Quietly teaches people to hide failures.' },
      { t: 'Share lessons from every closed pilot', c: 10, e: { safe: 3, prob: 1 }, n: 'Failures become knowledge, which makes the next pilot cheaper.' },
      { t: 'Innovation awards, including "best failure"', c: 20, e: { safe: 4 }, n: 'Makes trying things visible and rewarded.' },
    ],
  },
  {
    id: 'team', name: 'Innovation team structure', icon: 'people',
    desc: 'How will you organise the people who run innovation?',
    opts: [
      { t: 'Outsource innovation to a consultancy', c: -15, e: { champ: -2, safe: -1, trust: -1, focus: -1 }, n: 'Frees up budget, but nobody inside owns the outcome.' },
      { t: 'One innovation manager reporting to IT', c: 0, e: { champ: -1, path: -1 }, n: 'One person cannot carry a portfolio.' },
      { t: 'Small central team plus embedded site squads', c: 28, e: { champ: 3, path: 2, prob: 1 }, n: 'Central coordination with real presence on site.' },
      { t: 'A gleaming innovation lab in the city', c: 36, e: { reach: 2, champ: -3, safe: 1 }, n: 'An ivory tower a thousand kilometres from the pit.' },
    ],
  },
  {
    id: 'scale', name: 'Scaling successful pilots', icon: 'stairs',
    desc: 'A pilot works. What happens next?',
    opts: [
      { t: 'Hand it over to operations and hope', c: 0, e: { path: -2 }, n: 'Without support, successful pilots wither.' },
      { t: 'Wait for three more pilots to be sure', c: 5, e: { path: -1, trust: -2 }, n: 'Welcome to pilot purgatory.' },
      { t: 'Business case template for scale-up', c: 10, e: { path: 2, focus: 1 }, n: 'A clear route to funding helps.' },
      { t: 'Dedicated scale-up budget for proven pilots', c: 30, e: { path: 5, champ: 1 }, n: 'Money ready for winners is the fastest route to adoption.' },
    ],
  },
  {
    id: 'measure', name: 'Measuring innovation', icon: 'gauge',
    desc: 'What will you report to the board?',
    opts: [
      { t: 'Number of ideas submitted', c: 0, e: { focus: -2 }, n: 'Vanity metrics reward activity, not outcomes.' },
      { t: 'Number of pilots launched', c: 5, e: { focus: -1, path: -1 }, n: 'Rewards starting things, not finishing them.' },
      { t: 'Value against site KPIs: $/t, safety, emissions', c: 14, e: { focus: 3, prob: 2, champ: 1 }, n: 'Speaks the language of operations and the board.' },
      { t: 'Annual benefits audit by a big consulting firm', c: 34, e: { focus: 1 }, n: 'Expensive and backward-looking.' },
    ],
  },
  {
    id: 'skills', name: 'Innovation skills', icon: 'book',
    desc: 'Your leaders need new skills to run open innovation. How will you build them?',
    opts: [
      { t: 'No training budget', c: 0, e: { safe: -1 }, n: 'People fall back on what they know.' },
      { t: 'Self-paced e-learning', c: 5, e: { safe: 1 }, n: 'Low cost, low completion.' },
      { t: 'Innovation methods training for site leaders', c: 18, e: { champ: 2, prob: 2, safe: 1 }, n: 'Site leaders who can frame problems and run trials.' },
      { t: 'Send executives on a Silicon Valley tour', c: 34, e: { reach: 1, safe: 1, champ: -1 }, n: 'Inspiring, but it does not translate to a remote mine site.' },
    ],
  },
  {
    id: 'connectivity', name: 'Site connectivity', icon: 'signal',
    desc: 'Most new mining technology needs data from the field. How connected are your sites?',
    opts: [
      { t: 'Leave site networks as they are', c: 0, e: { data: -2 }, n: 'Pilots keep failing on connectivity, not technology.' },
      { t: 'Fix connectivity at the pilot site', c: 18, e: { data: 3, path: 1 }, n: 'Targeted and effective.' },
      { t: 'Build a custom in-house IoT platform', c: 38, e: { data: 1, path: -1, focus: -1 }, n: 'Now you are a software company maintaining a platform.' },
      { t: 'Private LTE across all sites', c: 50, e: { data: 4, path: 2 }, n: 'Expensive, but it unlocks the field for everyone.' },
    ],
  },
  {
    id: 'community', name: 'Community and local suppliers', icon: 'home',
    desc: 'Your communities and local suppliers have ideas and a stake in your success. How will you involve them?',
    opts: [
      { t: 'A glossy sustainability report', c: 8, e: { focus: -1 }, n: 'Words, not partnerships.' },
      { t: 'Local supplier innovation program', c: 15, e: { reach: 2, trust: 2, prob: 1 }, n: 'Local businesses know your sites and stay for the long run.' },
      { t: 'Co-design solutions with Traditional Owners and community', c: 20, e: { trust: 2, prob: 2, safe: 1, reach: 1 }, n: 'Better problems, better solutions and a stronger social licence.' },
      { t: 'Engage only when legally required', c: 0, e: { trust: -1, reach: -1 }, n: 'You miss local knowledge and goodwill.' },
    ],
  },
  {
    id: 'sponsor', name: 'Executive sponsorship', icon: 'star',
    desc: 'Innovation needs air cover from the top. What will you ask of the executive team?',
    opts: [
      { t: 'CEO mentions innovation in the annual report', c: 0, e: {}, n: 'Nice words, no change.' },
      { t: 'Monthly innovation update to the exec', c: 5, e: { focus: 1, champ: 1 }, n: 'Visibility helps.' },
      { t: 'COO co-owns the innovation portfolio', c: 14, e: { champ: 3, path: 3, focus: 2 }, n: 'When operations co-owns innovation, sites follow.' },
      { t: 'An innovation board of famous outsiders', c: 25, e: { reach: 1, focus: -1 }, n: 'Interesting dinners, little operational pull.' },
    ],
  },
];

// Events: one-off driver changes (e), optional budget change (b, % of tenure budget) and an explanation (r).
const EVENTS = [
  {
    id: 'gm', title: 'The site GM says no',
    body: 'The general manager at your biggest site refuses to host a pilot. "We are behind on tonnes this quarter. I cannot have a startup wandering around my pit."',
    choices: [
      { t: 'Escalate to the CEO and force it through', e: { champ: -8, safe: -3 }, r: 'You won the argument and lost the site. Operations will remember this.' },
      { t: 'Ask the GM which problem would make their quarter easier, and pilot that', e: { champ: 7, prob: 4 }, r: 'The GM now has a stake in the pilot. Solving their problem turned a blocker into a champion.' },
      { t: 'Shelve the pilot indefinitely', e: { trust: -5, path: -3 }, r: 'The startup had hired two people for this pilot. Word spreads that you cancel late.' },
    ],
  },
  {
    id: 'cash', title: 'Startup runs out of runway',
    body: 'A startup halfway through a promising trial tells you it will run out of cash in six weeks.',
    choices: [
      { t: 'Not our problem. Let the market decide.', e: { trust: -6, path: -4, reach: -2 }, r: 'The trial dies with the startup, and other innovators notice how you treat partners.' },
      { t: 'Pay milestone invoices early and introduce them to investors', b: -2, e: { trust: 7, reach: 3, path: 2 }, r: 'A small cost to you, and a lifeline for them. Partners talk about how you show up.' },
      { t: 'Acquire them at a bargain price', b: -10, e: { trust: -3, path: 2, focus: -2 }, r: 'The founders leave within a year and your team now owns a product it cannot maintain.' },
    ],
  },
  {
    id: 'crash', title: 'Copper price crash',
    body: 'Commodity prices have dropped sharply. The CFO wants a 30% cut to the innovation budget, today.',
    choices: [
      { t: 'Cut everything evenly by 30%', b: -6, e: { focus: -4, safe: -2 }, r: 'Every project is now underfunded and none of them can finish.' },
      { t: 'Kill low-value pilots and protect the ones with measured value', b: -6, e: { focus: 6, prob: 2, trust: -1 }, r: 'Painful, but the CFO saw you make hard calls based on value. Your portfolio is stronger.' },
      { t: 'Argue innovation is too important to cut', e: { champ: -5, focus: -2 }, r: 'Site teams are cutting overtime and contractors. Your team looks out of touch.' },
    ],
  },
  {
    id: 'infosec', title: 'IT security blocks data access',
    body: 'IT security has blocked external innovators from accessing operational data. "Too risky," says the CISO.',
    choices: [
      { t: 'Accept it. Data stays inside.', e: { data: -6, trust: -2 }, r: 'Innovators are now building solutions without seeing your data. Results suffer.' },
      { t: 'Co-design a ring-fenced data environment with IT', e: { data: 6, champ: 1, trust: 1 }, r: 'IT is now a partner rather than a gatekeeper, and innovators get safe access.' },
      { t: 'Just email the data across on the quiet', e: { data: 3, safe: -4, champ: -3 }, r: 'It worked until IT found out. Now everyone is more nervous about data, not less.' },
    ],
  },
  {
    id: 'union', title: 'Automation worries',
    body: 'Operators are worried that the autonomous drill trial will cost them their jobs. The union wants a meeting.',
    choices: [
      { t: 'Push ahead. It is a business decision.', e: { champ: -7, safe: -4 }, r: 'The trial continues, but operators will not help it succeed.' },
      { t: 'Bring operators into trial design and plan retraining together', e: { champ: 7, safe: 3, prob: 2 }, r: 'Operators spotted three problems the vendor missed. They now want the trial to work.' },
      { t: 'Quietly pause all automation pilots', e: { path: -4, focus: -2 }, r: 'The concerns were not addressed, only postponed.' },
    ],
  },
  {
    id: 'rival', title: 'A rival announces autonomous haulage',
    body: 'A competitor announces a fleet of autonomous haul trucks. The board asks: "Where is ours?"',
    choices: [
      { t: 'Announce a bigger, splashier program next week', e: { focus: -6, reach: 1 }, r: 'You now have a press release to deliver on and no plan for it.' },
      { t: 'Walk the board through your portfolio and the problems it solves', e: { focus: 5, prob: 2 }, r: 'The board leaves understanding why your priorities fit your mines, not theirs.' },
      { t: 'Sign up with the same vendor immediately', e: { path: 1, focus: -3, prob: -2 }, r: 'Their problem is not your problem. Your haul roads are very different.' },
    ],
  },
  {
    id: 'stall', title: 'Success, then silence',
    body: 'A predictive maintenance pilot cut unplanned downtime by 18%. But there is no budget line to roll it out.',
    choices: [
      { t: 'Wait for next year\'s budget cycle', e: { path: -4, trust: -3 }, r: 'Twelve months is a long time for a startup with a payroll to meet.' },
      { t: 'Get the COO to fund the roll-out from the operating budget', e: { path: 7, champ: 3 }, r: 'Operations is now paying for it, which means operations is now owning it.' },
      { t: 'Run another pilot at a different site to be sure', e: { path: -3, trust: -2, focus: -2 }, r: 'Welcome to pilot purgatory. The startup wonders what proof would ever be enough.' },
    ],
  },
  {
    id: 'theatre', title: 'Innovation theatre',
    body: 'Marketing wants a photo of the CEO wearing VR goggles in front of a robot dog for the annual report.',
    choices: [
      { t: 'Great press. Book the robot dog.', e: { reach: 2, focus: -4, champ: -3 }, r: 'Site teams roll their eyes. The robot dog has never been near a mine.' },
      { t: 'Offer a real story from a site using new technology', e: { focus: 3, champ: 4 }, r: 'The site team is proud to be featured, and other sites want in.' },
      { t: 'Do both. Why not?', e: { reach: 1, focus: -2 }, r: 'The robot dog got the cover. The real story got page 47.' },
    ],
  },
  {
    id: 'nearmiss', title: 'Near miss during a drone trial',
    body: 'A drone survey trial has a near miss with a light vehicle. Nobody was hurt.',
    choices: [
      { t: 'Ban all drone trials company-wide', e: { safe: -6, path: -3 }, r: 'Every drone program stops, including the ones with good safety records.' },
      { t: 'Run a joint investigation with the startup and share the lessons', e: { safe: 5, trust: 3, champ: 2 }, r: 'The fix was a simple exclusion zone. Sites trust the process more than before.' },
      { t: 'Blame the startup and terminate the contract', e: { trust: -7, safe: -3 }, r: 'The root cause was a site procedure, so it can happen again. Startups take note.' },
    ],
  },
  {
    id: 'esg', title: 'Investors want decarbonisation',
    body: 'Major investors are pushing for real progress on reducing diesel use across your fleet.',
    choices: [
      { t: 'Buy carbon offsets and move on', e: { focus: -2, prob: -1 }, r: 'Investors ask the same question next year, with less patience.' },
      { t: 'Run an open challenge on diesel displacement, with real site data', e: { reach: 4, prob: 4, data: 2 }, r: 'Battery, trolley-assist and hydrogen teams from four countries now know your problem.' },
      { t: 'Commission a net zero strategy deck', e: { focus: -1 }, r: 'It has 84 slides and no pilots.' },
    ],
  },
  {
    id: 'flood', title: 'Too many ideas',
    body: 'Your ideas portal received 2,000 submissions. Your team of four is overwhelmed.',
    choices: [
      { t: 'Reply to none of them', e: { trust: -6, reach: -3 }, r: 'Two thousand innovators now think you are a black hole.' },
      { t: 'Triage against your problem statements and reply to everyone within two weeks', e: { trust: 5, prob: 2, focus: 2 }, r: 'Most got a polite no. Twelve got a meeting. Everyone knows where they stand.' },
      { t: 'Hire temps to read every one in detail', b: -5, e: { trust: 1, focus: -2 }, r: 'Expensive, slow, and the temps did not know what problems you were trying to solve.' },
    ],
  },
  {
    id: 'nih', title: '"We could build that ourselves"',
    body: 'Your engineering team says the startup\'s sensor is simple. "Give us six months and we will build our own."',
    choices: [
      { t: 'Let engineering build it in-house', e: { path: -3, trust: -3, focus: -2, champ: 2 }, r: 'Eighteen months later the in-house version is still in testing.' },
      { t: 'Make the engineers the technical owners of the startup partnership', e: { champ: 5, path: 3, trust: 2 }, r: 'The engineers improved the product and now champion it at other sites.' },
      { t: 'Overrule engineering', e: { champ: -5, safe: -2 }, r: 'The startup is in, but the engineers will not help it succeed.' },
    ],
  },
  {
    id: 'lockin', title: 'An offer that sounds too good',
    body: 'A large equipment maker offers free sensors across your fleet if you use their closed data platform exclusively.',
    choices: [
      { t: 'Sign the exclusive deal', b: 5, e: { reach: -5, data: -4 }, r: 'You saved money, but now no other innovator can access your fleet data.' },
      { t: 'Insist on open data standards', e: { data: 4, reach: 2 }, r: 'They agreed. Your data is now usable by any innovator you choose.' },
      { t: 'Sign for one site as a trial', e: { data: -1, reach: -1 }, r: 'One site is now locked in. Watch that contract renewal.' },
    ],
  },
  {
    id: 'uni', title: 'University partnership',
    body: 'A university offers a five-year PhD research program on ore sorting.',
    choices: [
      { t: 'Sign up. Research is always good.', b: -4, e: { focus: -2, reach: 2 }, r: 'Interesting papers will arrive around the time your mine plan changes.' },
      { t: 'Scope it to one site problem with a 12-month deliverable', b: -2, e: { prob: 3, reach: 3, focus: 1 }, r: 'Researchers love a real problem, and you get results this year.' },
      { t: 'Decline. No time for academics.', e: { reach: -3 }, r: 'Some of the best ideas in mining start in universities. You will not see them.' },
    ],
  },
  {
    id: 'ceo', title: 'New CEO, hard question',
    body: 'A new CEO starts and asks you one thing: "What has innovation actually delivered?"',
    choices: [
      { t: 'Show the number of ideas, events and startups engaged', e: { focus: -3, champ: -2 }, r: 'The CEO nods politely and asks the CFO about your budget.' },
      { t: 'Show value delivered in site KPI terms', e: { focus: 4, champ: 3 }, r: 'Dollars per tonne and hours of downtime saved. The CEO asks how to do more.' },
      { t: 'Promise a moonshot by next year', e: { focus: -5, safe: -2 }, r: 'You now have a deadline for something nobody knows how to do.' },
    ],
  },
  {
    id: 'poached', title: 'Your best people are poached',
    body: 'A tech company has offered your two best innovation leads double their salaries.',
    choices: [
      { t: 'Counter-offer with a big pay rise', b: -5, e: { safe: 1 }, r: 'They stay for now. Everyone else on the team has heard about the raise.' },
      { t: 'Spread their knowledge across site champions before they go', e: { champ: 3, safe: 2, prob: 1 }, r: 'The knowledge stays even if the people do not.' },
      { t: 'Freeze hiring and carry on', e: { safe: -3, path: -2 }, r: 'The remaining team is stretched and two pilots stall.' },
    ],
  },
  {
    id: 'outage', title: 'Connectivity outage',
    body: 'A network outage at a remote site stops a remote operations pilot mid-trial.',
    choices: [
      { t: 'Blame the startup for not planning for it', e: { trust: -5 }, r: 'The network was your responsibility. The startup knows it.' },
      { t: 'Fix it with the startup and IT, and build in resilience', e: { data: 4, trust: 2 }, r: 'The site network is better for everyone now.' },
      { t: 'Cancel the pilot', e: { path: -3, focus: -1 }, r: 'The technology worked. The network did not.' },
    ],
  },
  {
    id: 'purgatory', title: 'The pilot audit',
    body: 'Internal audit finds 40 active pilots and none scaled in two years. The board wants an explanation.',
    choices: [
      { t: 'Launch 20 more pilots to improve the odds', e: { focus: -6, path: -2 }, r: 'More pilots, same problem. Audit will be back.' },
      { t: 'Kill 30, double down on the few with measured value', e: { focus: 7, path: 3, trust: -2 }, r: 'Some startups are disappointed, but the survivors finally get the support to scale.' },
      { t: 'Rename pilots "proofs of value"', e: { focus: -2 }, r: 'Audit was not fooled.' },
    ],
  },
];

const YEARS = 3;
const QUARTERS = 4;
const MAX_PER_YEAR = 3;
const INIT_SCALE = 0.85;
const FIRE_BELOW = 35;

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

function metricsFrom(nodes) {
  const out = {};
  for (const m of METRICS) {
    let s = 0;
    for (const k in m.w) s += m.w[k] * nodes[k];
    out[m.id] = clamp(20 + 0.8 * s);
  }
  return out;
}

const avg = (ms) => METRICS.reduce((s, m) => s + ms[m.id], 0) / METRICS.length;

function tier(score) {
  if (score >= 90) return { id: 'elite', name: 'Elite', award: 'The Mother Lode' };
  if (score >= 75) return { id: 'high', name: 'High', award: 'A Rich Vein' };
  if (score >= 55) return { id: 'medium', name: 'Medium', award: 'Low-Grade Ore' };
  return { id: 'low', name: 'Low', award: 'Straight to Tailings' };
}

function shuffle(a, rnd = Math.random) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function newGame(companyId, player, rnd = Math.random) {
  const co = COMPANIES.find((c) => c.id === companyId);
  const nodes = { ...co.nodes };
  const m0 = metricsFrom(nodes);
  return {
    player, companyId, nodes, budget: 100,
    funded: [], // { id, opt, year }
    year: 1, quarter: 0, // quarter 0 = planning
    history: [m0],
    deck: shuffle(EVENTS.map((e) => e.id), rnd).slice(0, YEARS * QUARTERS),
    log: [], // { year, quarter, event, choice }
    status: 'playing',
  };
}

const company = (s) => COMPANIES.find((c) => c.id === s.companyId);
const initById = (id) => INITIATIVES.find((i) => i.id === id);
const eventById = (id) => EVENTS.find((e) => e.id === id);
const fundedThisYear = (s) => s.funded.filter((f) => f.year === s.year);

function canFund(s, id, opt) {
  if (s.funded.some((f) => f.id === id)) return false;
  if (fundedThisYear(s).length >= MAX_PER_YEAR) return false;
  return initById(id).opts[opt].c <= s.budget + 1e-9;
}

function fund(s, id, opt) {
  if (!canFund(s, id, opt)) return false;
  s.budget = clamp(s.budget - initById(id).opts[opt].c, 0, 999);
  s.funded.push({ id, opt, year: s.year });
  return true;
}

function unfund(s, id) {
  const i = s.funded.findIndex((f) => f.id === id && f.year === s.year);
  if (i < 0) return;
  s.budget += initById(s.funded[i].id).opts[s.funded[i].opt].c;
  s.funded.splice(i, 1);
}

function currentEvent(s) {
  return eventById(s.deck[(s.year - 1) * QUARTERS + (s.quarter - 1)]);
}

function startYear(s) {
  s.quarter = 1;
}

// Resolve the quarter's event choice, then let funded initiatives and company drag play out.
function playQuarter(s, choiceIdx) {
  const ev = currentEvent(s);
  const ch = ev.choices[choiceIdx];
  const before = s.history[s.history.length - 1];
  for (const k in ch.e) s.nodes[k] = clamp(s.nodes[k] + ch.e[k]);
  if (ch.b) s.budget = clamp(s.budget + ch.b, 0, 999);
  for (const f of s.funded) {
    const e = initById(f.id).opts[f.opt].e;
    for (const k in e) s.nodes[k] = clamp(s.nodes[k] + e[k] * INIT_SCALE);
  }
  const drag = company(s).drag;
  for (const k in drag) s.nodes[k] = clamp(s.nodes[k] + drag[k]);
  const after = metricsFrom(s.nodes);
  s.history.push(after);
  s.log.push({ year: s.year, quarter: s.quarter, event: ev.id, choice: choiceIdx });
  if (avg(after) < FIRE_BELOW) s.status = 'fired';
  else if (s.quarter === QUARTERS) {
    if (s.year === YEARS) s.status = 'done';
    else { s.year += 1; s.quarter = 0; }
  } else s.quarter += 1;
  return { ev, ch, before, after };
}

// Rough quality of a choice for the debrief: driver changes weighted by how much each driver feeds the metrics.
const NODE_WEIGHT = (() => {
  const w = {};
  for (const k in NODES) w[k] = 0;
  for (const m of METRICS) for (const k in m.w) w[k] += m.w[k];
  return w;
})();

function impact(e) {
  let s = 0;
  for (const k in e) s += e[k] * NODE_WEIGHT[k];
  return s;
}

const ENGINE = {
  NODES, NODE_TIPS, METRICS, COMPANIES, INITIATIVES, EVENTS, YEARS, QUARTERS, MAX_PER_YEAR, FIRE_BELOW,
  metricsFrom, avg, tier, newGame, company, initById, eventById, fundedThisYear, canFund, fund, unfund,
  currentEvent, startYear, playQuarter, impact, shuffle,
};

if (typeof module !== 'undefined') module.exports = ENGINE;
