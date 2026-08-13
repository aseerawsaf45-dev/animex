
'use client';

export default function AnimeDetail() {
  return (
    <main className="font-body antialiased relative min-h-screen flex flex-col">
      
{/* Background Decorative Text */}
<div aria-hidden="true" className="japanese-bg-text">進撃の巨人</div>
{/* TopNavBar (Shared Component) */}
<nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)] flex justify-between items-center px-8 py-3 z-50 bg-[#111111]/75 backdrop-blur-xl transition-transform duration-300">
<div className="flex items-center gap-12">
<a className="font-headline text-2xl font-bold text-[#FAF8F3] tracking-tighter hover:text-white transition-colors duration-200" href="#">
                Anime<span className="text-[#D32F2F]">X</span>
</a>
<div className="hidden md:flex gap-8 font-label text-sm uppercase tracking-wide">
<a className="text-[#FAF8F3]/70 hover:text-[#FAF8F3] transition-colors relative group" href="#">
                    Discover
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-300"></span>
</a>
{/* Active Item: Library (Assuming this is viewed from a user's context or library) */}
<a className="text-[#D32F2F] font-bold border-b-2 border-[#D32F2F] pb-1 relative" href="#">
                    Library
                </a>
<a className="text-[#FAF8F3]/70 hover:text-[#FAF8F3] transition-colors relative group" href="#">
                    Seasonal
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-300"></span>
</a>
<a className="text-[#FAF8F3]/70 hover:text-[#FAF8F3] transition-colors relative group" href="#">
                    Studio
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-300"></span>
</a>
</div>
</div>
<div className="flex items-center gap-6">
<button aria-label="Search" className="text-[#FAF8F3]/70 hover:text-[#FAF8F3] hover:bg-white/5 p-2 rounded-full transition-all duration-200 scale-95 active:scale-90">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 0"}}>search</span>
</button>
<button aria-label="Notifications" className="text-[#FAF8F3]/70 hover:text-[#FAF8F3] hover:bg-white/5 p-2 rounded-full transition-all duration-200 scale-95 active:scale-90">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 0"}}>notifications</span>
</button>
<button aria-label="Profile" className="text-[#FAF8F3]/70 hover:text-[#FAF8F3] hover:bg-white/5 p-2 rounded-full transition-all duration-200 scale-95 active:scale-90">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 0"}}>account_circle</span>
</button>
</div>
</nav>
{/* Main Content */}
<main className="flex-grow z-10">
{/* Hero Section */}
<section className="relative h-[65vh] w-full flex flex-col justify-end">
{/* Background Image */}
<div className="absolute inset-0 z-0">
<img alt="Attack on Titan Hero Background" className="w-full h-full object-cover" data-alt="A cinematic, high-contrast digital illustration of the Colossal Titan from Attack on Titan peering menacingly over a massive stone wall. Fire embers float in the air against a dark, moody sky. The color palette is dominated by deep blacks, charcoal greys, and intense Japanese Vermilion reds highlighting the titan's exposed muscle structure and glowing embers. The mood is apocalyptic, epic, and terrifyingly grand." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8AgMddHAUEqC2hZGNLL9FC_TtM_ERmwTiVn-YLWJaaK-lpDAfdYsM3kvOiFfaRohPn22k7i-hv07BT21YoIjK7QG_S9Ktrl-6IJkx_XmO6GqfeRRSk8cNuJZ1k4uq7NpbrxoS-knedrvKK6SnrtxbPyvZ5X8jLQ7yhit4MzOyzPNNXXNqfdsfAVlH9e8EORKeoPI8CCukUZSh3xFiEKte7L-35y-gTfQK15JhYF5PRptbr_Y8afVmtQ8ORGHWls_Bcc_z_mYcSW8"/>
{/* Gradient Overlay */}
<div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent"></div>
</div>
{/* Hero Content */}
<div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full flex flex-col items-start gap-4">
{/* Match Badge */}
<div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-[#D32F2F]/30 rounded-full px-4 py-1.5 shadow-glow mb-2">
<span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-pulse"></span>
<span className="font-label text-xs tracking-wider uppercase text-white/90">94% MATCH — Based on your taste</span>
</div>
{/* Titles */}
<div className="flex flex-col">
<span className="font-headline italic text-white/40 text-xl tracking-widest mb-1">進撃の巨人</span>
<h1 className="font-headline text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight shadow-sm">
                        Attack on Titan
                    </h1>
</div>
{/* Meta Info */}
<div className="flex flex-wrap items-center gap-4 font-label text-sm text-white/70 tracking-wide mt-2">
<span>2013-2023</span>
<span className="w-1 h-1 rounded-full bg-white/20"></span>
<span>87 Episodes</span>
<span className="w-1 h-1 rounded-full bg-white/20"></span>
<span>Completed</span>
<span className="w-1 h-1 rounded-full bg-white/20"></span>
<div className="flex items-center gap-1 text-[#D32F2F] font-bold bg-[#D32F2F]/10 px-2 py-0.5 rounded-sm">
<span className="material-symbols-outlined text-sm" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
                        9.1
                    </div>
</div>
{/* Tags & Studio */}
<div className="flex flex-wrap items-center gap-3 mt-1">
<div className="flex gap-2 font-label text-xs uppercase tracking-wider">
<span className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-white/80">Action</span>
<span className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-white/80">Dark</span>
<span className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-white/80">Drama</span>
<span className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-white/80">Psychological</span>
</div>
<span className="text-white/30 hidden md:inline">|</span>
<span className="font-label text-xs text-white/50 uppercase tracking-widest">Wit Studio • MAPPA</span>
</div>
{/* Actions */}
<div className="flex flex-wrap items-center gap-4 mt-6">
<button className="bg-[#D32F2F] hover:bg-[#8F1D1D] text-white font-label font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(211,47,47,0.3)] hover:shadow-[0_8px_30px_rgba(211,47,47,0.5)] transform hover:-translate-y-0.5">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>add</span>
                        Add to Watchlist
                    </button>
<button className="bg-transparent border border-white/20 hover:border-white/50 text-white font-label font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-white/5">
                        Rate Anime
                    </button>
<button aria-label="Like" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#D32F2F] hover:border-[#D32F2F]/50 transition-all duration-300 hover:bg-[#D32F2F]/10 group">
<span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{"fontVariationSettings":"'FILL' 0"}}>favorite</span>
</button>
</div>
</div>
</section>
{/* Content Grid Layout */}
<div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
{/* Left Column: Main Info (8 cols) */}
<div className="lg:col-span-8 flex flex-col gap-12">
{/* Synopsis Section */}
<section>
<div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
<h2 className="font-headline text-2xl font-bold text-white">Synopsis</h2>
<span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-label text-xs text-white/60 tracking-wider">
                            Manga • Hajime Isayama
                        </span>
</div>
<div className="font-body text-white/70 leading-relaxed text-lg font-light">
<p className="mb-4">
                            Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure.
                        </p>
<p className="mb-4">
                            To ensure their survival, the remnants of humanity began living within formidable defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.
                        </p>
<button className="text-[#D32F2F] hover:text-white font-label text-sm uppercase tracking-wider font-bold transition-colors flex items-center gap-1 group">
                            Read More
                            <span className="material-symbols-outlined text-sm group-hover:translate-y-0.5 transition-transform">expand_more</span>
</button>
</div>
</section>
{/* Why You'll Like This (Bento/Card Style) */}
<section className="bg-[#222222] border-l-4 border-[#D32F2F] rounded-r-xl p-8 shadow-card relative overflow-hidden group">
<div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
<h3 className="font-headline text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
<span className="material-symbols-outlined text-[#D32F2F]" style={{"fontVariationSettings":"'FILL' 1"}}>auto_awesome</span>
                        Why we recommend this for you
                    </h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
<div className="flex items-start gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] mt-2 shrink-0"></span>
<p className="font-body text-white/80 text-sm">Matches <strong className="text-white">91%</strong> of your psychological thriller preference</p>
</div>
<div className="flex items-start gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] mt-2 shrink-0"></span>
<p className="font-body text-white/80 text-sm">Structurally similar pacing to <strong className="text-white">Vinland Saga</strong></p>
</div>
<div className="flex items-start gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] mt-2 shrink-0"></span>
<p className="font-body text-white/80 text-sm">Highly popular with users in your <strong className="text-white">taste profile cohort</strong></p>
</div>
<div className="flex items-start gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] mt-2 shrink-0"></span>
<p className="font-body text-white/80 text-sm">Hits your preferred <strong className="text-white">Dark Fantasy / Action</strong> combo</p>
</div>
</div>
</section>
{/* Characters Row */}
<section>
<h2 className="font-headline text-2xl font-bold text-white mb-6 border-b border-white/5 pb-4">Main Cast</h2>
<div className="flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar" style={{"scrollbarWidth":"none"}}>
{/* Character 1 */}
<div className="flex flex-col items-center gap-3 min-w-[120px] snap-start group cursor-pointer">
<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#D32F2F] transition-all duration-300 relative shadow-card">
<img alt="Eren Yeager" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="A close-up portrait of an angry young anime man with intense green eyes and messy brown hair, looking determined and vengeful, in the style of high-quality modern anime like Attack on Titan. Dark cinematic lighting with a subtle red rim light on the edge of his face. Solid dark charcoal background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfQuzy5-V2vt--SYSvA_9P3o-nM856jhuM8x7BP-RbljQeHxbDmkLLx6caq2HtGmovEsjf5NrQsng_2nx6HCqsifxptP-DxT1-4Gj8olO-SVUy2wNLKyNi_oHR8RHqO64T73IMUimIQxIWpdxIUdft4dSSsDdY-gOAsyKYUtLAJFs-KPOfuQlcnDrNe8rBTcP53ctygCp7lRx7aF57d8dfR3rSZD8qsZAVu-pG9zDyyZOngAJTLMhCYqW4XBkBEVlq6-Nhi4vIDZU"/>
</div>
<div className="text-center">
<h4 className="font-body font-bold text-white/90 text-sm">Eren Yeager</h4>
<p className="font-label text-xs text-white/50 mt-0.5">Yuki Kaji</p>
</div>
</div>
{/* Character 2 */}
<div className="flex flex-col items-center gap-3 min-w-[120px] snap-start group cursor-pointer">
<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#D32F2F] transition-all duration-300 relative shadow-card">
<img alt="Mikasa Ackerman" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="A portrait of a stoic young anime woman with short black hair and a red scarf wrapped around her neck, looking protective and intense, in the style of modern cinematic anime. Dark background with cool dramatic lighting and a slight blue undertone." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy1ipV8WGOzHSoW9CiF15xUiWt4N1IYi-ZuOlfmkrBDrIJN5mRngXj_r7CUA9pFz5KF8RbtI_ZrmdDX73ce5JrCvxyD8Uvtc90twxiakRoa-72Y9tAz1SDCr05jfA2h53ecXVP_VxEVTKedxYSJsuCoNF6w_l1OD3nKHEi3iglpaXHxE7vpUJCeXeUQMp8TwE1r2am89frLkGLAzGsuaSVRJjUHthgNptS95wKAjqj4794moa0CyAXSC3iYoXnYxo-LDipArymDkY"/>
</div>
<div className="text-center">
<h4 className="font-body font-bold text-white/90 text-sm">Mikasa Ackerman</h4>
<p className="font-label text-xs text-white/50 mt-0.5">Yui Ishikawa</p>
</div>
</div>
{/* Character 3 */}
<div className="flex flex-col items-center gap-3 min-w-[120px] snap-start group cursor-pointer">
<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#D32F2F] transition-all duration-300 relative shadow-card">
<img alt="Armin Arlert" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="A portrait of an intelligent-looking young anime man with blonde hair and blue eyes, appearing thoughtful and anxious, in the style of modern cinematic anime. Warm but dim lighting, solid dark charcoal background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvgGI4u57Zb9L7yCB_4EXgK08ddNxBa6PCf6Gz_M16BmvLdn-NLmOr81Z7WhrCR7c9Rkew1kQJUBth7xYxJi4QvF_gtJOASMLpBT7MQBXoBz4KeDVK8-kk6EVfn5QvLwMzfPu_cnM0X2sXlDY7XjAQf3SD3izKz0sbd7y4St3w9ugFSbivMBlWQ4ERprZIS0quYeO8Wn5si3IP5Bvm1IBFu5GjjSe8D6aBWz-2xGnvTQ9s3PdmSCIzWT96giKWHHDIm5J7DUrYHM0"/>
</div>
<div className="text-center">
<h4 className="font-body font-bold text-white/90 text-sm">Armin Arlert</h4>
<p className="font-label text-xs text-white/50 mt-0.5">Marina Inoue</p>
</div>
</div>
{/* Character 4 */}
<div className="flex flex-col items-center gap-3 min-w-[120px] snap-start group cursor-pointer">
<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#D32F2F] transition-all duration-300 relative shadow-card">
<img alt="Levi Ackerman" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="A portrait of a stern, cold anime man with short black hair parted in the middle, looking intimidating and highly skilled, in the style of modern dark fantasy anime. Sharp cinematic lighting highlighting his sharp features against a pure black background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP4MiES2Z5l8SUYqjwZ_hHOgq8DsWvxlEd2CNsTFiUIqCnVc37Al5OILCbTm7cGrBmaX5zBygWyPG3Ux0qgSurnHULuke4MRaqqGXg3iwc_c0KA0P7f9-uTHGcWRPdmOAdLbREJPgd6OlZpaiAKCT6bc7vw0Z2QE3lIDgD7VRq1bcOv39fhcOQ9DLkhH_snyyjkJ_5WriJwd09QzTJyxnPOIu9kCZB05RHw1HX7u-jy9Y4CHx3zNO11AhskBypUk0Z0-uxKVaCg5k"/>
</div>
<div className="text-center">
<h4 className="font-body font-bold text-white/90 text-sm">Levi Ackerman</h4>
<p className="font-label text-xs text-white/50 mt-0.5">Hiroshi Kamiya</p>
</div>
</div>
{/* Character 5 */}
<div className="flex flex-col items-center gap-3 min-w-[120px] snap-start group cursor-pointer">
<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#D32F2F] transition-all duration-300 relative shadow-card">
<img alt="Erwin Smith" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="A portrait of a tall, authoritative anime man with blonde hair parted on the side and a stern expression, wearing a bolo tie, in a cinematic dark anime style. Strong, dramatic overhead lighting casting shadows over his eyes against a dark background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB21hrNyJ1uc_cMjNORhUCJoVYSdwvxHvbpb4cavx-88QnRzH3oLUwf2r8V1jf0aoZxI0MnMnw-op_8w7b0ENbwU9YgN05Hs4JqbJp8m8OxrACVWCz9p9A5xd9WNe354gvt5MK8hxwZYHHN9R0zPL6j5pVuyR_4EtO6o9kYJDxWJ_4ahkX3HHuc4rNh9ViUNYPvpSidXzggC0pJJFM8Kh-ZlTzhJVl-nz-j6AA63ZUeHLYNaHx7rNQtTr1JNFmmZDgLucPU7CT894w"/>
</div>
<div className="text-center">
<h4 className="font-body font-bold text-white/90 text-sm">Erwin Smith</h4>
<p className="font-label text-xs text-white/50 mt-0.5">Daisuke Ono</p>
</div>
</div>
</div>
</section>
</div>
{/* Right Column: Sidebar (4 cols) */}
<div className="lg:col-span-4 flex flex-col gap-8">
{/* Algorithm Insights Glass Card */}
<div className="glass-nav rounded-2xl p-6 shadow-elevated">
<h3 className="font-headline text-lg font-bold text-white mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-white/50">analytics</span>
                        Intelligence Insights
                    </h3>
<div className="space-y-5">
{/* Bar 1 */}
<div>
<div className="flex justify-between text-xs font-label text-white/70 uppercase tracking-wide mb-2">
<span>Similarity to Favorites</span>
<span className="text-white font-bold">85%</span>
</div>
<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
<div className="h-full bg-[#FAF8F3] w-[85%] rounded-full shadow-[0_0_10px_rgba(250,248,243,0.5)]"></div>
</div>
</div>
{/* Bar 2 */}
<div>
<div className="flex justify-between text-xs font-label text-white/70 uppercase tracking-wide mb-2">
<span>Collaborative Filtering</span>
<span className="text-[#D32F2F] font-bold">78%</span>
</div>
<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
<div className="h-full bg-[#D32F2F] w-[78%] rounded-full shadow-[0_0_10px_rgba(211,47,47,0.5)]"></div>
</div>
</div>
{/* Bar 3 */}
<div>
<div className="flex justify-between text-xs font-label text-white/70 uppercase tracking-wide mb-2">
<span>Genre Affinity</span>
<span className="text-white font-bold">91%</span>
</div>
<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
<div className="h-full bg-[#FAF8F3] w-[91%] rounded-full shadow-[0_0_10px_rgba(250,248,243,0.5)]"></div>
</div>
</div>
</div>
</div>
{/* Info Block */}
<div className="bg-[#222222] rounded-xl p-6 shadow-card">
<h3 className="font-headline text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">Information</h3>
<ul className="space-y-4 font-body text-sm">
<li className="flex flex-col gap-1">
<span className="font-label text-xs text-white/40 uppercase tracking-wider">Format</span>
<span className="text-white/90">TV Series</span>
</li>
<li className="flex flex-col gap-1">
<span className="font-label text-xs text-white/40 uppercase tracking-wider">Source</span>
<span className="text-white/90">Manga</span>
</li>
<li className="flex flex-col gap-1">
<span className="font-label text-xs text-white/40 uppercase tracking-wider">Season</span>
<span className="text-white/90">Spring 2013</span>
</li>
<li className="flex flex-col gap-1">
<span className="font-label text-xs text-white/40 uppercase tracking-wider">Licensor</span>
<span className="text-white/90">Funimation, Crunchyroll</span>
</li>
</ul>
</div>
</div>
</div>
</main>
{/* Footer (Shared Component) */}
<footer className="w-full border-t border-white/5 pt-16 pb-8 bg-[#111111] mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto gap-8 md:gap-0">
<div className="font-headline italic text-lg text-[#D32F2F]">
                © 2024 AnimeX. Intelligent Discovery.
            </div>
<div className="flex flex-wrap justify-center gap-8 font-label uppercase tracking-widest text-xs">
<a className="text-[#FAF8F3]/40 hover:text-[#FAF8F3] hover:text-[#D32F2F] transition-colors duration-200" href="#">
                    Privacy
                </a>
<a className="text-[#FAF8F3]/40 hover:text-[#FAF8F3] hover:text-[#D32F2F] transition-colors duration-200" href="#">
                    Terms
                </a>
<a className="text-[#FAF8F3]/40 hover:text-[#FAF8F3] hover:text-[#D32F2F] transition-colors duration-200" href="#">
                    Editorial Guidelines
                </a>
<a className="text-[#FAF8F3]/40 hover:text-[#FAF8F3] hover:text-[#D32F2F] transition-colors duration-200" href="#">
                    API
                </a>
</div>
</div>
</footer>


    </main>
  );
}
