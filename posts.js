window.BLOG_CATEGORIES = [
  { name: "Photography", slug: "photography", description: "A closer look at the people, places, and quiet details that stay with us." },
  { name: "Film", slug: "film", description: "Moving images, intimate documentaries, and the craft behind the frame." },
  { name: "Listening", slug: "listening", description: "Conversations, field recordings, and stories best heard with your eyes closed." },
  { name: "Slow living", slug: "slow-living", description: "Ideas for paying attention, making room, and finding a gentler rhythm." },
  { name: "Places", slug: "places", description: "Notes from elsewhere, and from the familiar corners we pass every day." }
];

window.BLOG_POSTS = [
  {
    id: "light-between-buildings", slug: "light-between-buildings", title: "The light between buildings",
    excerpt: "A photographer returns to the same city corner every morning, and finds that it is never quite the same place twice.",
    category: "Photography", categorySlug: "photography", tags: ["street photography", "city", "morning"],
    author: { name: "Maya Chen", initials: "MC", bio: "Photographer and occasional early riser. Maya makes portraits of ordinary places and the people who make them feel like home." },
    date: "2026-09-28", dateLabel: "September 28, 2026", readTime: "6 min read", views: 2840, likes: 126,
    featured: true, media: "image", image: "photo-1477959858617-67f85cf4f1df",
    alt: "Sunlight falling between city buildings at golden hour",
    caption: "A quiet corner in New York, just after the morning rush.",
    paragraphs: [
      "At 6:42 every morning, before the bakery opens and the number 9 bus exhales at the corner, a small triangle of sunlight slips between two buildings on Orchard Street. I know because I have been there every day this month, waiting for it to arrive.",
      "On the first day, the light was almost invisible—a pale wash across the pavement, easy to mistake for the sky brightening. By the third, I could pick out a clear shape. The week after that, I began to notice the people who wandered into it: a delivery cyclist catching her breath, an old man carrying a bunch of yellow tulips.",
      "I came to make a series about the architecture. I left with a collection of small, unplanned meetings. The city never stands still long enough to be captured, but it lets you borrow its light for a moment."
    ],
    quote: "We don't have to go far to find somewhere worth looking at. Sometimes we only have to arrive a little earlier.",
    related: ["small-hours-station", "rooms-that-remember"]
  },
  {
    id: "small-hours-station", slug: "small-hours-station", title: "A station at the small hours",
    excerpt: "A short film about the people who keep a city moving while most of us are still asleep.",
    category: "Film", categorySlug: "film", tags: ["documentary", "night", "city life"],
    author: { name: "Theo Martins", initials: "TM", bio: "Filmmaker and editor documenting everyday rituals, overlooked workers, and places in transition." },
    date: "2026-09-24", dateLabel: "September 24, 2026", readTime: "8 min watch", views: 1970, likes: 98,
    featured: true, media: "video", image: "photo-1519501025264-65ba15a82390",
    alt: "City street and buildings at dusk", caption: "The streets begin to stir around 4:30 a.m.",
    paragraphs: [
      "At four in the morning, the station belongs to the cleaners. Long before the first commuters descend the stairs, Ana and her crew move quietly through the empty concourse, restoring the city to a version of itself that most of us never see.",
      "Director Theo Martins spent three nights with the crew, leaving the camera on its tripod and letting the work set the pace. There are no interviews and no score. Instead, we hear a mop bucket rolling across stone, an electric train far below, and the occasional song Ana sings when she thinks no one's listening.",
      "It's a gentle, generous portrait of the hours hidden in the margins of a day, and of the people who make those hours possible."
    ],
    quote: "The city wakes up in layers. The first layer is always a person turning on a light.",
    related: ["light-between-buildings", "rooms-that-remember"],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  },
  {
    id: "listening-to-the-coast", slug: "listening-to-the-coast", title: "Listening to the coast breathe",
    excerpt: "Sound artist Ellis Rowe takes a microphone along the shoreline to hear what the tide is trying to tell us.",
    category: "Listening", categorySlug: "listening", tags: ["soundscape", "coast", "field notes"],
    author: { name: "Ellis Rowe", initials: "ER", bio: "Sound artist, radio producer, and collector of sounds from the edge of the map." },
    date: "2026-09-20", dateLabel: "September 20, 2026", readTime: "22 min listen", views: 3150, likes: 174,
    featured: false, media: "audio", image: "photo-1473116763249-2faaef81ccda",
    alt: "Soft waves rolling onto a quiet beach", caption: "Recording the water at first light on the Northumberland coast.",
    paragraphs: [
      "The first thing I notice when I put the headphones on is how close the waves sound. Not loud—close. They arrive and recede at a human pace, their foam folding over the stones like a bedsheet being smoothed by a careful hand.",
      "For two weeks I walked this stretch of coast with a pair of microphones and no particular destination. The recordings you hear were made just after sunrise, before footsteps and gulls and the familiar business of the day found their way to the water.",
      "Field recordings don't give you the sea. They give you a small, imperfect window, and invite you to listen your way through it."
    ],
    quote: "Listen long enough and even a familiar sound begins to show you its edges.",
    related: ["weather-in-the-window", "small-hours-station"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "rooms-that-remember", slug: "rooms-that-remember", title: "Rooms that remember",
    excerpt: "Inside three neighborhood studios where the walls hold a record of every project that came before.",
    category: "Photography", categorySlug: "photography", tags: ["interiors", "craft", "portraits"],
    author: { name: "Priya Nair", initials: "PN", bio: "Writer and portrait photographer drawn to the stories carried by rooms and objects." },
    date: "2026-09-16", dateLabel: "September 16, 2026", readTime: "5 min read", views: 1490, likes: 82,
    featured: false, media: "image", image: "photo-1494438639946-1ebd1d20bf85",
    alt: "A warmly lit creative studio filled with books and objects", caption: "A corner of Rafi's printmaking studio, collected over twelve years.",
    paragraphs: [
      "Rafi remembers every mark on the studio table. This faint crescent came from a mug left overnight in 2019. The black scuff is ink from the map he printed for a friend's wedding. The little nick in the edge was already there when he arrived.",
      "Each of the spaces in this photo essay belongs to someone who has spent years making things by hand. Their studios are not showrooms. They are working memories—surfaces changed by decisions, tools laid out for tomorrow, and the reassuring traces of work that got done.",
      "I asked each person to tidy nothing. The result is closer to how a creative life actually looks: unfinished, useful, and full of things that have not yet found their place."
    ],
    quote: "A room keeps the shape of the attention you give it.",
    related: ["light-between-buildings", "weather-in-the-window"]
  },
  {
    id: "weather-in-the-window", slug: "weather-in-the-window", title: "The weather in the window",
    excerpt: "On keeping a small, unhurried weather journal through one changeable autumn.",
    category: "Slow living", categorySlug: "slow-living", tags: ["journaling", "seasons", "ritual"],
    author: { name: "Nora Williams", initials: "NW", bio: "Essayist writing about daily rituals, changing seasons, and the art of noticing." },
    date: "2026-09-12", dateLabel: "September 12, 2026", readTime: "4 min read", views: 1210, likes: 69,
    featured: false, media: "image", image: "photo-1441974231531-c6227db76b6e",
    alt: "A quiet forest path illuminated by filtered autumn sunlight", caption: "The garden changes quietly, whether or not I remember to look.",
    paragraphs: [
      "Every morning for a month, I wrote one line about the sky. That was the whole practice. No forecast, no photograph, no attempt to turn the observation into a lesson. Just a sentence and the date.",
      "By the end of the first week, the sentences had changed. I stopped writing 'overcast' and began noticing the particular quality of the grey: slate at the edges, almost pink above the roof. I knew exactly which hour the light touched the windowsill.",
      "A modest ritual has a way of making time visible. It gives the day a door you can actually open."
    ],
    quote: "The practice isn't about having something to say. It is about being there to notice.",
    related: ["listening-to-the-coast", "rooms-that-remember"]
  },
  {
    id: "market-before-opening", slug: "market-before-opening", title: "Before the market opens",
    excerpt: "A morning in the wholesale flower market, where a different city blooms before sunrise.",
    category: "Places", categorySlug: "places", tags: ["market", "portraits", "morning"],
    author: { name: "Maya Chen", initials: "MC", bio: "Photographer and occasional early riser. Maya makes portraits of ordinary places and the people who make them feel like home." },
    date: "2026-09-08", dateLabel: "September 8, 2026", readTime: "7 min read", views: 2310, likes: 141,
    featured: false, media: "image", image: "photo-1490750967868-88aa4486c946",
    alt: "Fresh flowers gathered in soft morning light", caption: "The first crates arrive before the coffee shops switch on their signs.",
    paragraphs: [
      "By five the doors are already open. Buckets of dahlias, crates of tulips, great clouds of eucalyptus: the whole market smells like the inside of a garden after rain.",
      "The people who work here know the flowers by their timing. Which ones will open in a warm room, which ones can wait until Friday, and which stems are already past their best. They choose quickly, often without looking up.",
      "I came to photograph the arrangements. I stayed to watch the careful work of getting something beautiful from one person to the next."
    ],
    quote: "Here, even an ordinary Tuesday begins with a little abundance.",
    related: ["light-between-buildings", "weather-in-the-window"]
  },
  {
    id: "postcards-from-the-train", slug: "postcards-from-the-train", title: "Postcards from the train window",
    excerpt: "A moving-image diary of a slow journey north, with nothing on the itinerary but the view.",
    category: "Film", categorySlug: "film", tags: ["travel", "film diary", "landscape"],
    author: { name: "Theo Martins", initials: "TM", bio: "Filmmaker and editor documenting everyday rituals, overlooked workers, and places in transition." },
    date: "2026-09-02", dateLabel: "September 2, 2026", readTime: "6 min watch", views: 1680, likes: 77,
    featured: false, media: "video", image: "photo-1474487548417-781cb71495f3",
    alt: "A train moving through a green landscape", caption: "Somewhere between the city and the coast, the view begins to change.",
    paragraphs: [
      "For the first hour, I filmed the reflections. Passing streets doubled against our faces; overhead wires traced the sky like lines on a map. Then the city loosened its hold and there were fields, hedges, a sudden flash of water.",
      "I took no notes and made no plan. Every few minutes I pressed record, waited for the carriage to settle, and watched the landscape arrange itself for a moment before moving on.",
      "The film that came back with me isn't really about the north. It's about the pleasure of going somewhere without asking it to be anything in particular."
    ],
    quote: "A journey gives you permission to look out of the window for a very long time.",
    related: ["small-hours-station", "market-before-opening"],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  }
];
