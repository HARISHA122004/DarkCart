export type P={id:number;name:string;cat:string;sub:string;brand:string;kw:string;emoji:string;price:number;old:number;rating:number;reviews:number;stock:number;desc:string;colors:string[];sizes:string[];delivery:string;bestseller:boolean;trending:boolean;featured:boolean;sponsored:boolean;seller:string}
const RAW:Record<string,{br:string;s:string[]}>={
'Electronics':{br:'Zenith,Orbitex,Pixelon,Aurum,Nokta,Voltrix,Lumio,Kenzo Tech',s:['Smartphones|Smartphone|📱|smartphone|299','Laptops|Laptop|💻|laptop|649','Tablets|Tablet|📲|tablet|229','Smart TVs|Smart TV|📺|television|399','Headphones|Over-Ear Headphones|🎧|headphones|79','Earbuds|Wireless Earbuds|🎧|earbuds|49','Smartwatches|Smartwatch|⌚|smartwatch|99','Cameras|Mirrorless Camera|📷|camera|549','Speakers|Bluetooth Speaker|🔊|speaker|59','Gaming Consoles|Gaming Console|🎮|console|349','Computer Accessories|Keyboard & Mouse Combo|⌨️|keyboard|34','Power Banks|Power Bank 20000mAh|🔋|powerbank|29']},
'Fashion':{br:'Urbane,Velour,Strand,Nomad Co,Larkin,Hyde & Co,Kiko,Mode',s:["Men's Clothing|Casual Shirt|👕|shirt|35","Women's Clothing|Summer Dress|👗|dress|45","Kids' Clothing|Kids Hoodie|🧥|kids,clothes|25",'Shoes|Sneakers|👟|sneakers|65','Watches|Analog Watch|🕰️|wristwatch|79','Handbags|Handbag|👜|handbag|59','Sunglasses|Sunglasses|🕶️|sunglasses|29','Accessories|Leather Belt|👛|belt|19']},
'Home & Kitchen':{br:'Hearth,Casa Nova,Brewline,Oakwood,Luma Home,Crisp,PureNest,Aroma',s:['Furniture|Office Chair|🪑|chair|129','Kitchen Appliances|Air Fryer|🍟|airfryer|79','Cookware|Cookware Set|🍳|cookware|89','Home Decor|Wall Art Frame|🖼️|decor|29','Lighting|LED Floor Lamp|💡|lamp|39','Storage|Storage Organizer|🧺|storage|24','Cleaning Appliances|Robot Vacuum|🧹|vacuum|199']},
'Beauty & Personal Care':{br:'Glow Lab,Petal,Aura,Velvet,Dermis,Bloom,Noir,Sage',s:['Skincare|Face Serum|🧴|skincare|19','Makeup|Makeup Palette|💄|makeup|24','Haircare|Hair Care Kit|✨|haircare|18','Perfumes|Eau de Parfum|🌸|perfume|49','Grooming Products|Grooming Kit|🧔|grooming|27']},
'Grocery':{br:'FreshFarm,Nutri,Golden Grain,Savora,PureLeaf,Crunchy,Daily Basket,Kinza',s:['Snacks|Snack Box|🍿|snacks|12','Beverages|Beverage Pack|🥤|beverage|15','Packaged Food|Pantry Pack|🍝|pasta|14','Household Essentials|Household Bundle|🧻|household|22','Personal Hygiene|Hygiene Pack|🧼|soap|11']},
'Books & Stationery':{br:'Pageturn,Inkwell,Scholar,Quill,Bookworm,Paperly,Notable,Clarity',s:['Fiction|Fiction Novel|📕|novel|12','Technology Books|Programming Guide|📘|programming,book|36','Academic Books|Academic Textbook|📚|textbook|48','Notebooks|Notebook Set|📓|notebook|14','Office Supplies|Office Supplies Kit|🖇️|stationery|21']},
'Sports & Fitness':{br:'Apex,Ironclad,Stride,TrailX,Flexor,Peak,Vigor,Summit',s:['Gym Equipment|Dumbbell Set|🏋️|dumbbell|79','Sportswear|Training Wear Set|🎽|sportswear|39','Fitness Accessories|Resistance Band Kit|🧘|fitness|19','Outdoor Equipment|Camping Tent|⛺|tent|99']},
'Toys & Baby Products':{br:'Tinytots,Playful,Brickly,Cuddle,BrightKid,Wondro,Bumble,Joyful',s:['Toys|Building Blocks Set|🧱|toys|29','Baby Care|Baby Care Kit|🍼|baby|26','Educational Toys|STEM Learning Kit|🔬|educational,toy|34','Baby Accessories|Baby Carrier|👶|baby,stroller|49']}}
export const cats=['All',...Object.keys(RAW)]
export const SUBS:Record<string,string[]>=Object.fromEntries(Object.entries(RAW).map(([c,v])=>[c,v.s.map(x=>x.split('|')[0])]))
const SER=['Pro','Lite','Max','Neo','Air','Plus','X','S','Edge','Prime','Ultra','Go'],COL=['Black','White','Blue','Red','Grey','Green','Silver','Rose Gold'],DEL=['Tomorrow','In 2 days','In 3–4 days','Free delivery by Fri']
let n=0
export const products:P[]=Object.entries(RAW).flatMap(([cat,v])=>{const br=v.br.split(',');return v.s.flatMap((row,j)=>{const [sub,noun,emoji,kw,base]=row.split('|');return Array.from({length:7},(_,i)=>{
 n++;const brand=br[(i+j)%br.length],price=Math.round(+base*(0.6+((i*3+j)%7)*0.14)*100)/100
 const clothing=["Men's Clothing","Women's Clothing","Kids' Clothing"].includes(sub)
 return {id:n,name:`${brand} ${SER[(i*5+j*3)%12]} ${100+((i*131+j*37)%900)} ${noun}`,cat,sub,brand,kw,emoji,price,old:Math.round(price*(1.1+((n*3)%9)/20)*100)/100,
  rating:Math.round((3.5+((n*7)%15)/10)*10)/10,reviews:(n*97)%9000+20,stock:n===1?2:n%37===0?0:(n*7)%31,
  desc:`${brand} ${noun.toLowerCase()} in the ${SER[(i*5+j*3)%12]} range: dependable ${sub.toLowerCase()} pick with easy 30-day returns.`,
  colors:Array.from({length:1+n%4},(_,k)=>COL[(n+k*3)%8]),sizes:clothing?['S','M','L','XL']:sub==='Shoes'?['6','7','8','9','10']:[],delivery:DEL[n%4],
  bestseller:n%9===0,trending:n%7===0,featured:n%11===0,sponsored:n%13===0,seller:i%2?`${brand} Official Store`:'DarkCart Retail'} as P})})})
export const BRANDS=[...new Set(products.map(p=>p.brand))]
export const imgUrl=(p:P,k=0)=>`https://loremflickr.com/480/480/${p.kw}?lock=${p.id+k*1000}`
export const EXTRAS=[{id:'e1',name:'Screen & Gadget Care Kit',price:9.99},{id:'e2',name:'Priority Handling Upgrade',price:4.99}]
