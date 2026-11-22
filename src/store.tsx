import {createContext,useContext,useEffect,useState,ReactNode} from 'react'
import {products,EXTRAS} from './data'
export type Sub='none'|'trial'|'active'|'cancelled'
export type Order={total:number;n:number;member:boolean}|null
export type S={cart:Record<number,number>;protection:boolean;member:boolean;extras:string[];user:string|null;sub:Sub;order:Order;wishlist:number[];recent:number[];compare:number[];orders:{id:string;date:string;total:number;n:number}[];location:string}
const init:S={cart:{},protection:true,member:true,extras:['e1'],user:null,sub:'none',order:null,wishlist:[],recent:[],compare:[],orders:[],location:'Springfield 560001'}
type C={s:S;set:(p:Partial<S>)=>void;add:(id:number,q?:number)=>void;qty:(id:number,q:number)=>void}
const Ctx=createContext<C>(null as unknown as C)
export const useStore=()=>useContext(Ctx)
export function Provider({children}:{children:ReactNode}){
 const [s,setS]=useState<S>(()=>{try{return {...init,...JSON.parse(localStorage.getItem('darkcart')||'{}')}}catch{return init}})
 useEffect(()=>{localStorage.setItem('darkcart',JSON.stringify(s))},[s])
 const set=(p:Partial<S>)=>setS(x=>({...x,...p}))
 const add=(id:number,q=1)=>setS(x=>({...x,cart:{...x.cart,[id]:(x.cart[id]||0)+q}}))
 const qty=(id:number,q:number)=>setS(x=>{const c={...x.cart};if(q<=0)delete c[id];else c[id]=q;return {...x,cart:c}})
 return <Ctx.Provider value={{s,set,add,qty}}>{children}</Ctx.Provider>}
export const money=(n:number)=>'$'+n.toFixed(2)
export function totals(s:S){
 const sub=Object.entries(s.cart).reduce((a,[id,q])=>a+(products.find(p=>p.id===+id)?.price||0)*q,0),has=sub>0
 const prot=has&&s.protection?12.99:0,mem=has&&s.member?14.99:0
 const ex=has?s.extras.reduce((a,id)=>a+(EXTRAS.find(e=>e.id===id)?.price||0),0):0
 const ship=has?6.99:0,handling=has?3.49:0
 return {sub,prot,mem,ex,ship,handling,preTotal:sub+prot+mem,total:sub+prot+mem+ex+ship+handling}}
