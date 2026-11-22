import {useEffect,useMemo,useState,FormEvent} from 'react'
import {Link,useNavigate,useParams,useSearchParams} from 'react-router-dom'
import {products,EXTRAS} from './data'
import {useStore,totals,money} from './store'

export const btnPrimary='rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 text-lg shadow'
export const btnQuiet='text-xs text-gray-400 underline'

export function Countdown({id='dark-pattern-countdown'}:{id?:string}){
 const [t,setT]=useState(599)
 useEffect(()=>{const i=setInterval(()=>setT(x=>(x>0?x-1:599)),1000);return()=>clearInterval(i)},[])
 const m=String(Math.floor(t/60)).padStart(2,'0'),sec=String(t%60).padStart(2,'0')
 return <div id={id} className="countdown inline-block rounded bg-red-600 px-4 py-2 text-xl font-extrabold text-white">Offer expires in {m}:{sec}</div>}

export function Cart(){
 const {s,set,qty}=useStore(),t=totals(s),items=Object.keys(s.cart).map(Number)
 if(!items.length)return <div id="page-cart" className="rounded bg-white p-8">Your cart is empty. <Link to="/products" className="underline">Continue shopping</Link></div>
 return <div id="page-cart" className="grid gap-6 md:grid-cols-3"><section className="space-y-3 md:col-span-2"><h1 className="text-2xl font-bold">Shopping Cart</h1>
  {items.map(i=>{const p=products.find(x=>x.id===i)!;return <div key={i} id={`cart-item-${i}`} className="flex items-center gap-4 rounded bg-white p-4"><span className="text-4xl">{p.emoji}</span><div className="flex-1"><b>{p.name}</b><div>{money(p.price)}</div></div>
   <button aria-label={`Decrease ${p.name}`} onClick={()=>qty(i,s.cart[i]-1)} className="rounded border px-2">−</button><span id={`qty-${i}`}>{s.cart[i]}</span><button aria-label={`Increase ${p.name}`} onClick={()=>qty(i,s.cart[i]+1)} className="rounded border px-2">+</button>
   <button id={`remove-${i}`} onClick={()=>qty(i,0)} className="text-sm text-red-600">Remove</button></div>})}
  <div className="space-y-2 rounded bg-white p-4"><h2 className="font-semibold">Recommended protection &amp; services</h2>
   <label id="dark-pattern-preselected-addon" className="preselected-addon flex gap-2"><input id="addon-protection" type="checkbox" checked={s.protection} onChange={e=>set({protection:e.target.checked})}/>Add DarkCart Protect 2-year plan – {money(12.99)}</label>
   <label id="dark-pattern-hidden-subscription" className="hidden-subscription flex gap-2 text-sm text-gray-600"><input id="addon-membership" type="checkbox" checked={s.member} onChange={e=>set({member:e.target.checked})}/>Join DarkCart Plus: 7 days free, then {money(14.99)}/month</label></div></section>
  <aside id="cart-summary" className="h-fit space-y-2 rounded bg-white p-4"><h2 className="font-bold">Order summary</h2>
   <div className="flex justify-between"><span>Subtotal</span><span>{money(t.sub)}</span></div>
   {t.prot>0&&<div className="flex justify-between"><span>Protect plan</span><span>{money(t.prot)}</span></div>}
   {t.mem>0&&<div className="flex justify-between"><span>Plus membership</span><span>{money(t.mem)}</span></div>}
   <div className="text-sm text-gray-500">Shipping calculated at checkout</div>
   <div className="flex justify-between border-t pt-2 font-bold"><span>Estimated total</span><span>{money(t.preTotal)}</span></div>
   <Link id="proceed-to-checkout" to="/checkout" className={btnPrimary+' block text-center'}>Proceed to checkout</Link></aside></div>}

export function Checkout(){
 const {s,set}=useStore(),nav=useNavigate(),t=totals(s),n=Object.values(s.cart).reduce((a,b)=>a+b,0)
 if(!n)return <p>Your cart is empty. <Link to="/products" className="underline">Shop now</Link></p>
 const place=()=>{if(!s.user){nav('/login?next=/checkout&required=1');return}
  set({order:{total:t.total,n,member:s.member},orders:[{id:'DC'+Date.now().toString().slice(-6),date:new Date().toLocaleDateString(),total:t.total,n},...s.orders],cart:{},sub:s.member&&s.sub==='none'?'trial':s.sub});nav('/confirmation')}
 return <div id="page-checkout" className="grid gap-6 md:grid-cols-3"><section className="space-y-4 md:col-span-2">
  <ol className="flex gap-2 text-sm text-gray-500"><li>1. Cart</li><li className="font-bold text-black">› 2. Checkout</li><li>› 3. Confirmation</li></ol>
  <div id="dark-pattern-disguised-addon" className="disguised-addon space-y-2 rounded bg-white p-4"><h2 className="font-semibold">Recommended for your order</h2>
   {EXTRAS.map(e=><label key={e.id} id={`extra-${e.id}`} className="flex gap-2"><input type="checkbox" checked={s.extras.includes(e.id)} onChange={x=>set({extras:x.target.checked?[...s.extras,e.id]:s.extras.filter(i=>i!==e.id)})}/>{e.name} – {money(e.price)}</label>)}</div>
  <label id="dark-pattern-trick-wording" className="trick-wording flex gap-2 rounded bg-white p-4 text-sm"><input type="checkbox" defaultChecked/>Uncheck to not stop receiving partner offers and to not keep my saved card off future orders</label><div className="rounded bg-white p-4"><h2 className="font-semibold">Shipping details (demo – use any fake text)</h2><input aria-label="Full name" placeholder="Full name" className="my-1 w-full rounded border p-2"/><input aria-label="Address" placeholder="Address" className="w-full rounded border p-2"/></div></section>
  <aside id="checkout-summary" className="h-fit space-y-2 rounded bg-white p-4"><h2 className="font-bold">Order total</h2>
   <div className="flex justify-between"><span>Items</span><span>{money(t.sub)}</span></div>
   {t.prot>0&&<div className="flex justify-between"><span>Protect plan</span><span>{money(t.prot)}</span></div>}
   {t.mem>0&&<div className="flex justify-between"><span>Plus membership</span><span>{money(t.mem)}</span></div>}
   {t.ex>0&&<div className="flex justify-between"><span>Recommended items</span><span>{money(t.ex)}</span></div>}
   <div id="dark-pattern-hidden-cost" className="hidden-cost space-y-1 text-sm"><div className="flex justify-between"><span>Shipping</span><span>{money(t.ship)}</span></div><div className="flex justify-between"><span>Order protection &amp; processing</span><span>{money(t.handling)}</span></div></div>
   <div className="flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span id="checkout-total">{money(t.total)}</span></div>
   <button id="place-order" onClick={place} className={btnPrimary+' w-full'}>Place your order</button></aside></div>}

export function Login(){
 const {set}=useStore(),nav=useNavigate(),[sp]=useSearchParams(),[reg,setReg]=useState(true),[more,setMore]=useState(false)
 const [pv,setPv]=useState({ads:true,partners:true,location:true})
 const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const em=(new FormData(e.currentTarget).get('email')as string)||'demo@example.test';set({user:em});nav(sp.get('next')||'/')}
 return <div id="page-login" className="mx-auto max-w-md space-y-3 rounded bg-white p-6">
  {sp.get('required')&&<p id="dark-pattern-forced-registration" className="forced-registration rounded bg-yellow-100 p-2 text-sm">You must create an account to complete your purchase.</p>}
  <h1 className="text-2xl font-bold">{reg?'Create your account':'Sign in'}</h1>
  <form onSubmit={submit} className="space-y-2"><input name="email" type="email" required aria-label="Email" placeholder="email (fake is fine)" className="w-full rounded border p-2"/><input name="password" type="password" required aria-label="Password" placeholder="password (fake)" className="w-full rounded border p-2"/>
   <div id="dark-pattern-privacy-zuckering" className="privacy-zuckering space-y-1 rounded border p-3 text-sm"><p>Personalize my experience: we share activity with trusted partners.</p>
    {more&&<div id="privacy-options" className="space-y-1">{(['ads','partners','location']as const).map(k=><label key={k} className="flex gap-2"><input type="checkbox" checked={pv[k]} onChange={e=>setPv({...pv,[k]:e.target.checked})}/>Do not restrict {k} data sharing</label>)}</div>}
    <button type="button" id="privacy-customize" onClick={()=>setMore(!more)} className={btnQuiet}>{more?'hide':'manage'} privacy choices</button></div>
   <button id="accept-all-continue" type="submit" className={btnPrimary+' w-full'}>{reg?'Accept all & create account':'Accept all & sign in'}</button></form>
  <button id="toggle-auth-mode" onClick={()=>setReg(!reg)} className="text-sm underline">{reg?'Already have an account? Sign in':'New here? Register'}</button></div>}

export function Confirmation(){
 const {s}=useStore()
 return <div id="page-confirmation" className="space-y-2 rounded bg-white p-8"><h1 className="text-2xl font-bold">Order confirmed (simulation)</h1>
  {s.order?<><p>{s.order.n} item(s) – total charged {money(s.order.total)} (mock, no real payment).</p>{s.order.member&&<p className="text-sm text-gray-600">Your Plus free trial has started and converts to {money(14.99)}/month automatically.</p>}</>:<p>No recent order.</p>}
  <Link to="/subscription" className="underline">Manage membership</Link></div>}

export function Subscription(){
 const {s,set}=useStore(),[step,setStep]=useState(0),[why,setWhy]=useState(''),[txt,setTxt]=useState('')
 const active=s.sub==='trial'||s.sub==='active'
 const cancel=()=>{set({sub:'cancelled',member:false});setStep(0)}
 return <div id="page-subscription" className="mx-auto max-w-xl space-y-4 rounded bg-white p-6"><h1 className="text-2xl font-bold">DarkCart Plus membership</h1><p id="subscription-status">Status: <b>{s.sub}</b></p>
  {!active&&<div id="dark-pattern-forced-continuity" className="forced-continuity space-y-2"><p>Start your 7-day free trial. After the trial your card is charged {money(14.99)}/month automatically.</p>
   <button id="start-trial" onClick={()=>set({sub:'trial'})} className={btnPrimary+' w-full'}>Start my FREE trial</button></div>}
  {active&&<div id="dark-pattern-roach-motel" className="roach-motel space-y-3">
   {step===0&&<><p>You are enjoying free shipping, deals and early access.</p><button id="keep-membership" className={btnPrimary} onClick={()=>{}}>Keep my benefits</button><div><button id="cancel-step-0" onClick={()=>setStep(1)} className={btnQuiet}>end membership</button></div></>}
   {step===1&&<><p className="font-semibold">Are you sure? You'll lose free shipping and exclusive prices.</p><button id="cancel-keep-1" onClick={()=>setStep(0)} className={btnPrimary}>Never mind, keep Plus</button><div><button id="cancel-step-1" onClick={()=>setStep(2)} className={btnQuiet}>continue cancelling</button></div></>}
   {step===2&&<><p>Tell us why you're leaving (required):</p>{['Too expensive','Not using it','Other'].map(r=><label key={r} className="block"><input type="radio" name="why" checked={why===r} onChange={()=>setWhy(r)}/> {r}</label>)}<button id="cancel-keep-2" onClick={()=>setStep(0)} className={btnPrimary}>Keep Plus</button><div><button id="cancel-step-2" disabled={!why} onClick={()=>setStep(3)} className={btnQuiet+' disabled:opacity-40'}>next</button></div></>}
   {step===3&&<><p className="font-semibold">Wait! 50% off for 3 months?</p><button id="accept-offer" onClick={()=>setStep(0)} className={btnPrimary}>Yes, give me 50% off</button><div><button id="cancel-step-3" onClick={()=>setStep(4)} className={btnQuiet}>no thanks, I still want to cancel</button></div></>}
   {step===4&&<><p>Type <b>CANCEL</b> to confirm.</p><input id="cancel-confirm-input" aria-label="Type CANCEL" value={txt} onChange={e=>setTxt(e.target.value)} className="rounded border p-2"/><div><button id="cancel-final" disabled={txt!=='CANCEL'} onClick={cancel} className="rounded border px-3 py-1 text-sm disabled:opacity-40">Confirm cancellation</button></div></>}</div>}</div>}

const ROWS:[string,string,string,string][]=[
['Fake Countdown','Home, Product','Timer resets on reload','dark-pattern-countdown'],['Fake Limited Stock','Home, Products, Product','"Only N left!"','dark-pattern-fake-scarcity[-id]'],['False Social Proof','Product','Synthetic viewer count','dark-pattern-false-social-proof'],
['Confirmshaming','Any page (popup after 3s)','Guilt-trip decline text','dark-pattern-confirmshaming'],['Misdirection / Visual hierarchy','Product, Cart, Cancel flow','Big orange CTA vs tiny grey link','dark-pattern-misdirection-primary'],
['Hidden Costs','Checkout','Shipping & handling appear late','dark-pattern-hidden-cost'],['Preselected Add-on','Cart','Protect plan pre-checked','dark-pattern-preselected-addon'],['Hidden Subscription','Cart','Plus membership pre-checked','dark-pattern-hidden-subscription'],
['Disguised Add-ons','Checkout','"Recommended" items pre-checked','dark-pattern-disguised-addon'],['Roach Motel','Subscription','5-step cancel vs 1-click join','dark-pattern-roach-motel'],['Forced Continuity','Subscription, Confirmation','Free trial auto-converts','dark-pattern-forced-continuity'],
['Nagging','Every page change','Plus banner reappears','dark-pattern-nagging'],['Forced Registration','Checkout → Login','Account required to order','dark-pattern-forced-registration'],['Privacy Zuckering','Login/Register','Accept-all prominent, options hidden','dark-pattern-privacy-zuckering'],['Disguised Ads','Home, Listing','Sponsored items styled as organic picks','dark-pattern-disguised-ad-*'],['Trick Wording','Checkout','Double-negative opt-out label','dark-pattern-trick-wording']]
export function Research(){
 return <div id="page-research" className="overflow-x-auto rounded bg-white p-4"><h1 className="mb-3 text-2xl font-bold">Researcher test guide</h1>
  <table className="w-full text-left text-sm"><thead><tr><th>Pattern</th><th>Page</th><th>Expected behaviour</th><th>DOM id</th></tr></thead><tbody>{ROWS.map(r=><tr key={r[0]} className="border-t">{r.map((c,i)=><td key={i} className="py-1 pr-2">{c}</td>)}</tr>)}</tbody></table></div>}
