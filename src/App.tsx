import {useEffect,useMemo,useState,FormEvent} from 'react'
import {Link,Route,Routes,useLocation,useNavigate} from 'react-router-dom'
import {Search,ShoppingCart,User,MapPin,Heart} from 'lucide-react'
import {useStore} from './store'
import {products,cats} from './data'
import {Cart,Checkout,Login,Confirmation,Subscription,Research} from './pages'
import {Home,Listing,Product,Deals,Wishlist,Compare,Orders} from './market'
const LOC=['Springfield 560001','Rivertown 400002','Lakeview 600003','Maple City 110004']

function Newsletter(){
 const [open,setOpen]=useState(false)
 useEffect(()=>{const t=setTimeout(()=>setOpen(true),3000);return()=>clearTimeout(t)},[])
 if(!open)return null
 return <div role="dialog" aria-modal="true" aria-label="Newsletter" id="newsletter-popup" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div id="dark-pattern-confirmshaming" className="confirmshaming w-80 space-y-3 rounded-xl bg-white p-6 text-center"><h2 className="text-xl font-bold">Join our newsletter!</h2><p>Get exclusive deals straight to your inbox.</p>
   <button id="newsletter-accept" onClick={()=>setOpen(false)} className="w-full rounded-lg bg-green-600 py-3 text-lg font-bold text-white">Yes, I want 20% OFF!</button>
   <button id="newsletter-decline" onClick={()=>setOpen(false)} className="text-xs text-gray-400 underline">No, I prefer paying full price.</button></div></div>}

export default function App(){
 const {s,set}=useStore(),nav=useNavigate(),loc=useLocation(),[q,setQ]=useState(''),[nag,setNag]=useState(true),[focus,setFocus]=useState(false)
 useEffect(()=>{setNag(true);window.scrollTo(0,0)},[loc.pathname])
 const n=Object.values(s.cart).reduce((a,b)=>a+b,0)
 const sug=useMemo(()=>q.length<2?[]:products.filter(p=>(p.name+p.sub).toLowerCase().includes(q.toLowerCase())).slice(0,7),[q])
 const search=(e:FormEvent)=>{e.preventDefault();setFocus(false);nav('/products?q='+encodeURIComponent(q))}
 return <>
  <div id="promo-bar" className="bg-blue-700 py-1 text-center text-xs text-white">Free delivery on orders over $35 · Use code DARK10 · Mega Weekend Sale is live</div>
  <header id="site-header" className="bg-slate-900 text-white"><nav aria-label="Main" className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4 p-3">
   <Link id="logo" to="/" className="text-2xl font-extrabold text-orange-400">DarkCart</Link>
   <label className="flex items-center gap-1 text-xs"><MapPin size={16}/><span className="sr-only">Deliver to</span><select id="location-select" value={s.location} onChange={e=>set({location:e.target.value})} className="bg-slate-900">{LOC.map(l=><option key={l}>{l}</option>)}</select></label>
   <form onSubmit={search} role="search" className="relative flex min-w-[240px] flex-1"><input id="search-input" aria-label="Search products" autoComplete="off" value={q} onFocus={()=>setFocus(true)} onChange={e=>setQ(e.target.value)} placeholder="Search products, brands and more" className="w-full rounded-l bg-white p-2 text-black"/><button aria-label="Search" id="search-button" className="rounded-r bg-orange-500 px-3"><Search size={18}/></button>
    {focus&&sug.length>0&&<ul id="search-suggestions" role="listbox" className="absolute left-0 top-full z-40 w-full rounded-b bg-white text-sm text-black shadow-lg">{sug.map(p=><li key={p.id} role="option" aria-selected="false"><button type="button" onMouseDown={()=>{setFocus(false);setQ('');nav(`/product/${p.id}`)}} className="block w-full px-3 py-2 text-left hover:bg-slate-100">{p.name}</button></li>)}</ul>}</form>
   <Link to="/login" id="nav-account" className="flex items-center gap-1"><User size={18}/>{s.user?s.user.split('@')[0]:'Sign in'}</Link>
   <Link to="/orders" id="nav-orders">Orders &amp; Returns</Link><Link to="/wishlist" id="nav-wishlist" aria-label="Wishlist" className="flex items-center gap-1"><Heart size={18}/>{s.wishlist.length}</Link>
   <Link to="/cart" id="nav-cart" className="flex items-center gap-1" aria-label="Cart"><ShoppingCart size={20}/><span id="cart-count">{n}</span></Link></nav>
   <nav aria-label="Categories" id="category-nav" className="bg-slate-800"><ul className="mx-auto flex max-w-[1440px] gap-4 overflow-x-auto px-3 py-2 text-sm whitespace-nowrap">
    <li><Link to="/deals" id="nav-deals" className="font-bold text-orange-300">Today's Deals</Link></li>{cats.slice(1).map(c=><li key={c}><Link to={`/category/${encodeURIComponent(c)}`}>{c}</Link></li>)}<li><Link to="/subscription" id="nav-membership">DarkCart Plus</Link></li></ul></nav></header>
  {nag&&loc.pathname!=='/research'&&loc.pathname!=='/subscription'&&<div id="dark-pattern-nagging" className="nagging bg-amber-100 p-2 text-center text-sm">⭐ Upgrade to DarkCart Plus – free 7-day trial! <Link to="/subscription" className="font-bold underline">Try it free</Link> <button id="nag-dismiss" onClick={()=>setNag(false)} className="ml-3 text-xs text-gray-400">later</button></div>}
  <main id="main" key={loc.pathname} className="page mx-auto max-w-[1440px] p-4"><Routes>
   <Route path="/" element={<Home/>}/><Route path="/products" element={<Listing/>}/><Route path="/category/:cat" element={<Listing/>}/><Route path="/product/:id" element={<Product/>}/><Route path="/deals" element={<Deals/>}/>
   <Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/login" element={<Login/>}/><Route path="/confirmation" element={<Confirmation/>}/>
   <Route path="/subscription" element={<Subscription/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/compare" element={<Compare/>}/><Route path="/orders" element={<Orders/>}/><Route path="/research" element={<Research/>}/>
   <Route path="*" element={<p>Page not found. <Link to="/" className="underline">Home</Link></p>}/></Routes></main>
  {loc.pathname==='/'&&<Newsletter/>}
  <footer id="site-footer" className="mt-6 bg-slate-900 p-6 text-sm text-gray-300"><div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-4"><div><h2 className="font-bold text-white">Customer Support</h2><p>Help Centre · Track Order · Returns</p></div><div><h2 className="font-bold text-white">Policies</h2><p>Privacy · Terms · Refunds</p></div><div><h2 className="font-bold text-white">Company</h2><p>About DarkCart · Careers · Press</p></div><div><h2 className="font-bold text-white">Research</h2><Link id="nav-research" to="/research" className="underline">Researcher guide</Link></div></div></footer>
  <div id="research-mode-label" className="fixed bottom-0 left-0 z-40 w-full bg-gray-800 py-1 text-center text-xs text-white">Academic Research Simulation – No Real Transactions</div></>}
