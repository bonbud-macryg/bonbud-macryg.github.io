# Sindi Grant Proposal

## One sentence
Sindi is a calm RSS/Atom reader, only on Urbit.

## One paragraph
What if you could see what’s happening on your interent - headlines, blog posts, interesting rabbitholes - without advertisers following your every move? Without algorithms filling your feed with Content® it thinks is Engaging™? It’s the smallest dignity in the world, and the legacy web makes it impossible. You can only have this on Urbit.

## Seven more paragraphs
For a certain set of the very online, the killing of Google Reader to promote Google+ marked the end of one internet and the beginning of ours: [four websites filled with screenshots of the other three](https://twitter.com/badnetworker/status/1133363823728091136?s=20).

Reader was just before my time. I’ve no interest in rebuilding it, but something like it should ship with every phone and computer. “It’s like Google Reader, but Google can’t take it away from you” is a good narrative that could a) get people on Urbit and b) get more people spending more time using Urbit than they currently do.

RSS is Web 1.0, but it’s also Webs 2.0, 2.5, and web3. Your favourite podcast is an RSS feed, [so is every Substack](https://support.substack.com/hc/en-us/articles/360038239391-Is-there-an-RSS-feed-for-my-publication-), [so is much of the Fedvierse](https://mstdn.social/@feditips/108357998963885456). Incumbents like Patreon and web3 media outlets like [Channel](channel.xyz) all find that RSS is the simplest way to serve paywalled content; the ideological question of closed platforms vs. open protocols is irrelevant. It just works!

I’m pitching Sindi as an RSS reader today, but there’s no reason it can’t slot in other media protocols in future. Mirror is getting closer to the right idea with their [crypto wallet-based subscriptions](https://dev.mirror.xyz/Jn62zF5n62BfowdaFgm3uIx3Fgp2vIR7b-HTSxKVXqk). I think Farcaster or one of the emerging Decentralized Social protocols might do something interesting here. (Closer to home, Sindi will include Urbit-native subscriptions to your favourite `path`s. Maybe your favourite %blogs will publish to RSS, maybe we’ll have our own protocol.)

Urbit’s personal server uniquely solves a deeply-rooted problem with RSS readers: a simple tool for reading the open web is [probably essential for a good internet](https://netnewswire.com/why-write-rss-reader), but there’s just not much money in it. Feedly first got big because Google Reader was shut down - gaining [9 million users in two months](https://thenextweb.com/news/feedly-launches-standalone-web-version-for-all-users-offers-a-one-click-migration-path-from-google-reader) - but over time it’s become burdened with in-feed ads, AI integrations and popups that [drive serious users away](https://erikgahner.dk/2022/goodbye-feedly/). Without high subscription revenue, client-server applications running at scale fall to inevitable [“enshittification”](https://pluralistic.net/2023/01/21/potemkin-ai/#hey-guys) that ruined all the others. On Web 2.0 there will always be another RSS platform for you to move to, but it’s only a matter of time before you have to move away.

Self-hosting is the silver bullet. Raspberry Pi users have known this for years, but Urbit makes self-sovereign media accessible for everyone.

The design space for Urbit-native media apps is almost totally uncharted. The personal computer introduced itself as a collection of files, folders, and pages; today Urbit media LARPs as a [return to Web 1.0](https://dachus-tiprel.tlon.network/blog/web-1), but apps like Holium’s community-first Chronicle point in a new direction. Sindi looks like a familiar RSS reader - it looks like it shipped with your family’s first computer - but it’s all futuristic Martian machinery under the fake human skin. Who knows what it’ll end up being capable of.

## Demo
I quit Feedly and Twitter for Sindi. Its buggy, barely-usable prototype has been my only news app for a year; I wouldn’t have had it any other way. After months of dogfooding no UI element was left unchanged from Sergei Zaitsev’s [Headline](https://github.com/zserge/headline), of which this prototype is my personal fork. By rebuilding all the state logic in Hoon I’ll be able to achieve the UX I can’t get anywhere else: actually-seamless syncing across devices and server-side background refresh.

Here’s [Zaitsev’s original](https://zserge.com/headline/), which was ported to Urbit as %headline in late 2020.

And here’s [my prototype](https://bonbud-macryg.github.io/) version. The third-party API this uses is intermittently broken (this will be replaced with `rss-sub.hoon`, detailed below), and I broke the function that removes feeds to get that feature looking like the final version.

In both versions, you can try adding the URLs below. Try removing several of them at once, and see what happens when you provide a comma-separated list of terms to highlight feed items. If you’d like to save your settings/feeds, you’ll have to bookmark the URL after setting them. This is a really horrible way to save app state, but such is Web 2.0. (Urbit fixes this.)

```
news.ycombinator.com/rss
thejaymo.net/feed
thequietus.com/feed
newyorker.com/feed/books
theverge.com/rss/full.xml
coindesk.com/arc/outboundfeeds/rss/
dieworkwear.com/feed
media.rss.com/thenetworkage/feed.xml
door.link/rss.xml
diff.substack.com/feed
mcrumps.substack.com/feed
```

## Building Sindi
So what needs built? And what does that process look like?

### State management
The most fundamental thing Sindi does that %headline didn’t is to put state management on Urbit. As with any Web 2.0 implementation of this app, %headline divided the app state between the URL and the browser’s localStorage. This made perfect sense for Zaitsev’s original design goals, but adding/removing feeds involves so much friction that it’s almost not worth doing.

It’s cool that putting the app on Urbit makes syncing across devices effortless. But Urbit can go further than that. Because it’s my server, not Feedly’s, it’s possible and very desirable for Sindi to store very granular app state the same way Realm stores your desktop state. That includes, but is not limited to, storing all your fetched feed items in app state. And because my server is a general-purpose computer running 24/7, why wait for me to fetch new feed items manually?

### Background refresh
This is Sindi’s big UX hook. Sindi fetches new items while you’re away and delivers all of them to your device as soon as you open the app, without the couple seconds of delay you experience on almost every other feed-based app like Feedly, Twitter, Instagram, etc. (It’s not quite [pre-rendered on the server](https://twitter.com/ajlamarc/status/1615012033526697984?s=20&t=-JU-R_n0xqZKUvOtXY8a8A), but we’ll get there one day.)

You don’t have to manually “pull to refresh” as if pulling the lever on a slot machine, hoping the algorithm will pour forth with some good Content® to Engage™ with.

In fact, there isn’t a refresh option at all.

Sindi looks for new items every 15 minutes, on the clock. You will never close this app and open it one minute later to check if there’s anything new. There will never be anything new. You will be trained right out of that habit if you’ve got it.

This is the kind of *ideological* UX something like [BeReal](https://bere.al/en) gets popular for. You’ll never have to check if there’s anything new on Sindi. You’ll know there’s something new when you hear a clock tower ring out across town, the school bell down the street, colleagues breaking for lunch on the hour. The online media cycle is such that every 15 minutes, there will definitely be lots of new things, but Sindi holds it back until those increments.

### RSS Sub, RSS Pub
There’s an old proof-of-concept app called [hoon-rss](https://github.com/clonex10100/hoon-rss) that can fetch RSS feeds on a set interval. Working from this as prior art, I want to build a stateful module called `rss-sub` that any developer can quickly plug into their app to get it subscribing to RSS feeds. Sindi will run on `rss-sub`.

But that feels like half a job. To grow Sindi’s “TAM” and help Urbit interface with the clearweb more, I also want to accompany that that with another module called `rss-pub`. This’ll make it trivial for developers to get content from Urbit syndicated across the internet. Picture %blogs going out to the web, door.link and [The Network Age](https://rss.com/podcasts/thenetworkage/) broadcasting from Urbit ships.

### Reader
Finally, I want to give Sindi a reader.

Being able to read articles in Sindi, stored on your Urbit, completes the experience. I’s internet media with no ads, no cookies, no popups, where paywalled content is still supported. 

I’ve gone back and forth on including a reader mode - the app should be small enough to be perfectable - but in the end I just want to spend more time in this app than I already do. Sindi’s busted prototype feels really good to use, it’s a shame you have to click through to other websites and their cookie popups and mailing list signup popups and One Free Article Remaining popups to use it right now. Reading a bunch of articles in Sindi would be a great way to spend an hour, and it would be one of a handful of really *long* experiences you can have on Urbit today.

## Grant Milestones
1. MVP - 1 star
	* Feature-parity with the %headline app, plus syncing across devices and background refresh.
2. Release of RSS Sub and RSS Pub - 1 star
	* `rss-sub` will have to be built to achieve Milestone 1, but will be polished up and officially released as a public good in Milestone 2 alongside `rss-pub`.
3. Reader - 1 star
	* A simple reader mode that allows people to read article text stored on their Urbit, with images fetched remotely.

Sindi’s MVP will have foldering implemented on the backend; it would be harder to *not* include it and then add it in later. I intend to support this app for as long as it needs me to and I have plenty of features I want to implement beyond these, like permanent archiving and gossip-based recommendations from your peers. I might just do foldering in amongst the work specified, but three milestones feels right.

## Why ~bonbud-macryg?
I’m a Hoon School and App School finisher wrapping up work on the [Chess Improvements](https://urbit.org/grants/chess-bounty) bounty, in which I learned React to be able to work full-stack on one of the more complex and fully-featured apps on Urbit today.

As part of that bounty I also built [Telos](https://github.com/thecommons-urbit/telos), a ratings server for competitive multiplayer games on Urbit.

I think Sindi’s MVP is about as complicated as any one of the features I built for the Chess app, like its interactive game panel where players can see a list of moves and review previous positions on the board. And I’ll be using `create-landscape-app` to build it, using the React framework I’ve become familiar with while getting an even faster iteration loop than I had working on Chess.

I started learning Hoon because I was curious and I wanted to get back into programming for fun. I started Hoon School because I wanted to build Sindi. I thought it would be a good first app because most of it was already there and I just had to hook it up to a Gall agent, but having completed the Chess bounty it’ll now be much quicker for me to just rebuild the entire thing from scratch.

### Expectations
I’m not sure what specific expertise I might be looking for in a Champion for this grant. I have a good grasp on the React frontend and Hoon backend, the RSS modules will be fairly simple. The most complex part of this grant will be the article reader, so perhaps experience with {blank} would be nice to have. On the Chess bounty I was keeping in close communication with my teammates and our Champion ~finmep-lanteb via Urbit and GitHub with no regular meetings or calls, so I’d be happy to work on this quite independently.

I intend to dedicate as much time to this grant as I reasonably can, to get an MVP out the door as soon as possible. I think I could complete Milestone 1 within two calendar months after work begins. Milestone 2 shouldn’t take long at all. {why?}, Milestone 3 might not take much longer than one calendar month.

This project doesn’t have nearly a many moving parts as the Chess bounty did. With the speed benefits of `create-landscape-app`, the best-practices I learned on the Chess bounty, and one code review per Milestone, I think I’ll be able to develop a lot faster here than I could with the work on Chess and Telos.