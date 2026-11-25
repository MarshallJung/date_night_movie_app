import type {
  MercyVetoMovie,
  MovieDossier,
  QuizQuestion,
  StreamingServiceOption,
} from './types.ts';

export const HERO_EDITORIAL_IMAGE =
  '/src/assets/images/hero_parlor_editorial_1795547743417.jpg';

export const STREAMING_SERVICES: StreamingServiceOption[] = [
  { id: 'prime', name: 'Prime Video' },
  { id: 'netflix', name: 'Netflix' },
  { id: 'hulu', name: 'Hulu' },
  { id: 'disney', name: 'Disney+' },
  { id: 'max', name: 'Max' },
  { id: 'apple', name: 'Apple TV+' },
  { id: 'peacock', name: 'Peacock' },
  { id: 'paramount', name: 'Paramount+' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'scandal',
    chapterLabel: 'Chapter I of IV',
    prompt: 'Which estate scandal intrigues you tonight?',
    options: [
      {
        id: 'swindled-benefactress',
        label: 'A Swindled Inheritance & Ruined Benefactress',
        detail: 'A gentlewoman of modest means undone by fashionable metropolitan scoundrels.',
      },
      {
        id: 'arrogant-heir',
        label: 'An Arrogant Heir Shielded by High Society',
        detail: 'A privileged scion whose powerful guardians believe him above consequence.',
      },
      {
        id: 'forbidden-return',
        label: 'A Solitary Gentleman Called Out of Retirement',
        detail: 'One final matter of honor draws a quiet outsider back into the drawing rooms of power.',
      },
      {
        id: 'family-devotion',
        label: 'A Desperate Journey to Rescue Kin Across Distant Shires',
        detail: 'Unwavering devotion tested against distance, secrecy, and entrenched privilege.',
      },
    ],
  },
  {
    id: 'heroMood',
    chapterLabel: 'Chapter II of IV',
    prompt: 'How brooding should our gentleman hero be?',
    options: [
      {
        id: 'taciturn-principled',
        label: 'Taciturn, Principled & Fiercely Devoted',
        detail: 'Speaks sparingly, yet acts with unshakeable moral certainty when wrong is done.',
      },
      {
        id: 'mysterious-pedigree',
        label: 'Haunted by a Mysterious Military Pedigree',
        detail: 'Possesses an unstated past of distinguished service that makes society uneasy.',
      },
      {
        id: 'grieving-widower',
        label: 'A Melancholy Gentleman in Quiet Mourning',
        detail: 'Seeks only peace in private retreat until insolent intruders shatter his solitude.',
      },
      {
        id: 'reluctant-protector',
        label: 'A Reluctant Protector Against Arrogant Peers',
        detail: 'Prefers humble country company yet refuses to bow before pompous authority.',
      },
    ],
  },
  {
    id: 'setting',
    chapterLabel: 'Chapter III of IV',
    prompt: 'Which atmospheric setting sets your heart alight?',
    options: [
      {
        id: 'country-apiary',
        label: 'A Sunlit Country Estate & Quiet Apiary',
        detail: 'Orchard mist, wooden hives, and peaceful rural solitude disrupted by London intrigue.',
      },
      {
        id: 'seaside-gala',
        label: 'A Glittering Seaside Manor Gala',
        detail: 'Candlelit chandeliers, formal attire, and a reckoning beside crashing coastal waves.',
      },
      {
        id: 'winter-ballroom',
        label: 'A Snowbound Yuletide Ballroom Gathering',
        detail: 'Crisp winter night, glowing tall arched windows, and an estranged couple reunited.',
      },
      {
        id: 'windswept-moor',
        label: 'A Tempestuous Carriage Passage Across Wild Moors',
        detail: 'Sweeping horizons, billowing cloaks, and noble fugitives racing toward sanctuary.',
      },
    ],
  },
  {
    id: 'resolution',
    chapterLabel: 'Chapter IV of IV',
    prompt: 'What sort of evening resolution do you favor?',
    options: [
      {
        id: 'righteous-reckoning',
        label: 'A Righteous Reckoning Against Corrupt Guardians',
        detail: 'Every concealed ledger laid bare before polite society.',
      },
      {
        id: 'misty-departure',
        label: 'Honor Restored Before Vanishing Into the Mist',
        detail: 'A quiet, bittersweet farewell once justice has been served.',
      },
      {
        id: 'midnight-confrontation',
        label: 'A Breathless Midnight Confrontation at the Estate',
        detail: 'Long-buried truths spoken aloud beneath flickering candelabra.',
      },
      {
        id: 'reconciled-hearts',
        label: 'Hard-Won Reconciliation After a Trial of Faith',
        detail: 'Devotion proven beyond doubt when dawn breaks at last.',
      },
    ],
  },
];

export const STARTER_MOVIES: MovieDossier[] = [
  {
    id: 'the-beekeeper-2024',
    title: 'The Beekeeper',
    year: 2024,
    director: 'David Ayer',
    runtimeMinutes: 105,
    genres: ['Action', 'Thriller'],
    synopsis:
      'Adam Clay, a retired operative from a clandestine program known as the Beekeepers, lives quietly tending beehives in a barn rented from his kind-hearted elderly neighbor Eloise Parker. When Eloise loses her entire life savings and charity fund to a ruthless phishing scam, Clay traces the call-center syndicate up to privileged tech CEO Derek Danforth, whose powerful mother and ex-CIA security chief try to stop him before a climactic showdown at a coastal mansion gala.',
    cast: [
      {
        actor: 'Jason Statham',
        character: 'Adam Clay',
        roleSummary: 'Quiet retired covert operative living peacefully tending country beehives.',
      },
      {
        actor: 'Phylicia Rashad',
        character: 'Eloise Parker',
        roleSummary: 'Warm-hearted retired schoolteacher and landlady ruined by a cruel financial swindle.',
      },
      {
        actor: 'Josh Hutcherson',
        character: 'Derek Danforth',
        roleSummary: 'Arrogant, well-connected young heir running fraudulent operations behind polite prestige.',
      },
      {
        actor: 'Jeremy Irons',
        character: 'Wallace Westwyld',
        roleSummary: 'Aristocratic former intelligence director tasked with shielding the Danforth family name.',
      },
      {
        actor: 'Emmy Raver-Lampman',
        character: 'Verona Parker',
        roleSummary: 'Eloise Parker’s determined daughter investigating the injustice from within the law.',
      },
    ],
    keyPlotBeats: [
      'A solitary former officer tends hives in quiet rural seclusion on a kind landlady’s estate.',
      'A ruthless metropolitan swindle strips the beloved benefactress of her fortune and charity trust.',
      'The hero dismantles each layer of corrupt patronage leading to a spoiled scion of the highest political house.',
      'An uninvited appearance at a glittering coastal estate gala lays every secret bare before the hero disappears into the misty sea.',
    ],
    streamingServices: ['Prime Video', 'MGM+'],
    groundingSources: [
      {
        title: 'The Beekeeper (2024) — Reference Plot & Cast',
        uri: 'https://en.wikipedia.org/wiki/The_Beekeeper_(2024_film)',
      },
    ],
    presetPosterPath: '/src/assets/images/poster_beekeeper_regency_1795547743489.jpg',
    isStarter: true,
  },
  {
    id: 'john-wick-2014',
    title: 'John Wick',
    year: 2014,
    director: 'Chad Stahelski',
    runtimeMinutes: 101,
    genres: ['Action', 'Neo-Noir Thriller'],
    synopsis:
      'Grieving widower John Wick receives a final posthumous gift from his late wife Helen: a beagle puppy named Daisy to help him mourn. When reckless mob heir Iosef Tarasov breaks into his home, steals his prized car, and harms the puppy, John returns to the shadowed underworld governed by the Continental Hotel and confronts crime patriarch Viggo Tarasov.',
    cast: [
      {
        actor: 'Keanu Reeves',
        character: 'John Wick',
        roleSummary: 'Solemn grieving widower who left an illustrious hidden society for love.',
      },
      {
        actor: 'Alfie Allen',
        character: 'Iosef Tarasov',
        roleSummary: 'Insolent, shortsighted young heir who trespasses upon a grieving gentleman’s estate.',
      },
      {
        actor: 'Michael Nyqvist',
        character: 'Viggo Tarasov',
        roleSummary: 'Powerful patriarch who knows too well the reputation his reckless son has provoked.',
      },
      {
        actor: 'Ian McShane',
        character: 'Winston',
        roleSummary: 'Urbane proprietor of an exclusive private establishment bound by strict codes of etiquette.',
      },
    ],
    keyPlotBeats: [
      'A devoted widower cherishes a small loyal spaniel bequeathed by his dearly departed wife.',
      'An insolent aristocratic scion violates the sanctuary of his private estate and steals a cherished carriage.',
      'The hero re-enters an exclusive society governed by gold coinage and unbreakable parlor rules.',
      'After settling accounts with the boy’s powerful father, our solitary gentleman walks home with a new canine companion.',
    ],
    streamingServices: ['Prime Video', 'Peacock', 'Netflix'],
    groundingSources: [
      {
        title: 'John Wick (2014) — Reference Plot & Cast',
        uri: 'https://en.wikipedia.org/wiki/John_Wick_(film)',
      },
    ],
    presetPosterPath: '/src/assets/images/poster_johnwick_regency_1795547743223.jpg',
    isStarter: true,
  },
  {
    id: 'die-hard-1988',
    title: 'Die Hard',
    year: 1988,
    director: 'John McTiernan',
    runtimeMinutes: 132,
    genres: ['Action', 'Thriller'],
    synopsis:
      'New York officer John McClane travels to Los Angeles on Christmas Eve to reconcile with his estranged wife Holly at her company’s lavish holiday reception in Nakatomi Plaza. When refined European mastermind Hans Gruber seizes the building to empty its locked vault, McClane quietly outmaneuvers the intruders from the corridors while forging a steadfast friendship with Sergeant Al Powell.',
    cast: [
      {
        actor: 'Bruce Willis',
        character: 'John McClane',
        roleSummary: 'Plainspoken visitor arriving on Christmas Eve hoping to mend a strained marriage.',
      },
      {
        actor: 'Bonnie Bedelia',
        character: 'Holly Gennero',
        roleSummary: 'Accomplished, strong-willed spouse hosting a grand Yuletide assembly at a gleaming estate.',
      },
      {
        actor: 'Alan Rickman',
        character: 'Hans Gruber',
        roleSummary: 'Impeccably tailored Continental schemer with exquisite manners and designs on the estate treasury.',
      },
      {
        actor: 'Reginald VelJohnson',
        character: 'Al Powell',
        roleSummary: 'Kind-hearted provincial confidant offering steady counsel from outside the gates.',
      },
    ],
    keyPlotBeats: [
      'An estranged husband journeys across the country on Christmas Eve to reunite with his accomplished wife.',
      'A charming, finely dressed European opportunist crashes the glittering Yuletide assembly to claim a fortune.',
      'Cut off from aid, the husband relies on wit, devotion, and a loyal confidant beyond the gates to protect the guests.',
      'At the winter evening’s end, the couple emerges from the manor arm in arm, their affection fully renewed.',
    ],
    streamingServices: ['Hulu', 'Disney+', 'Prime Video'],
    groundingSources: [
      {
        title: 'Die Hard (1988) — Reference Plot & Cast',
        uri: 'https://en.wikipedia.org/wiki/Die_Hard',
      },
    ],
    presetPosterPath: '/src/assets/images/poster_diehard_regency_1795547743319.jpg',
    isStarter: true,
  },
  {
    id: 'mad-max-fury-road-2015',
    title: 'Mad Max: Fury Road',
    year: 2015,
    director: 'George Miller',
    runtimeMinutes: 120,
    genres: ['Action', 'Adventure'],
    synopsis:
      'Imperator Furiosa spirits away the five captive wives of tyrannical ruler Immortan Joe inside an armored rig, racing across an unforgiving desert toward the fabled Green Place of her youth. Reluctantly joined by quiet wanderer Max Rockatansky and a reformed young loyalist named Nux, the group braves sandstorms and relentless pursuers before deciding to return and liberate the Citadel itself.',
    cast: [
      {
        actor: 'Charlize Theron',
        character: 'Imperator Furiosa',
        roleSummary: 'Resolute noblewoman risking everything to escort five young ladies from tyranny to sanctuary.',
      },
      {
        actor: 'Tom Hardy',
        character: 'Max Rockatansky',
        roleSummary: 'Haunted, soft-spoken wanderer who becomes a steadfast ally along the perilous road.',
      },
      {
        actor: 'Nicholas Hoult',
        character: 'Nux',
        roleSummary: 'Misguided young retainer whose heart is redeemed by compassion and newfound purpose.',
      },
      {
        actor: 'Hugh Keays-Byrne',
        character: 'Immortan Joe',
        roleSummary: 'Despotic patriarch hoarding the estate’s precious waters and controlling his household with vanity.',
      },
    ],
    keyPlotBeats: [
      'A courageous lady orchestrates a daring carriage flight across vast windswept expanses to free five wards.',
      'A brooding, taciturn traveler joins the party as mutual suspicion blossoms into profound unspoken trust.',
      'Learning that the promised sanctuary has withered, they choose the boldest course: returning to claim the estate for the people.',
      'With the waters opened to all, the solitary gentleman exchanges one quiet nod with the heroine and slips into the crowd.',
    ],
    streamingServices: ['Max', 'Prime Video', 'Apple TV+'],
    groundingSources: [
      {
        title: 'Mad Max: Fury Road (2015) — Reference Plot & Cast',
        uri: 'https://en.wikipedia.org/wiki/Mad_Max:_Fury_Road',
      },
    ],
    presetPosterPath: '/src/assets/images/poster_madmax_regency_1795547743551.jpg',
    isStarter: true,
  },
  {
    id: 'taken-2008',
    title: 'Taken',
    year: 2008,
    director: 'Pierre Morel',
    runtimeMinutes: 93,
    genres: ['Action', 'Thriller'],
    synopsis:
      'Retired intelligence officer Bryan Mills reluctantly grants his seventeen-year-old daughter Kim permission to travel to Paris for the summer. When unscrupulous abductors seize Kim shortly after arrival, Bryan travels immediately to France, relying on his rare professional discernment and old Parisian acquaintances to recover his daughter from a lavish yacht before it sets sail.',
    cast: [
      {
        actor: 'Liam Neeson',
        character: 'Bryan Mills',
        roleSummary: 'Overprotective, deeply devoted father possessing an unusual set of gentlemanly accomplishments.',
      },
      {
        actor: 'Maggie Grace',
        character: 'Kim Mills',
        roleSummary: 'Spirited young debutante embarking on an eagerly awaited continental tour of Paris.',
      },
      {
        actor: 'Famke Janssen',
        character: 'Lenore',
        roleSummary: 'Anxious mother who eventually recognizes her former husband’s unwavering devotion.',
      },
    ],
    keyPlotBeats: [
      'A spirited daughter departs on a grand Continental tour of Paris with her father’s hesitant blessing.',
      'Treacherous Parisian opportunists abduct the young lady shortly after her arrival in the city.',
      'Her deeply principled father crosses the Channel with a solemn vow and tracks every clue through Parisian society.',
      'A dramatic rescue aboard a pleasure vessel restores father and daughter safely home to London-style serenity.',
    ],
    streamingServices: ['Hulu', 'Prime Video', 'Max'],
    groundingSources: [
      {
        title: 'Taken (2008) — Reference Plot & Cast',
        uri: 'https://en.wikipedia.org/wiki/Taken_(film)',
      },
    ],
    isStarter: true,
  },
  {
    id: 'top-gun-maverick-2022',
    title: 'Top Gun: Maverick',
    year: 2022,
    director: 'Joseph Kosinski',
    runtimeMinutes: 130,
    genres: ['Action', 'Drama'],
    synopsis:
      'After more than thirty years of distinguished naval service, Captain Pete "Maverick" Mitchell is summoned back to train a gifted cohort of young graduates for a nearly impossible assignment. There he must confront lingering grief when mentoring Bradley "Rooster" Bradshaw—the son of his late best friend—while rekindling a warm, second-chance romance with spirited harbor proprietor Penny Benjamin.',
    cast: [
      {
        actor: 'Tom Cruise',
        character: 'Pete "Maverick" Mitchell',
        roleSummary: 'Dashing, defiant veteran officer who refuses promotion to remain faithful to his calling.',
      },
      {
        actor: 'Miles Teller',
        character: 'Bradley "Rooster" Bradshaw',
        roleSummary: 'Proud, guarded son of Maverick’s late dearest companion, torn between resentment and respect.',
      },
      {
        actor: 'Jennifer Connelly',
        character: 'Penny Benjamin',
        roleSummary: 'Graceful, independent coastal hostess who shares an affectionate second-chance courtship with the captain.',
      },
      {
        actor: 'Val Kilmer',
        character: 'Tom "Iceman" Kazansky',
        roleSummary: 'Revered senior admiral whose quiet friendship anchors the hero’s sense of duty.',
      },
    ],
    keyPlotBeats: [
      'A celebrated yet unconventional naval captain is recalled to instruct the finest young officers of the realm.',
      'Old family wounds resurface when he must guide the proud son of his long-lost dearest friend.',
      'Between sun-drenched coastal sails and quiet reconciliations, an old romance blooms anew.',
      'Loyalty and forgiveness triumph together as mentor and protégé return home in triumph.',
    ],
    streamingServices: ['Paramount+', 'Prime Video', 'Netflix'],
    groundingSources: [
      {
        title: 'Top Gun: Maverick (2022) — Reference Plot & Cast',
        uri: 'https://en.wikipedia.org/wiki/Top_Gun:_Maverick',
      },
    ],
    isStarter: true,
  },
];

export const CURATED_PERIOD_ROMANCES: MercyVetoMovie[] = [
  {
    title: 'Pride & Prejudice',
    year: 2005,
    runtimeMinutes: 129,
    synopsis:
      'Sparks fly when spirited Elizabeth Bennet crosses paths with the aloof, wealthy Mr. Darcy amidst misty Hertfordshire estates, country assemblies, and family marriage intrigues.',
    whyItFits:
      'The gold standard of brooding gentlemen, rain-soaked confessions, and sparkling Regency wit.',
    streamingOn: ['Prime Video', 'Peacock', 'Netflix'],
  },
  {
    title: 'Emma.',
    year: 2020,
    runtimeMinutes: 124,
    synopsis:
      'Handsome, clever, and rich, Emma Woodhouse meddles in the romantic fortunes of her sleepy English village until Mr. Knightley’s quiet devotion turns her own heart upside down.',
    whyItFits:
      'Sunlit Georgian estates, razor-sharp social comedy, and confectionery pastel Regency elegance.',
    streamingOn: ['Prime Video', 'Peacock', 'Apple TV+'],
  },
  {
    title: 'Sense and Sensibility',
    year: 1995,
    runtimeMinutes: 136,
    synopsis:
      'Left with a modest income after their father’s passing, the prudent Elinor and passionate Marianne Dashwood navigate heartbreak, fortune hunters, and quiet constancy in Devonshire.',
    whyItFits:
      'Emma Thompson’s Oscar-winning Austen adaptation with lush country cottages and deeply earned romance.',
    streamingOn: ['Prime Video', 'Hulu', 'Apple TV+'],
  },
  {
    title: 'Little Women',
    year: 2019,
    runtimeMinutes: 135,
    synopsis:
      'Four fiercely loving sisters come of age in 19th-century New England, balancing artistic ambition, family devotion, and sweeping romantic choices across warm seasons.',
    whyItFits:
      'Radiant period craftsmanship, heartfelt sisterhood, and golden-hour literary charm.',
    streamingOn: ['Hulu', 'Netflix', 'Prime Video'],
  },
  {
    title: 'Persuasion',
    year: 1995,
    runtimeMinutes: 107,
    synopsis:
      'Eight years after being persuaded to refuse Captain Frederick Wentworth, quiet Anne Elliot meets him again—now wealthy and newly returned from sea—in a luminous tale of second chances.',
    whyItFits:
      'Quietly devastating naval longing, seaside walks at Lyme, and Jane Austen’s most tender love letter.',
    streamingOn: ['Prime Video', 'Max', 'Apple TV+'],
  },
  {
    title: 'Becoming Jane',
    year: 2007,
    runtimeMinutes: 120,
    synopsis:
      'Before her novels conquered English letters, a young Jane Austen sparks an unforgettable, forbidden country-house romance with roguish Irish barrister Tom Lefroy.',
    whyItFits:
      'Country balls, spirited literary banter, and swooning Regency nostalgia from start to finish.',
    streamingOn: ['Paramount+', 'Prime Video', 'Hulu'],
  },
];
