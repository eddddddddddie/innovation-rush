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

// Unearthed's services, from the sales master copy (capability statements, October 2026). Public-safe text only:
// no client names, case studies or unconfirmed figures, because the game is published openly.
const UNEARTHED = {
  stats: [
    { n: '200+', label: 'innovation challenges', why: 'Each a defined problem put to a global network.' },
    { n: '10,000+', label: 'innovators in network', why: 'Deployment history and reference sites that are not public.' },
    { n: '1,000+', label: 'startups supported', why: 'Taken through to industrial trials.' },
    { n: '12', label: 'years operating', why: 'Claims checked against site results.' },
  ],
  stages: [
    { id: 'scope', n: '01', name: 'Scope', title: 'Problem framing with your teams' },
    { id: 'scout', n: '02', name: 'Scout', title: 'Global search, across industries' },
    { id: 'evaluate', n: '03', name: 'Evaluate', title: 'Technical and commercial diligence' },
    { id: 'pilot', n: '04', name: 'Pilot', title: 'Pilot designed for adoption' },
    { id: 'scale', n: '05', name: 'Scale', title: 'Hand-off and support after the pilot' },
  ],
  forms: {
    vendor: { cta: 'Start with a vendor check', name: 'Vendor checks', what: 'A short written view on a company or approach: deployment history, evidence and fit.', outcome: 'Faster decisions on what warrants your teams\' time', timing: 'Usually within days' },
    options: { cta: 'Start with an options assessment', name: 'Options assessment', what: 'Problem definition, global search, vendor and reference-user engagement, and assessment.', outcome: 'An evidence-based shortlist and test work recommendation', timing: 'Typically 1 to 6 weeks' },
    challenge: { cta: 'Start with an open innovation challenge', name: 'Open innovation challenge', what: 'A defined problem put to our global network, with submissions screened with your teams.', outcome: 'Options from beyond your usual suppliers', timing: 'Around 3 months' },
    pilots: { cta: 'Start with test work', name: 'Test work and pilots', what: 'Tests scoped with vendors and laboratories, samples arranged and results tracked.', outcome: 'Answers to the questions your operation needs answered', timing: 'As options progress' },
    review: { cta: 'Start with a periodic technology review', name: 'Periodic technology review', what: 'Relevant developments reviewed against your priorities at an agreed interval.', outcome: 'Technologies seen as they emerge', timing: 'For example quarterly' },
  },
  // For each hidden driver: the form of work and stage that address it, and how.
  help: {
    prob: { form: 'options', stages: ['scope'], how: 'We frame the problem with your site teams before anyone looks for technology, so innovators are solving something real and measurable.' },
    reach: { form: 'challenge', stages: ['scout'], how: 'We put your problem to a global network of more than 10,000 innovators, including technology proven outside mining.' },
    trust: { form: 'challenge', stages: ['scout'], how: 'Our commercial relationships are with industrial companies only, so technology developers share performance and cost data with us that is not published.' },
    path: { form: 'pilots', stages: ['pilot', 'scale'], how: 'We apply technical, commercial and adoption diligence upfront and design pilots for adoption, so trials progress to deployment.' },
    focus: { form: 'vendor', stages: ['evaluate'], how: 'Every claim is graded as independently verified, operator-reported or company-supplied, so you fund what has been proven, at the scale you need.' },
    data: { form: 'pilots', stages: ['pilot'], how: 'We scope test work with vendors and laboratories and arrange samples, so innovators are tested against your material and conditions.' },
    champ: { form: 'options', stages: ['scope', 'evaluate'], how: 'We work with the people who will run the technology from problem framing onwards, so sites own the choice rather than inherit it.' },
    safe: { form: 'vendor', stages: ['evaluate'], how: 'A vendor check within days gives your teams a low-risk way to test an idea before committing anyone to a trial.' },
  },
  contact: { web: 'https://unearthed.solutions', email: 'industry@unearthed.solutions', privacy: 'https://unearthed.solutions/privacy-and-terms' },
  // Lead capture on the scorecard posts to this HubSpot form (Forms API v3, no login needed). Leave formGuid empty to hide the form.
  // The form needs these fields: firstname, lastname, email, company, jobtitle, message. Game results go in message.
  hubspot: { portalId: '44410384', formGuid: '' },
};

const METRICS = [
  { id: 'eco', name: 'Ecosystem', desc: 'Innovators, researchers and partners working on your problems', w: { reach: 0.4, trust: 0.35, prob: 0.25 } },
  { id: 'adopt', name: 'Adoption', desc: 'Pilots that make it into production across your sites', w: { path: 0.3, champ: 0.3, safe: 0.15, data: 0.15, focus: 0.1 } },
  { id: 'value', name: 'Value', desc: 'Measured cost, safety, productivity and emissions impact', w: { prob: 0.3, focus: 0.3, path: 0.2, data: 0.2 } },
  { id: 'buyin', name: 'Buy-in', desc: 'How much site leaders trust and back your innovation team', w: { champ: 0.4, safe: 0.2, focus: 0.2, prob: 0.2 } },
];

const COMPANIES = [
  {
    id: 'junior', name: 'Lucky Strike Resources', size: 'Junior explorer', budget: 40, mascot: 'nugget', difficulty: 'Gentle',
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
    id: 'mid', name: 'Copper Canyon Mining', size: 'Mid-tier producer', budget: 300, mascot: 'truck', difficulty: 'Moderate',
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
    id: 'major', name: 'Big Rocks', size: 'Global major', budget: 1200, mascot: 'rock', difficulty: 'Brutal',
    blurb: 'Thirty sites on four continents, a famous brand and a big budget. Also seven approval committees and a long memory.',
    welcome: [
      'We have an innovation lab, a venture fund and a very nice video about the future of mining.',
      'What we do not have is many new technologies running on our sites. Startups say we are slow and hard to work with.',
      'You have the budget. Can you get this rock rolling before the board loses patience?',
    ],
    nodes: { prob: 44, safe: 40, data: 50, path: 34, reach: 62, champ: 40, trust: 42, focus: 38 },
    drag: { path: -0.9, safe: -0.5, champ: -0.3 },
  },
];

// Each option: t = text, c = cost as % of the company's tenure budget (negative returns credits; converted to whole Crib Credits by costOf),
// e = effect per quarter on hidden drivers, n = debrief note, u = something Unearthed delivers for mining companies.
const INITIATIVES = [
  {
    id: 'problems', name: 'Problem statements', icon: 'target',
    desc: 'Innovators can only solve problems they understand. How will you decide what you want solved?',
    opts: [
      { t: 'Let innovators guess what we need', c: 0, e: { prob: -1, focus: -1 }, n: 'Without clear problems you get solutions looking for a home.' },
      { t: 'Annual wishlist from head office', c: 8, e: { prob: 1, champ: -1 }, n: 'Head office wishlists rarely match what hurts on site.' },
      { t: 'Workshop problems with site teams', u: true, c: 15, e: { prob: 4, champ: 2, focus: 1 }, n: 'Problems defined with the people who live them give innovators a real target.' },
      { t: 'Consultants write a 200-page technology roadmap', c: 35, e: { prob: 1, focus: -1, champ: -1 }, n: 'Expensive, and the roadmap described technologies, not problems.' },
    ],
  },
  {
    id: 'challenges', name: 'Open innovation challenges', icon: 'globe',
    desc: 'Take your problems to the global ecosystem of startups, researchers and other industries. What format?',
    opts: [
      { t: 'Put an "ideas portal" on the website', c: 0, e: { reach: 1, trust: -2, focus: -1 }, n: 'Portals without problems or replies become black holes that innovators learn to avoid.' },
      { t: 'One global challenge on a real site problem, with data', u: true, c: 18, e: { reach: 3, prob: 1, data: 1, trust: 2 }, n: 'A real problem, real data and a real prize brings serious solvers.' },
      { t: 'Celebrity-judged innovation awards night', c: 28, e: { reach: 1, focus: -2, trust: -1 }, n: 'Great photos, no pilots.' },
      { t: 'Quarterly challenges with paid pilots for winners', u: true, c: 35, e: { reach: 4, trust: 3, path: 2 }, n: 'A steady drumbeat of challenges with a pilot at the end builds a pipeline.' },
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
      { t: 'Partner with an open innovation ecosystem', u: true, c: 18, e: { reach: 4, trust: 1, prob: 1 }, n: 'An existing global network gets you to the right innovators fast.' },
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
      { t: 'Co-fund pre-competitive challenges with peers', u: true, c: 24, e: { reach: 3, trust: 2, data: 1, prob: 1 }, n: 'Bigger prizes, bigger datasets and a bigger market for innovators.' },
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
    id: 'gm', fit: 'Unearthed frames problems with site teams before any technology is chosen, so a pilot starts from the problem the site already has.', title: 'The site GM says no',
    body: 'The general manager at your biggest site refuses to host a pilot. "We are behind on tonnes this quarter. I cannot have a startup wandering around my pit."',
    choices: [
      { t: 'Escalate to the CEO and force it through', e: { champ: -8, safe: -3 }, r: 'You won the argument and lost the site. Operations will remember this.' },
      { t: 'Ask the GM which problem would make their quarter easier, and pilot that', e: { champ: 7, prob: 4 }, r: 'The GM now has a stake in the pilot. Solving their problem turned a blocker into a champion.' },
      { t: 'Shelve the pilot indefinitely', e: { trust: -5, path: -3 }, r: 'The startup had hired two people for this pilot. Word spreads that you cancel late.' },
    ],
  },
  {
    id: 'cash', fit: "An Unearthed vendor check gives a short written view of a company's deployment history, evidence and fit before you commit a trial to it.", title: 'Startup runs out of runway',
    body: 'A startup halfway through a promising trial tells you it will run out of cash in six weeks.',
    choices: [
      { t: 'Not our problem. Let the market decide.', e: { trust: -6, path: -4, reach: -2 }, r: 'The trial dies with the startup, and other innovators notice how you treat partners.' },
      { t: 'Pay milestone invoices early and introduce them to investors', b: -2, e: { trust: 7, reach: 3, path: 2 }, r: 'A small cost to you, and a lifeline for them. Partners talk about how you show up.' },
      { t: 'Acquire them at a bargain price', b: -10, e: { trust: -3, path: 2, focus: -2 }, r: 'The founders leave within a year and your team now owns a product it cannot maintain.' },
    ],
  },
  {
    id: 'crash', fit: 'Unearthed grades every claim as verified, operator-reported or company-supplied, which makes it easier to defend what to keep when budgets are cut.', title: 'Copper price crash',
    body: 'Commodity prices have dropped sharply. The CFO wants a 30% cut to the innovation budget, today.',
    choices: [
      { t: 'Cut everything evenly by 30%', b: -6, e: { focus: -4, safe: -2 }, r: 'Every project is now underfunded and none of them can finish.' },
      { t: 'Kill low-value pilots and protect the ones with measured value', b: -6, e: { focus: 6, prob: 2, trust: -1 }, r: 'Painful, but the CFO saw you make hard calls based on value. Your portfolio is stronger.' },
      { t: 'Argue innovation is too important to cut', e: { champ: -5, focus: -2 }, r: 'Site teams are cutting overtime and contractors. Your team looks out of touch.' },
    ],
  },
  {
    id: 'infosec', fit: 'Unearthed scopes test work with vendors and laboratories and arranges samples, so access questions are settled before a trial starts.', title: 'IT security blocks data access',
    body: 'IT security has blocked external innovators from accessing operational data. "Too risky," says the CISO.',
    choices: [
      { t: 'Accept it. Data stays inside.', e: { data: -6, trust: -2 }, r: 'Innovators are now building solutions without seeing your data. Results suffer.' },
      { t: 'Co-design a ring-fenced data environment with IT', e: { data: 6, champ: 1, trust: 1 }, r: 'IT is now a partner rather than a gatekeeper, and innovators get safe access.' },
      { t: 'Just email the data across on the quiet', e: { data: 3, safe: -4, champ: -3 }, r: 'It worked until IT found out. Now everyone is more nervous about data, not less.' },
    ],
  },
  {
    id: 'union', fit: 'Unearthed designs pilots for adoption, working with the people who will run the technology from problem framing onwards.', title: 'Automation worries',
    body: 'Operators are worried that the autonomous drill trial will cost them their jobs. The union wants a meeting.',
    choices: [
      { t: 'Push ahead. It is a business decision.', e: { champ: -7, safe: -4 }, r: 'The trial continues, but operators will not help it succeed.' },
      { t: 'Bring operators into trial design and plan retraining together', e: { champ: 7, safe: 3, prob: 2 }, r: 'Operators spotted three problems the vendor missed. They now want the trial to work.' },
      { t: 'Quietly pause all automation pilots', e: { path: -4, focus: -2 }, r: 'The concerns were not addressed, only postponed.' },
    ],
  },
  {
    id: 'rival', fit: 'An Unearthed periodic technology review shows you relevant developments against your priorities, before a competitor announces them.', title: 'A rival announces autonomous haulage',
    body: 'A competitor announces a fleet of autonomous haul trucks. The board asks: "Where is ours?"',
    choices: [
      { t: 'Announce a bigger, splashier program next week', e: { focus: -6, reach: 1 }, r: 'You now have a press release to deliver on and no plan for it.' },
      { t: 'Walk the board through your portfolio and the problems it solves', e: { focus: 5, prob: 2 }, r: 'The board leaves understanding why your priorities fit your mines, not theirs.' },
      { t: 'Sign up with the same vendor immediately', e: { path: 1, focus: -3, prob: -2 }, r: 'Their problem is not your problem. Your haul roads are very different.' },
    ],
  },
  {
    id: 'stall', fit: 'Unearthed supports the hand-off after a pilot, so successful trials progress to deployment instead of stalling.', title: 'Success, then silence',
    body: 'A predictive maintenance pilot cut unplanned downtime by 18%. But there is no budget line to roll it out.',
    choices: [
      { t: 'Wait for next year\'s budget cycle', e: { path: -4, trust: -3 }, r: 'Twelve months is a long time for a startup with a payroll to meet.' },
      { t: 'Get the COO to fund the roll-out from the operating budget', e: { path: 7, champ: 3 }, r: 'Operations is now paying for it, which means operations is now owning it.' },
      { t: 'Run another pilot at a different site to be sure', e: { path: -3, trust: -2, focus: -2 }, r: 'Welcome to pilot purgatory. The startup wonders what proof would ever be enough.' },
    ],
  },
  {
    id: 'theatre', fit: 'Unearthed grades evidence by source, so you can tell results proven on site from a demo.', title: 'Innovation theatre',
    body: 'Marketing wants a photo of the CEO wearing VR goggles in front of a robot dog for the annual report.',
    choices: [
      { t: 'Great press. Book the robot dog.', e: { reach: 2, focus: -4, champ: -3 }, r: 'Site teams roll their eyes. The robot dog has never been near a mine.' },
      { t: 'Offer a real story from a site using new technology', e: { focus: 3, champ: 4 }, r: 'The site team is proud to be featured, and other sites want in.' },
      { t: 'Do both. Why not?', e: { reach: 1, focus: -2 }, r: 'The robot dog got the cover. The real story got page 47.' },
    ],
  },
  {
    id: 'nearmiss', fit: 'Unearthed scopes test work with vendors and tracks the results, so lessons from a trial are captured rather than lost.', title: 'Near miss during a drone trial',
    body: 'A drone survey trial has a near miss with a light vehicle. Nobody was hurt.',
    choices: [
      { t: 'Ban all drone trials company-wide', e: { safe: -6, path: -3 }, r: 'Every drone program stops, including the ones with good safety records.' },
      { t: 'Run a joint investigation with the startup and share the lessons', e: { safe: 5, trust: 3, champ: 2 }, r: 'The fix was a simple exclusion zone. Sites trust the process more than before.' },
      { t: 'Blame the startup and terminate the contract', e: { trust: -7, safe: -3 }, r: 'The root cause was a site procedure, so it can happen again. Startups take note.' },
    ],
  },
  {
    id: 'esg', fit: 'An Unearthed open innovation challenge puts a defined problem like diesel displacement to a global network of more than 10,000 innovators.', title: 'Investors want decarbonisation',
    body: 'Major investors are pushing for real progress on reducing diesel use across your fleet.',
    choices: [
      { t: 'Buy carbon offsets and move on', e: { focus: -2, prob: -1 }, r: 'Investors ask the same question next year, with less patience.' },
      { t: 'Run an open challenge on diesel displacement, with real site data', u: true, e: { reach: 4, prob: 4, data: 2 }, r: 'Battery, trolley-assist and hydrogen teams from four countries now know your problem.' },
      { t: 'Commission a net zero strategy deck', e: { focus: -1 }, r: 'It has 84 slides and no pilots.' },
    ],
  },
  {
    id: 'flood', fit: 'In an Unearthed challenge, submissions are screened with your teams against one defined problem, so the volume stays manageable.', title: 'Too many ideas',
    body: 'Your ideas portal received 2,000 submissions. Your team of four is overwhelmed.',
    choices: [
      { t: 'Reply to none of them', e: { trust: -6, reach: -3 }, r: 'Two thousand innovators now think you are a black hole.' },
      { t: 'Triage against your problem statements and reply to everyone within two weeks', e: { trust: 5, prob: 2, focus: 2 }, r: 'Most got a polite no. Twelve got a meeting. Everyone knows where they stand.' },
      { t: 'Hire temps to read every one in detail', b: -5, e: { trust: 1, focus: -2 }, r: 'Expensive, slow, and the temps did not know what problems you were trying to solve.' },
    ],
  },
  {
    id: 'nih', fit: 'Unearthed works alongside internal engineering and R&D teams, extending their search rather than duplicating it.', title: '"We could build that ourselves"',
    body: 'Your engineering team says the startup\'s sensor is simple. "Give us six months and we will build our own."',
    choices: [
      { t: 'Let engineering build it in-house', e: { path: -3, trust: -3, focus: -2, champ: 2 }, r: 'Eighteen months later the in-house version is still in testing.' },
      { t: 'Make the engineers the technical owners of the startup partnership', e: { champ: 5, path: 3, trust: 2 }, r: 'The engineers improved the product and now champion it at other sites.' },
      { t: 'Overrule engineering', e: { champ: -5, safe: -2 }, r: 'The startup is in, but the engineers will not help it succeed.' },
    ],
  },
  {
    id: 'lockin', fit: 'Unearthed searches globally and across industries, so you can compare options beyond a single equipment maker.', title: 'An offer that sounds too good',
    body: 'A large equipment maker offers free sensors across your fleet if you use their closed data platform exclusively.',
    choices: [
      { t: 'Sign the exclusive deal', b: 5, e: { reach: -5, data: -4 }, r: 'You saved money, but now no other innovator can access your fleet data.' },
      { t: 'Insist on open data standards', e: { data: 4, reach: 2 }, r: 'They agreed. Your data is now usable by any innovator you choose.' },
      { t: 'Sign for one site as a trial', e: { data: -1, reach: -1 }, r: 'One site is now locked in. Watch that contract renewal.' },
    ],
  },
  {
    id: 'uni', fit: 'An Unearthed options assessment starts with problem definition, so any research partner knows what result you need and by when.', title: 'University partnership',
    body: 'A university offers a five-year PhD research program on ore sorting.',
    choices: [
      { t: 'Sign up. Research is always good.', b: -4, e: { focus: -2, reach: 2 }, r: 'Interesting papers will arrive around the time your mine plan changes.' },
      { t: 'Scope it to one site problem with a 12-month deliverable', b: -2, e: { prob: 3, reach: 3, focus: 1 }, r: 'Researchers love a real problem, and you get results this year.' },
      { t: 'Decline. No time for academics.', e: { reach: -3 }, r: 'Some of the best ideas in mining start in universities. You will not see them.' },
    ],
  },
  {
    id: 'ceo', fit: 'Unearthed assessments grade evidence and track results, so the value story you take to a new CEO can be checked.', title: 'New CEO, hard question',
    body: 'A new CEO starts and asks you one thing: "What has innovation actually delivered?"',
    choices: [
      { t: 'Show the number of ideas, events and startups engaged', e: { focus: -3, champ: -2 }, r: 'The CEO nods politely and asks the CFO about your budget.' },
      { t: 'Show value delivered in site KPI terms', e: { focus: 4, champ: 3 }, r: 'Dollars per tonne and hours of downtime saved. The CEO asks how to do more.' },
      { t: 'Promise a moonshot by next year', e: { focus: -5, safe: -2 }, r: 'You now have a deadline for something nobody knows how to do.' },
    ],
  },
  {
    id: 'poached', fit: 'Unearthed works alongside internal teams, extending their search rather than duplicating it, so knowledge does not walk out the door with one person.', title: 'Your best people are poached',
    body: 'A tech company has offered your two best innovation leads double their salaries.',
    choices: [
      { t: 'Counter-offer with a big pay rise', b: -5, e: { safe: 1 }, r: 'They stay for now. Everyone else on the team has heard about the raise.' },
      { t: 'Spread their knowledge across site champions before they go', e: { champ: 3, safe: 2, prob: 1 }, r: 'The knowledge stays even if the people do not.' },
      { t: 'Freeze hiring and carry on', e: { safe: -3, path: -2 }, r: 'The remaining team is stretched and two pilots stall.' },
    ],
  },
  {
    id: 'outage', fit: 'Unearthed scopes test work with vendors, including the site conditions a trial depends on, before the trial starts.', title: 'Connectivity outage',
    body: 'A network outage at a remote site stops a remote operations pilot mid-trial.',
    choices: [
      { t: 'Blame the startup for not planning for it', e: { trust: -5 }, r: 'The network was your responsibility. The startup knows it.' },
      { t: 'Fix it with the startup and IT, and build in resilience', e: { data: 4, trust: 2 }, r: 'The site network is better for everyone now.' },
      { t: 'Cancel the pilot', e: { path: -3, focus: -1 }, r: 'The technology worked. The network did not.' },
    ],
  },
  {
    id: 'purgatory', fit: 'Unearthed applies technical, commercial and adoption diligence upfront, so trials progress to deployment instead of piling up.', title: 'The pilot audit',
    body: 'Internal audit finds 40 active pilots and none scaled in two years. The board wants an explanation.',
    choices: [
      { t: 'Launch 20 more pilots to improve the odds', e: { focus: -6, path: -2 }, r: 'More pilots, same problem. Audit will be back.' },
      { t: 'Kill 30, double down on the few with measured value', e: { focus: 7, path: 3, trust: -2 }, r: 'Some startups are disappointed, but the survivors finally get the support to scale.' },
      { t: 'Rename pilots "proofs of value"', e: { focus: -2 }, r: 'Audit was not fooled.' },
    ],
  },
];

// Site problems that feed the technology pipeline. Each game draws two per year.
// Approaches are fictional innovators described by sector and country, never by name. q is the hidden evidence grade
// (A strongest); outside marks technology from outside mining. The outside-mining A approaches for underground
// positioning, heap leach irrigation and drilling follow the examples in Unearthed's sales master copy.
const PROBLEMS = [
  {
    id: 'tyres', title: 'Haul truck tyres are wearing out early', v: 1,
    detail: 'Tyres on the Pit 2 fleet are lasting well short of their rated hours, and each one costs more than a family car.',
    vendor: { t: 'Upgraded tyre package from your equipment supplier', q: 'C' },
    approaches: [
      { t: 'Machine-vision haul road inspection', from: 'Agricultural vision startup, New Zealand', outside: true, q: 'A' },
      { t: 'Tyre pressure and temperature telemetry', from: 'Motorsport telemetry firm, United Kingdom', outside: true, q: 'B' },
      { t: 'Haul road maintenance scheduling software', from: 'Logistics software scale-up, Netherlands', outside: true, q: 'B' },
      { t: 'Premium tyre compound trial', from: 'Tyre manufacturer', outside: false, q: 'C' },
    ],
  },
  {
    id: 'flotation', title: 'Flotation recovery has dropped 3%', v: 1.2,
    detail: 'The concentrator is losing copper to tailings and nobody can agree why.',
    vendor: { t: 'Flotation cell upgrade from your equipment supplier', q: 'C' },
    approaches: [
      { t: 'Online froth imaging and control', from: 'Food processing vision company, Denmark', outside: true, q: 'A' },
      { t: 'Reagent dosing optimiser', from: 'Chemical process control firm, Germany', outside: true, q: 'B' },
      { t: 'Bubble size sensor', from: 'University spin-out, Chile', outside: false, q: 'B' },
      { t: 'Larger replacement flotation cells', from: 'Mining equipment vendor', outside: false, q: 'C' },
    ],
  },
  {
    id: 'dust', title: 'Dust exceedances at the ROM pad', v: 0.9,
    detail: 'Dust monitors keep tripping limits, and the community has started calling.',
    vendor: { t: 'More water carts from your site contractor', q: 'C' },
    approaches: [
      { t: 'Dust forecasting from weather data', from: 'Agricultural weather analytics firm, Australia', outside: true, q: 'A' },
      { t: 'Automated water cannon control', from: 'Firefighting equipment maker, United States', outside: true, q: 'B' },
      { t: 'Long-life dust suppressant polymer', from: 'Road construction chemicals supplier, South Africa', outside: true, q: 'B' },
      { t: 'Extra water carts on night shift', from: 'Local earthmoving contractor', outside: false, q: 'C' },
    ],
  },
  {
    id: 'underground', title: 'Losing track of equipment underground', v: 1.1,
    detail: 'GPS does not work underground, so loaders and people are tracked by radio calls and a whiteboard.',
    vendor: { t: 'Radio network upgrade from your communications vendor', q: 'C' },
    approaches: [
      { t: 'Inertial navigation without GPS', from: 'Defence navigation startup, Norway', outside: true, q: 'A' },
      { t: 'Bluetooth tag tracking', from: 'Warehouse tracking scale-up, Canada', outside: true, q: 'B' },
      { t: 'Lidar mapping on loaders', from: 'Autonomous vehicle supplier, Germany', outside: true, q: 'B' },
      { t: 'Upgraded leaky feeder radio', from: 'Mine communications vendor', outside: false, q: 'C' },
    ],
  },
  {
    id: 'heap', title: 'Uneven irrigation on the heap leach pads', v: 1,
    detail: 'Some cells are flooded while others dry out, and recovery is suffering.',
    vendor: { t: 'Bigger pumps from your equipment supplier', q: 'C' },
    approaches: [
      { t: 'Zoned wireless irrigation control', from: 'Agricultural irrigation company, Israel', outside: true, q: 'A' },
      { t: 'Drone thermal surveys of the pads', from: 'Drone survey firm, Peru', outside: true, q: 'B' },
      { t: 'Moisture sensing cables', from: 'Civil engineering sensor maker, Switzerland', outside: true, q: 'B' },
      { t: 'More manual pad inspections', from: 'Labour hire contractor', outside: false, q: 'C' },
    ],
  },
  {
    id: 'drilling', title: 'Slow, costly drilling for orebody knowledge', v: 1.1,
    detail: 'Grade control drilling is the bottleneck in the mine plan, and assays take two weeks to come back.',
    vendor: { t: 'Two more drill rigs from your drilling contractor', q: 'C' },
    approaches: [
      { t: 'Downhole sensing while drilling', from: 'Planetary drilling systems developer, United States', outside: true, q: 'A' },
      { t: 'Portable XRF analysis at the rig', from: 'Scrap metal sorting firm, Belgium', outside: true, q: 'B' },
      { t: 'AI core photo logging', from: 'Medical imaging software company, Canada', outside: true, q: 'B' },
      { t: 'Faster assay turnaround contract', from: 'Commercial laboratory', outside: false, q: 'C' },
    ],
  },
  {
    id: 'diesel', title: 'The haul fleet diesel bill keeps climbing', v: 1.2,
    detail: 'Diesel is now one of the biggest costs on site, and the board wants emissions down.',
    vendor: { t: 'Fuel additive trial from your fuel supplier', q: 'C' },
    approaches: [
      { t: 'Trolley assist on the main ramp', from: 'Rail electrification contractor, Sweden', outside: true, q: 'A' },
      { t: 'Fuel analytics from truck data', from: 'Airline fuel analytics firm, Ireland', outside: true, q: 'B' },
      { t: 'Battery swap for light vehicles', from: 'Electric bus operator, South Korea', outside: true, q: 'B' },
      { t: 'Idle time reduction campaign', from: 'Mining consultancy', outside: false, q: 'C' },
    ],
  },
  {
    id: 'conveyor', title: 'The overland conveyor keeps breaking down', v: 1,
    detail: 'Unplanned stops on the overland conveyor cost hours of throughput every week.',
    vendor: { t: 'Shorter inspection intervals from your maintenance contractor', q: 'C' },
    approaches: [
      { t: 'Acoustic idler failure detection', from: 'Wind turbine monitoring company, Denmark', outside: true, q: 'A' },
      { t: 'Belt rip detection cameras', from: 'Airport baggage systems supplier, Netherlands', outside: true, q: 'B' },
      { t: 'Thermal drone inspections', from: 'Power line inspection firm, Australia', outside: true, q: 'B' },
      { t: 'Replacement idlers from a new supplier', from: 'Conveyor parts distributor', outside: false, q: 'C' },
    ],
  },
];

// Ways to source a solution for a site problem. c is the cost as % of the company budget.
const ROUTES = {
  vendor: { name: 'Ask your usual vendor', c: 5, note: 'Cheap and fast. You get what they sell.' },
  challenge: { name: 'Run an Unearthed open challenge', c: 10, u: true, note: 'Takes a quarter. Three submissions from the global network, often from outside mining.' },
  inhouse: { name: 'Build it in-house', c: 8, note: 'Your engineers build it. Slower to start, and sites own the result.' },
};

// Pipeline stages and what drives the odds of passing each one.
const STAGES = [
  { id: 'evaluate', name: 'Evaluate', base: 0.85, drivers: ['prob', 'focus'], fail: 'did not stack up and was stopped' },
  { id: 'pilot', name: 'Pilot', base: 0.62, drivers: ['data', 'safe', 'champ'], fail: 'stalled in pilot purgatory' },
  { id: 'scale', name: 'Scale', base: 0.6, drivers: ['path', 'champ'], fail: 'stalled before roll-out' },
];
const GRADE_ODDS = { A: 0.15, B: 0, C: -0.25 };

// Events now land in 8 of the 12 quarters; the rest are quiet quarters for the pipeline.
const EVENT_QUARTERS = { 1: [1, 3], 2: [1, 2, 4], 3: [1, 3, 4] };

const ACHIEVEMENTS = [
  { id: 'purgatory', name: 'Out of purgatory', desc: 'Scale three or more technologies.' },
  { id: 'quick', name: 'Fast mover', desc: 'Scale a technology in Year 1.' },
  { id: 'open', name: 'Open door', desc: 'Run three or more Unearthed open challenges.' },
  { id: 'outside', name: 'Outside the pit', desc: 'Scale a technology from outside mining.' },
  { id: 'verify', name: 'Trust but verify', desc: 'Use all your vendor checks.' },
  { id: 'frugal', name: 'Tight-fisted', desc: 'Finish High or better with a quarter of your Crib Credits left.' },
  { id: 'board', name: 'Board favourite', desc: 'Win a credit top-up at both board meetings.' },
  { id: 'clean', name: 'Clean pipeline', desc: 'Scale at least one technology and finish with nothing stuck in purgatory.' },
  { id: 'lode', name: 'The mother lode', desc: 'Finish Elite.' },
  { id: 'rocks', name: 'Moved the mountain', desc: 'Finish your tenure at Big Rocks without being fired.' },
];

const YEARS = 3;
const QUARTERS = 4;
const MAX_PER_YEAR = 3;
const FIRE_BELOW = 35;
const VENDOR_CHECKS = 3;
// Balance settings. tools/simulate.js can override them (TUNE='{"initScale":0.7}') without editing this file.
const TUNE = {
  initScale: 0.7, // share of an initiative's per-quarter effect applied each quarter
  scaleBonus: { value: 4.5, adopt: 3.5, buyin: 1.2 }, // permanent metric gain when a technology scales, times the problem's v
  challengeEco: 1.5, // permanent Ecosystem gain for each open challenge run
  metricBase: 22, metricMult: 0.7, // metric = base + mult x weighted drivers + pipeline bonus; drivers alone top out near 85
  routeScale: 0.6, // multiplier on sourcing route costs
};

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
let rng = Math.random; // swappable for seeded simulation
const setRng = (fn) => { rng = fn; };

function metricsFrom(nodes, bonus) {
  const out = {};
  for (const m of METRICS) {
    let s = 0;
    for (const k in m.w) s += m.w[k] * nodes[k];
    out[m.id] = clamp(TUNE.metricBase + TUNE.metricMult * s + (bonus ? bonus[m.id] || 0 : 0));
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

function shuffle(a, rnd = rng) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const eventCount = () => Object.values(EVENT_QUARTERS).reduce((n, q) => n + q.length, 0);

function newGame(companyId, player) {
  const co = COMPANIES.find((c) => c.id === companyId);
  const nodes = { ...co.nodes };
  const bonus = { eco: 0, adopt: 0, value: 0, buyin: 0 };
  const probs = shuffle(PROBLEMS.map((p) => p.id)).slice(0, YEARS * 2);
  return {
    player, companyId, nodes, bonus, budget: co.budget, // Crib Credits left
    checks: VENDOR_CHECKS, checked: [], // Unearthed vendor checks left, and the keys they were used on
    funded: [], // { id, opt, year }
    problems: { 1: probs.slice(0, 2), 2: probs.slice(2, 4), 3: probs.slice(4, 6) },
    sourcing: [], // { pid, year, route }
    techs: [], // technologies in the pipeline
    picks: [], // open challenges waiting for the player to choose a submission: { pid, year, options: [approach index] }
    price: [100], // copper price index, one point per quarter
    boards: [], // year-end board reviews
    news: [], // what happened in the pipeline last quarter
    year: 1, quarter: 0, // quarter 0 = planning
    history: [metricsFrom(nodes, bonus)],
    deck: shuffle(EVENTS.map((e) => e.id)).slice(0, eventCount()),
    log: [], // { year, quarter, event, choice }
    status: 'playing',
  };
}

const company = (s) => COMPANIES.find((c) => c.id === s.companyId);
const initById = (id) => INITIATIVES.find((i) => i.id === id);
const eventById = (id) => EVENTS.find((e) => e.id === id);
const problemById = (id) => PROBLEMS.find((p) => p.id === id);
const fundedThisYear = (s) => s.funded.filter((f) => f.year === s.year);
const metrics = (s) => metricsFrom(s.nodes, s.bonus);
const qIndex = (y, q) => (y - 1) * QUARTERS + q; // 1..12

// Costs in whole Crib Credits for this company (negative means credits come back).
const credits = (s, pct) => Math.round((pct * company(s).budget) / 100);
const costOf = (s, id, opt) => credits(s, initById(id).opts[opt].c);
const routeCost = (s, route) => credits(s, ROUTES[route].c * TUNE.routeScale);

function canFund(s, id, opt) {
  if (s.funded.some((f) => f.id === id)) return false;
  if (fundedThisYear(s).length >= MAX_PER_YEAR) return false;
  return costOf(s, id, opt) <= s.budget;
}

function fund(s, id, opt) {
  if (!canFund(s, id, opt)) return false;
  s.budget = Math.max(0, s.budget - costOf(s, id, opt));
  s.funded.push({ id, opt, year: s.year });
  return true;
}

function unfund(s, id) {
  const i = s.funded.findIndex((f) => f.id === id && f.year === s.year);
  if (i < 0) return;
  s.budget += costOf(s, s.funded[i].id, s.funded[i].opt);
  s.funded.splice(i, 1);
}

// Choose (or clear, with route null) how to source a solution for one of this year's site problems.
function source(s, pid, route) {
  const cur = s.sourcing.find((x) => x.pid === pid && x.year === s.year);
  const refund = cur ? routeCost(s, cur.route) : 0;
  if (route && routeCost(s, route) > s.budget + refund) return false;
  if (cur) { s.budget += refund; s.sourcing.splice(s.sourcing.indexOf(cur), 1); }
  if (route) { s.budget -= routeCost(s, route); s.sourcing.push({ pid, year: s.year, route }); }
  return true;
}

// Unearthed vendor check: reveals evidence grades for one initiative, event or challenge's options.
function useCheck(s, key) {
  if (s.checks <= 0 || s.checked.includes(key)) return false;
  s.checks -= 1;
  s.checked.push(key);
  return true;
}

// A = strongest option, B = helps, C = no help or backfires. Mirrors Unearthed's evidence grading.
function grades(items) {
  const imp = items.map((it) => impact(it.e));
  const max = Math.max(...imp);
  return imp.map((v) => (v >= max - 1e-9 ? 'A' : v > 0 ? 'B' : 'C'));
}

const isEventQuarter = (y, q) => EVENT_QUARTERS[y].includes(q);

function currentEvent(s) {
  if (!isEventQuarter(s.year, s.quarter)) return null;
  let n = 0;
  for (let y = 1; y <= s.year; y++) for (const q of EVENT_QUARTERS[y]) { if (y === s.year && q === s.quarter) return eventById(s.deck[n]); n++; }
  return null;
}

function makeTech(s, pid, a, route, ready) {
  const tech = { id: `${pid}-${s.techs.length}`, pid, t: a.t, from: a.from, outside: !!a.outside, q: a.q, route, stage: 0, stalls: 0, status: 'active', ready, year: s.year };
  s.techs.push(tech);
  return tech;
}

// Start the year: launch the sourcing chosen in planning.
function startYear(s) {
  s.quarter = 1;
  s.news = [];
  for (const src of s.sourcing.filter((x) => x.year === s.year)) {
    const pr = problemById(src.pid);
    if (src.route === 'vendor') makeTech(s, pr.id, { ...pr.vendor, from: 'Your usual supplier', outside: false }, 'vendor', qIndex(s.year, 1));
    if (src.route === 'inhouse') {
      makeTech(s, pr.id, { t: `In-house build: ${pr.title.toLowerCase()}`, from: 'Your own engineering team', outside: false, q: 'B' }, 'inhouse', qIndex(s.year, 2));
      s.nodes.champ = clamp(s.nodes.champ + 3);
    }
    if (src.route === 'challenge') s.bonus.eco += TUNE.challengeEco;
  }
}

// Chance that a technology passes its next stage, from its evidence grade and the drivers that matter at that stage.
function odds(s, tech) {
  const st = STAGES[tech.stage];
  const d = st.drivers.reduce((a, k) => a + s.nodes[k], 0) / st.drivers.length;
  let p = st.base + GRADE_ODDS[tech.q] + ((d - 50) / 100) * 0.8 - 0.12 * tech.stalls;
  if (tech.route === 'inhouse' && st.id === 'scale') p += 0.05;
  return clamp(p, 0.05, 0.95);
}

// The player picks one challenge submission; it enters Evaluate next quarter.
function pickSubmission(s, pid, idx) {
  const i = s.picks.findIndex((x) => x.pid === pid);
  if (i < 0) return false;
  const pick = s.picks[i];
  const a = problemById(pid).approaches[pick.options[idx]];
  const t = makeTech(s, pid, a, 'challenge', qIndex(s.year, s.quarter === 0 ? 1 : s.quarter));
  s.picks.splice(i, 1);
  return t;
}

function stepPipeline(s, qi) {
  const news = [];
  for (const t of s.techs) {
    if (t.status !== 'active' || qi < t.ready) continue;
    const st = STAGES[t.stage];
    const p = odds(s, t);
    if (rng() < p) {
      t.stalls = 0;
      if (t.stage === STAGES.length - 1) {
        t.status = 'running';
        t.scaledAt = qi;
        const v = problemById(t.pid).v;
        for (const k in TUNE.scaleBonus) s.bonus[k] += TUNE.scaleBonus[k] * v;
        news.push({ t, ok: true, text: `${t.t} passed ${st.name} and is now running on site`, p });
      } else {
        t.stage += 1;
        news.push({ t, ok: true, text: `${t.t} passed ${st.name}`, p });
      }
    } else if (t.stage === 0) {
      t.status = 'stopped';
      news.push({ t, ok: false, text: `${t.t} ${st.fail}`, p });
    } else {
      t.stalls += 1;
      s.bonus.buyin -= 1;
      if (t.stalls >= 2) { t.status = 'stopped'; s.bonus.buyin -= 1; news.push({ t, ok: false, text: `${t.t} ${st.fail} twice and was abandoned`, p }); }
      else news.push({ t, ok: false, text: `${t.t} ${st.fail}`, p, stalled: true });
    }
  }
  // Open challenges close at the end of the first quarter: three submissions, always including the strongest.
  if (s.quarter === 1) {
    for (const src of s.sourcing.filter((x) => x.year === s.year && x.route === 'challenge')) {
      const pr = problemById(src.pid);
      const best = pr.approaches.findIndex((a) => a.q === 'A');
      const others = shuffle(pr.approaches.map((_, i) => i).filter((i) => i !== best)).slice(0, 2);
      s.picks.push({ pid: pr.id, year: s.year, options: shuffle([best, ...others]) });
      news.push({ ok: true, text: `Your open challenge closed. Three submissions are in for: ${pr.title}`, challenge: pr.id });
    }
  }
  return news;
}

function stepPrice(s, shock) {
  const prev = s.price[s.price.length - 1];
  const drift = (100 - prev) * 0.08;
  let next = prev + drift + (rng() - 0.5) * 16;
  if (shock) next *= shock;
  s.price.push(Math.max(40, Math.round(next * 10) / 10));
}

// Year-end board review: credits topped up or cut by performance and the copper price over the year.
function boardReview(s) {
  const m = metrics(s);
  const a = avg(m);
  const p0 = s.price[qIndex(s.year, 1) - 1];
  const p1 = s.price[s.price.length - 1];
  const priceChange = p1 / p0 - 1;
  let pct = a >= 72 ? 15 : a >= 62 ? 5 : -10;
  if (priceChange > 0.08) pct += 5;
  if (priceChange < -0.08) pct -= 5;
  const delta = credits(s, pct);
  s.budget = Math.max(0, s.budget + delta);
  const review = { year: s.year, avg: a, priceChange, pct, delta, mood: pct >= 15 ? 'delighted' : pct > 0 ? 'satisfied' : pct === 0 ? 'unmoved' : 'unhappy' };
  s.boards.push(review);
  return review;
}

// Resolve the quarter: event (if any), initiatives and company drag, pipeline, copper price, then year-end review.
function playQuarter(s, choiceIdx) {
  const ev = currentEvent(s);
  const ch = ev ? ev.choices[choiceIdx] : null;
  const before = s.history[s.history.length - 1];
  if (ch) {
    for (const k in ch.e) s.nodes[k] = clamp(s.nodes[k] + ch.e[k]);
    if (ch.b) s.budget = Math.max(0, s.budget + credits(s, ch.b));
  }
  for (const f of s.funded) {
    const e = initById(f.id).opts[f.opt].e;
    for (const k in e) s.nodes[k] = clamp(s.nodes[k] + e[k] * TUNE.initScale);
  }
  const drag = company(s).drag;
  for (const k in drag) s.nodes[k] = clamp(s.nodes[k] + drag[k]);
  const qi = qIndex(s.year, s.quarter);
  s.news = stepPipeline(s, qi);
  stepPrice(s, ev && ev.id === 'crash' ? 0.75 : null);
  const after = metrics(s);
  s.history.push(after);
  if (ev) s.log.push({ year: s.year, quarter: s.quarter, event: ev.id, choice: choiceIdx });
  let board = null;
  if (avg(after) < FIRE_BELOW) s.status = 'fired';
  else if (s.quarter === QUARTERS) {
    if (s.year === YEARS) s.status = 'done';
    else { board = boardReview(s); s.year += 1; s.quarter = 0; }
  } else s.quarter += 1;
  return { ev, ch, before, after, news: s.news, board };
}

// Achievements earned in a finished (or fired) game.
function achievements(s) {
  const scaled = s.techs.filter((t) => t.status === 'running');
  const score = avg(metrics(s));
  const done = s.status === 'done';
  const got = new Set();
  if (scaled.length >= 3) got.add('purgatory');
  if (scaled.some((t) => t.scaledAt <= QUARTERS)) got.add('quick');
  if (s.sourcing.filter((x) => x.route === 'challenge').length >= 3) got.add('open');
  if (scaled.some((t) => t.outside)) got.add('outside');
  if (s.checks === 0) got.add('verify');
  if (done && score >= 75 && s.budget >= company(s).budget * 0.25) got.add('frugal');
  if (s.boards.length === 2 && s.boards.every((b) => b.delta > 0)) got.add('board');
  if (done && scaled.length && !s.techs.some((t) => t.status === 'active' && t.stalls > 0)) got.add('clean');
  if (done && score >= 90) got.add('lode');
  if (done && s.companyId === 'major') got.add('rocks');
  return ACHIEVEMENTS.filter((a) => got.has(a.id));
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
  NODES, NODE_TIPS, UNEARTHED, METRICS, COMPANIES, INITIATIVES, EVENTS, PROBLEMS, ROUTES, STAGES, ACHIEVEMENTS, EVENT_QUARTERS,
  YEARS, QUARTERS, MAX_PER_YEAR, FIRE_BELOW, VENDOR_CHECKS, TUNE,
  metricsFrom, metrics, avg, tier, newGame, company, initById, eventById, problemById, fundedThisYear, credits, costOf, routeCost,
  canFund, fund, unfund, source, useCheck, grades, isEventQuarter, currentEvent, startYear, odds, pickSubmission, playQuarter,
  achievements, impact, shuffle, setRng, qIndex, eventCount,
};

if (typeof module !== 'undefined') module.exports = ENGINE;
