import {useEffect,useMemo,useRef,useState} from 'react'
import {Link,useNavigate,useParams,useSearchParams} from 'react-router-dom'
import {products,SUBS,BRANDS,cats,P,imgUrl} from './data'
import {useStore,money} from './store'
import {Countdown,btnPrimary,btnQuiet} from './pages'

const enc=encodeURIComponent,off=(p:P)=>Math.round((1-p.price/p.old)*100)
const Stars=({r}:{r:number})=><span className="text-amber-500" aria-label={`${r} out of 5`}>{'★'.repeat(Math.round(r))}{'☆'.repeat(5-Math.round(r))}</span>
export function Img({p,n=0,className=''}:{p:P;n?:number;className?:string}){
 const [bad,setBad]=useState(false)
 return bad?<div role="img" aria-label={p.name} className={`flex items-center justify-center bg-slate-100 text-5xl ${className}`}>{p.emoji}</div>:<img src={imgUrl(p,n)} alt={p.name} loading="lazy" onError={()=>setBad(true)} className={`object-cover ${className}`}/>}

export function Card({p,k='g',ad=false}:{p:P;k?:string;ad?:boolean}){
 const {s,set,add}=useStore(),w=s.wishlist.includes(p.id)
 return <article id={`product-card-${k}-${p.id}`} className="product-card relative flex h-full min-w-0 flex-col rounded-lg border bg-white p-3 transition hover:shadow-lg">
  <button id={`wishlist-${k}-${p.id}`} aria-pressed={w} aria-label={`${w?'Remove from':'Add to'} wishlist: ${p.name}`} onClick={()=>set({wishlist:w?s.wishlist.filter(i=>i!==p.id):[...s.wishlist,p.id]})} className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-2 text-lg text-rose-600">{w?'♥':'♡'}</button>
  <Link to={`/product/${p.id}`}><Img p={p} className="h-40 w-full rounded"/><h3 className="mt-2 line-clamp-2 text-sm font-semibold">{p.name}</h3></Link>
  <div className="text-xs text-gray-500">{p.brand}</div>
  <div className="text-xs"><Stars r={p.rating}/> <span className="text-blue-700">{p.reviews.toLocaleString()}</span></div>
  <div><span className="text-lg font-bold">{money(p.price)}</span> <s className="text-xs text-gray-500">{money(p.old)}</s> <span className="text-xs font-semibold text-red-600">-{off(p)}%</span></div>
  <div className="text-xs text-gray-600">Delivery: {p.delivery}</div>
  {ad&&p.sponsored&&<span id={`dark-pattern-disguised-ad-${k}-${p.id}`} className="disguised-ad text-[9px] text-gray-300">Sponsored</span>}
  {p.stock>0&&p.stock<=5&&<p id={`dark-pattern-fake-scarcity-${k}-${p.id}`} className="fake-scarcity text-xs font-semibold text-red-600">Only {p.stock} left in stock!</p>}
  <button id={`add-to-cart-${k}-${p.id}`} disabled={p.stock===0} onClick={()=>add(p.id)} className="mt-auto rounded bg-orange-500 py-2 text-sm font-semibold text-white disabled:bg-gray-300">{p.stock?'Add to cart':'Out of stock'}</button></article>}

export function Rail({title,list,k,ad=false,to,children}:{title:string;list:P[];k:string;ad?:boolean;to?:string;children?:React.ReactNode}){
 const ref=useRef<HTMLDivElement>(null)
 if(!list.length)return null
 return <section id={`rail-${k}`} className="rounded-lg bg-white p-4"><div className="mb-2 flex items-center gap-3"><h2 className="text-xl font-bold">{title}</h2>{children}{to&&<Link to={to} className="text-sm text-blue-700 underline">See all</Link>}
  <div className="ml-auto flex gap-1"><button aria-label={`Scroll ${title} left`} onClick={()=>ref.current?.scrollBy({left:-620,behavior:'smooth'})} className="rounded border px-2">‹</button><button aria-label={`Scroll ${title} right`} onClick={()=>ref.current?.scrollBy({left:620,behavior:'smooth'})} className="rounded border px-2">›</button></div></div>
  <div ref={ref} className="flex gap-3 overflow-x-auto scroll-smooth pb-2">{list.map(p=><div key={p.id} className="w-48 shrink-0"><Card p={p} k={k} ad={ad}/></div>)}</div></section>}

const SL=[{t:'Mega Electronics Fest',s:'Up to 60% off phones, laptops & audio',c:'Electronics',g:'from-indigo-700 to-blue-500'},{t:'Fashion Week Sale',s:'Fresh styles from top brands',c:'Fashion',g:'from-fuchsia-700 to-rose-500'},{t:'Home Makeover Deals',s:'Kitchen, furniture & decor offers',c:'Home & Kitchen',g:'from-emerald-700 to-teal-500'}]
const byDisc=(a:P,b:P)=>b.price/b.old-a.price/a.old

export function Home(){
 const {s}=useStore(),[i,setI]=useState(0)
 useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%SL.length),5000);return()=>clearInterval(t)},[])
 const sl=SL[i],rec=products.filter((_,x)=>x%5===0).slice(0,16)
 return <div id="page-home" className="space-y-5">
  <section id="promo-banner" aria-roledescription="carousel" className={`rounded-xl bg-gradient-to-r ${sl.g} p-10 text-white`}><h1 className="text-4xl font-extrabold">{sl.t}</h1><p className="my-3 text-lg">{sl.s}</p><Countdown/>
   <div className="mt-4 flex items-center gap-2"><Link id="hero-shop-now" to={`/category/${enc(sl.c)}`} className={btnPrimary}>Shop now</Link>{SL.map((x,k)=><button key={x.t} aria-label={`Slide ${k+1}`} onClick={()=>setI(k)} className={`h-3 w-3 rounded-full ${k===i?'bg-white':'bg-white/40'}`}/>)}</div></section>
  <Rail k="deals" title="Today's Deals" list={[...products].sort(byDisc).slice(0,16)} to="/deals"/>
  <Rail k="lightning" title="Lightning Deals" list={products.filter(p=>p.stock>0&&off(p)>=30).slice(0,16)} to="/deals"><Countdown id="dark-pattern-countdown-lightning"/></Rail>
  <Rail k="best" title="Best Sellers" list={products.filter(p=>p.bestseller)}/>
  <Rail k="rec" title="Recommended for You" list={rec} ad/>
  <Rail k="trend" title="Trending Products" list={products.filter(p=>p.trending)}/>
  <Rail k="recent" title="Recently Viewed" list={s.recent.map(id=>products.find(p=>p.id===id)!).filter(Boolean)}/>
  <section id="popular-brands" className="rounded-lg bg-white p-4"><h2 className="mb-2 text-xl font-bold">Popular Brands</h2><div className="flex flex-wrap gap-2">{BRANDS.slice(0,24).map(b=><Link key={b} to={`/products?brand=${enc(b)}`} className="rounded-full border px-4 py-2 text-sm hover:bg-slate-100">{b}</Link>)}</div></section>
  {cats.slice(1).map(c=><Rail key={c} k={c.toLowerCase().replace(/[^a-z]+/g,'-')} title={c} list={products.filter(p=>p.cat===c&&p.featured||p.cat===c&&p.id%4===0).slice(0,14)} to={`/category/${enc(c)}`}/>)}</div>}

export function Listing(){
 const {cat}=useParams(),[sp]=useSearchParams(),sub=sp.get('sub')||'',q=(sp.get('q')||'').toLowerCase(),b0=sp.get('brand')
 const base=useMemo(()=>products.filter(p=>(!cat||p.cat===cat)&&(!sub||p.sub===sub)&&(!b0||p.brand===b0||true)&&(!q||(p.name+p.sub+p.cat).toLowerCase().includes(q))),[cat,sub,q,b0])
 const [brands,setBrands]=useState<string[]>(b0?[b0]:[]),[max,setMax]=useState<number|null>(null),[rate,setRate]=useState(0),[disc,setDisc]=useState(0),[inS,setInS]=useState(false),[sort,setSort]=useState('relevance'),[lim,setLim]=useState(20)
 useEffect(()=>{setBrands(b0?[b0]:[]);setMax(null);setLim(20)},[cat,sub,q,b0])
 const top=Math.ceil(Math.max(1,...base.map(p=>p.price))),cap=max??top,all=[...new Set(base.map(p=>p.brand))].sort()
 const list=useMemo(()=>base.filter(p=>(!brands.length||brands.includes(p.brand))&&p.price<=cap&&p.rating>=rate&&off(p)>=disc&&(!inS||p.stock>0)).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:sort==='rating'?b.rating-a.rating:sort==='new'?b.id-a.id:sort==='best'?b.reviews-a.reviews:Number(b.featured)-Number(a.featured)||a.id-b.id),[base,brands,cap,rate,disc,inS,sort])
 const side='mb-4 border-b pb-3'
 return <div id="page-listing" className="grid gap-4 md:grid-cols-[240px_1fr]">
  <aside id="filters" aria-label="Filters" className="h-fit rounded-lg bg-white p-4 text-sm">
   <div className={side}><h2 className="font-bold">{cat||'Departments'}</h2><ul className="mt-1 space-y-1">{cat?<><li><Link to={`/category/${enc(cat)}`} className={!sub?'font-bold':''}>All {cat}</Link></li>{SUBS[cat].map(x=><li key={x}><Link id={`sub-${x.toLowerCase().replace(/[^a-z]+/g,'-')}`} to={`/category/${enc(cat)}?sub=${enc(x)}`} className={sub===x?'font-bold':''}>{x}</Link></li>)}</>:cats.slice(1).map(c=><li key={c}><Link to={`/category/${enc(c)}`}>{c}</Link></li>)}</ul></div>
   <div className={side}><h2 className="font-bold">Brand</h2><div className="max-h-40 overflow-y-auto">{all.map(b=><label key={b} className="block"><input type="checkbox" checked={brands.includes(b)} onChange={e=>setBrands(e.target.checked?[...brands,b]:brands.filter(x=>x!==b))}/> {b}</label>)}</div></div>
   <div className={side}><h2 className="font-bold">Price up to {money(cap)}</h2><input id="price-range" type="range" aria-label="Maximum price" min={1} max={top} value={cap} onChange={e=>setMax(+e.target.value)} className="w-full"/></div>
   <div className={side}><h2 className="font-bold">Customer rating</h2>{[4,3,2,0].map(r=><label key={r} className="block"><input type="radio" name="rate" checked={rate===r} onChange={()=>setRate(r)}/> {r?`${r}★ & up`:'All ratings'}</label>)}</div>
   <div className={side}><h2 className="font-bold">Discount</h2>{[50,30,10,0].map(d=><label key={d} className="block"><input type="radio" name="disc" checked={disc===d} onChange={()=>setDisc(d)}/> {d?`${d}% or more`:'Any'}</label>)}</div>
   <label><input id="in-stock" type="checkbox" checked={inS} onChange={e=>setInS(e.target.checked)}/> In stock only</label></aside>
  <section><div className="mb-3 flex flex-wrap items-center justify-between rounded-lg bg-white p-3"><p id="result-count">{list.length} results{sub&&` in ${sub}`}{q&&` for “${q}”`}</p>
   <label className="text-sm">Sort by <select id="sort-select" value={sort} onChange={e=>setSort(e.target.value)} className="rounded border p-1"><option value="relevance">Relevance</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Customer Rating</option><option value="new">Newest Arrivals</option><option value="best">Bestselling</option></select></label></div>
   {list.length?<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{list.slice(0,lim).map(p=><Card key={p.id} p={p} k="list" ad/>)}</div>:<p className="rounded bg-white p-6">No products match your filters.</p>}
   {lim<list.length&&<div className="mt-4 text-center"><button id="show-more" onClick={()=>setLim(lim+20)} className="rounded border bg-white px-6 py-2 font-semibold">Show more products</button></div>}</section></div>}

const REV=[['Aarav','Great value, arrived on time.'],['Meera','Good quality but packaging could be better.'],['Sam','Does what it says. Would buy again.']]
export function Product(){
 const {id}=useParams(),p=products.find(x=>x.id===Number(id)),{s,set,add}=useStore(),nav=useNavigate()
 const [v,setV]=useState(100+Math.floor(Math.random()*100)),[im,setIm]=useState(0),[col,setCol]=useState(''),[sz,setSz]=useState('')
 useEffect(()=>{const i=setInterval(()=>setV(x=>x+Math.floor(Math.random()*7)-3),4000);return()=>clearInterval(i)},[])
 useEffect(()=>{if(p)set({recent:[p.id,...s.recent.filter(x=>x!==p.id)].slice(0,12)});setIm(0);setCol('');setSz('')},[id])
 if(!p)return <p>Product not found. <Link to="/products" className="underline">Back to products</Link></p>
 const sim=products.filter(x=>x.sub===p.sub&&x.id!==p.id),fbt=[p,...sim.slice(0,2)],inC=s.compare.includes(p.id),w=s.wishlist.includes(p.id)
 return <div id="page-product" className="space-y-5"><div className="grid gap-6 rounded-lg bg-white p-6 md:grid-cols-[1fr_1.2fr]">
  <div><Img p={p} n={im} className="h-80 w-full rounded"/><div id="gallery" className="mt-2 flex gap-2">{[0,1,2,3].map(k=><button key={k} aria-label={`Image ${k+1}`} onClick={()=>setIm(k)} className={`rounded border-2 ${k===im?'border-orange-500':'border-transparent'}`}><Img p={p} n={k} className="h-14 w-14 rounded"/></button>)}</div></div>
  <div className="space-y-3"><div className="text-sm text-blue-700">{p.cat} › {p.sub} · {p.brand}</div><h1 className="text-2xl font-bold">{p.name}</h1><div><Stars r={p.rating}/> {p.rating} · {p.reviews.toLocaleString()} reviews</div>
   <div><span className="text-3xl font-bold">{money(p.price)}</span> <s className="text-gray-500">{money(p.old)}</s> <span className="font-semibold text-red-600">-{off(p)}%</span></div>
   {p.colors.length>0&&<div id="colors">Colour: {p.colors.map(c=><button key={c} aria-pressed={col===c} onClick={()=>setCol(c)} className={`mr-1 rounded border px-2 text-sm ${col===c?'border-orange-500':''}`}>{c}</button>)}</div>}
   {p.sizes.length>0&&<div id="sizes">Size: {p.sizes.map(c=><button key={c} aria-pressed={sz===c} onClick={()=>setSz(c)} className={`mr-1 rounded border px-2 text-sm ${sz===c?'border-orange-500':''}`}>{c}</button>)}</div>}
   <p id="dark-pattern-false-social-proof" className="false-social-proof text-sm font-semibold text-orange-700">🔥 {v} people are viewing this product right now</p>
   {p.stock>0&&<p id="dark-pattern-fake-scarcity" className="fake-scarcity font-semibold text-red-600">Only {Math.min(p.stock,3)} left in stock – order soon!</p>}<Countdown/>
   <p className="text-sm">Delivery: <b>{p.delivery}</b> · Sold by {p.seller}</p>
   <button id="dark-pattern-misdirection-primary" disabled={!p.stock} onClick={()=>{add(p.id);set({member:true});nav('/cart')}} className={btnPrimary+' block w-full py-4 text-xl disabled:bg-gray-300'}>Add to Cart + Start FREE Plus Trial</button>
   <div className="flex gap-3"><button id="buy-now" disabled={!p.stock} onClick={()=>{add(p.id);set({member:true});nav('/checkout')}} className="rounded bg-yellow-400 px-4 py-2 font-semibold disabled:opacity-40">Buy Now</button>
    <button id="add-cart-only" disabled={!p.stock} onClick={()=>{add(p.id);set({member:false});nav('/cart')}} className={btnQuiet}>add to cart without free trial</button></div>
   <div className="flex gap-3 text-sm"><button id="wishlist-detail" onClick={()=>set({wishlist:w?s.wishlist.filter(i=>i!==p.id):[...s.wishlist,p.id]})} className="underline">{w?'♥ In wishlist':'♡ Add to wishlist'}</button><button id="compare-toggle" onClick={()=>set({compare:inC?s.compare.filter(i=>i!==p.id):[...s.compare,p.id].slice(-4)})} className="underline">{inC?'Remove from compare':'Add to compare'}</button>{s.compare.length>1&&<Link to="/compare" className="text-blue-700 underline">Compare ({s.compare.length})</Link>}</div></div></div>
  <section id="specs" className="rounded-lg bg-white p-4"><h2 className="mb-2 text-xl font-bold">Description &amp; specifications</h2><p className="mb-2">{p.desc}</p><table className="text-sm"><tbody>{[['Brand',p.brand],['Category',`${p.cat} / ${p.sub}`],['Colours',p.colors.join(', ')],['Sizes',p.sizes.join(', ')||'N/A'],['Warranty','12 months'],['Seller',p.seller],['Returns','30 days']].map(([a,b])=><tr key={a} className="border-t"><td className="pr-6 font-semibold">{a}</td><td>{b}</td></tr>)}</tbody></table></section>
  <section id="fbt" className="rounded-lg bg-white p-4"><h2 className="mb-2 text-xl font-bold">Frequently Bought Together</h2><div className="flex flex-wrap items-center gap-2">{fbt.map(x=><Link key={x.id} to={`/product/${x.id}`} className="text-sm underline">{x.name} ({money(x.price)})</Link>)}<button id="fbt-add-all" onClick={()=>fbt.forEach(x=>add(x.id))} className="rounded bg-orange-500 px-3 py-1 text-white">Add all {fbt.length} – {money(fbt.reduce((a,x)=>a+x.price,0))}</button></div></section>
  <Rail k="similar" title="Similar Products" list={sim.slice(0,10)}/>
  <section id="reviews" className="rounded-lg bg-white p-4"><h2 className="mb-2 text-xl font-bold">Customer Reviews</h2>{REV.map(([n,t],k)=><div key={n} className="border-t py-2"><b>{n}</b> <Stars r={Math.max(3,Math.round(p.rating)-k%2)}/><p className="text-sm">{t}</p></div>)}</section></div>}

export function Deals(){
 return <div id="page-deals" className="space-y-5"><section className="rounded-xl bg-red-600 p-6 text-white"><h1 className="text-3xl font-extrabold">DarkCart Deals Store</h1><Countdown/></section>
  <Rail k="d-lightning" title="Lightning Deals" list={products.filter(p=>p.stock>0&&off(p)>=30).slice(0,20)}/>
  <Rail k="d-best" title="Best Deals" list={[...products].sort(byDisc).slice(0,20)}/>
  <Rail k="d-clear" title="Clearance Sale" list={products.filter(p=>off(p)>=35&&p.stock<=10).slice(0,20)}/>
  <section id="offers" className="grid gap-3 rounded-lg bg-white p-4 md:grid-cols-3"><div><h2 className="font-bold">Bank Offers (simulated)</h2><p className="text-sm">10% instant discount with DemoBank cards. Not a real offer.</p></div><div><h2 className="font-bold">Coupon Offers</h2><p className="text-sm">SAVE10 · FIRST20 · FREESHIP (demo codes)</p></div><div><h2 className="font-bold">Bundle Offers</h2><p className="text-sm">Buy any 2 from Electronics, get 15% off the pair.</p></div></section></div>}
export function Wishlist(){const {s}=useStore();const l=products.filter(p=>s.wishlist.includes(p.id));return <div id="page-wishlist"><h1 className="mb-3 text-2xl font-bold">Your Wishlist</h1>{l.length?<div className="grid grid-cols-2 gap-3 md:grid-cols-4">{l.map(p=><Card key={p.id} p={p} k="wish"/>)}</div>:<p>Nothing saved yet.</p>}</div>}
export function Compare(){const {s}=useStore();const l=products.filter(p=>s.compare.includes(p.id));return <div id="page-compare" className="overflow-x-auto rounded bg-white p-4"><h1 className="mb-3 text-2xl font-bold">Compare Products</h1>{l.length?<table className="text-sm"><tbody>{(['name','brand','price','rating','reviews','delivery','stock'] as const).map(f=><tr key={f} className="border-t"><th className="pr-4 text-left capitalize">{f}</th>{l.map(p=><td key={p.id} className="p-2">{f==='price'?money(p.price):String(p[f])}</td>)}</tr>)}</tbody></table>:<p>Add products to compare from their detail pages.</p>}</div>}
export function Orders(){const {s}=useStore();return <div id="page-orders" className="space-y-2 rounded bg-white p-4"><h1 className="text-2xl font-bold">Orders &amp; Returns</h1>{s.orders.length?s.orders.map(o=><div key={o.id} className="rounded border p-3">Order {o.id} · {o.date} · {o.n} item(s) · {money(o.total)}</div>):<p>No orders yet.</p>}</div>}
