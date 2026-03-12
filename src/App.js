import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabase";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:        "#F7F5F1",
  surface:   "#FFFFFF",
  border:    "#E2DDD6",
  borderMid: "#C8C0B4",
  text:      "#1C1916",
  textMid:   "#6B6560",
  textLight: "#A09890",
  accent:    "#3D6B4F",
  accentBg:  "#EEF3EF",
  warn:      "#B85C38",
  warnBg:    "#FAF0EC",
  gold:      "#8A6E3E",
  goldBg:    "#FAF6EE",
  radius:    "4px",
  radiusMd:  "8px",
  radiusLg:  "14px",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const DINNER_MEALS = [
  { id:"d1",  name:"Tempeh Rice Bowl",       tags:["Protein","Asian","Fave"],    desc:"Crispy tempeh, cucumber salad, sesame dressing",       ingredients:["tempeh","jasmine rice","Persian cucumbers","avocado","tamari","sesame oil","rice vinegar","sriracha","green onions","sesame seeds","lime","ginger"] },
  { id:"d2",  name:"Lentil Curry",            tags:["Cozy","One-Pot","Fave"],    desc:"Red lentils, coconut milk, 30 minutes",                ingredients:["red lentils","coconut milk","diced tomatoes","onion","garlic","ginger","olive oil","vegetable broth","curry powder","garam masala","basmati rice","lemon"] },
  { id:"d3",  name:"Lentil Soup",             tags:["Cozy","One-Pot","Hearty"],  desc:"Warming batch soup with smoked paprika",               ingredients:["green lentils","onion","carrots","celery","diced tomatoes","vegetable broth","garlic","cumin","smoked paprika","olive oil","lemon","parsley"] },
  { id:"d4",  name:"Black Bean Salad",        tags:["Fresh","Quick","Protein"],  desc:"Black beans, corn, avocado, lime dressing",            ingredients:["black beans","frozen corn","avocado","red bell pepper","red onion","cilantro","lime","olive oil","cumin","cherry tomatoes"] },
  { id:"d5",  name:"Mediterranean Salad",     tags:["Fresh","Light","Quick"],    desc:"Crisp greens, olives, feta, herby dressing",           ingredients:["romaine lettuce","Persian cucumbers","cherry tomatoes","kalamata olives","feta cheese","red onion","olive oil","red wine vinegar","dried oregano","lemon","crispy chickpeas"] },
  { id:"d6",  name:"Stuffed Sweet Potatoes",  tags:["Cozy","Protein","Fave"],    desc:"Loaded with black beans, smoky spices, cheddar",       ingredients:["sweet potatoes","black beans","diced tomatoes","red onion","garlic","cumin","smoked paprika","olive oil","cheddar cheese","Greek yogurt","cilantro","lime"] },
  { id:"d7",  name:"Halloumi Salad",          tags:["Fresh","Protein","Quick"],  desc:"Pan-fried halloumi over greens with roasted veg",      ingredients:["halloumi cheese","mixed greens","cherry tomatoes","Persian cucumbers","red bell pepper","red onion","olive oil","lemon","honey","fresh mint","walnuts"] },
  { id:"d8",  name:"Sheet Pan Roast",         tags:["Easy","Healthy","Protein"], desc:"Roasted veg and tofu with tahini drizzle",             ingredients:["extra firm tofu","sweet potatoes","red bell pepper","zucchini","red onion","chickpeas","olive oil","garlic powder","smoked paprika","tahini","lemon"] },
  { id:"d9",  name:"Stuffed Bell Peppers",    tags:["Hearty","Protein","Fave"],  desc:"Lentils, rice, tomato sauce, baked",                   ingredients:["bell peppers","green lentils","jasmine rice","diced tomatoes","tomato paste","onion","garlic","cumin","smoked paprika","olive oil","vegetable broth","parsley"] },
  { id:"d10", name:"Vegetarian Chili",        tags:["Hearty","One-Pot","Batch"], desc:"Smoky, rich, great for leftovers",                     ingredients:["black beans","kidney beans","diced tomatoes","tomato paste","onion","red bell pepper","garlic","olive oil","chili powder","cumin","smoked paprika","vegetable broth","frozen corn","lime"] },
  { id:"d11", name:"Feta Spaghetti Squash",   tags:["Cozy","Light","Unique"],    desc:"Roasted squash, feta, olives, herby tomatoes",         ingredients:["spaghetti squash","feta cheese","cherry tomatoes","kalamata olives","garlic","olive oil","fresh basil","red pepper flakes","lemon","pine nuts"] },
  { id:"d12", name:"Chickpea Caesar Wraps",   tags:["Quick","Protein","Fresh"],  desc:"Crispy chickpeas, avocado, tahini Caesar",             ingredients:["flour tortillas","chickpeas","romaine lettuce","avocado","cherry tomatoes","olive oil","garlic powder","smoked paprika","tahini","lemon","Dijon mustard","capers"] },
  { id:"d13", name:"Tofu Noodle Stir-Fry",    tags:["Quick","Asian","Protein"],  desc:"Crispy tofu, rice noodles, peanut sauce",              ingredients:["extra firm tofu","rice noodles","red bell pepper","snap peas","carrots","green onions","garlic","ginger","tamari","sesame oil","rice vinegar","sriracha","peanut butter","lime"] },
];

const INSTANT_POT_MEALS = [
  { id:"ip1", name:"Chicken, Potato & Carrot",  desc:"Your weekly staple — simple, filling, reliable",    ingredients:["chicken thighs","potatoes","carrots","onion","chicken broth","garlic","olive oil"] },
  { id:"ip2", name:"Lemon Herb Chicken & Rice",  desc:"Light and bright — chicken breast with white rice", ingredients:["chicken breast","white rice","lemon","garlic","chicken broth","parsley","olive oil"] },
  { id:"ip3", name:"Chicken & Sweet Potato",     desc:"Hearty variation, great for colder weeks",          ingredients:["chicken thighs","sweet potatoes","carrots","onion","chicken broth","smoked paprika","garlic"] },
];

const BREAKFAST_OPTIONS = ["Bananas","Greek Yogurt","Granola","Blueberries","Strawberries","Raspberries","Almond Butter","Oat Milk","Whole Wheat Bread","Eggs","Orange Juice","Honey","Chia Seeds","Oatmeal","Apples","Peanut Butter","Cottage Cheese"];

const STORE_SECTIONS = {
  "Produce":           ["persian cucumbers","avocado","lime","lemon","garlic","ginger","green onions","onion","red onion","cherry tomatoes","carrots","celery","sweet potatoes","bell pepper","red bell pepper","zucchini","snap peas","romaine lettuce","mixed greens","fresh basil","cilantro","parsley","fresh mint","spaghetti squash","bananas","blueberries","strawberries","raspberries","apples","potatoes"],
  "Protein & Tofu":    ["tempeh","extra firm tofu","halloumi cheese","chicken thighs","chicken breast","chickpeas","black beans","kidney beans","red lentils","green lentils","crispy chickpeas"],
  "Dairy & Eggs":      ["feta cheese","cheddar cheese","greek yogurt","parmesan","eggs","cottage cheese"],
  "Pantry & Canned":   ["diced tomatoes","tomato paste","frozen corn","coconut milk","vegetable broth","chicken broth","kalamata olives","capers","tahini","dijon mustard","peanut butter"],
  "Grains & Dry":      ["jasmine rice","basmati rice","white rice","rice noodles","flour tortillas","whole wheat bread","oatmeal","granola"],
  "Oils & Condiments": ["olive oil","sesame oil","tamari","rice vinegar","sriracha","red wine vinegar","honey","curry powder","garam masala","smoked paprika","garlic powder","chili powder","dried oregano","red pepper flakes"],
  "Nuts & Seeds":      ["sesame seeds","pine nuts","walnuts","peanuts","chia seeds","almond butter"],
  "Drinks":            ["oat milk","orange juice"],
};

function categorize(ing) {
  const lower = ing.toLowerCase().replace(/\s*\(.*?\)/g,"").trim();
  for (const [section, items] of Object.entries(STORE_SECTIONS)) {
    if (items.some(i => lower.includes(i) || i.includes(lower.split(" ")[0]))) return section;
  }
  return "Other";
}

function buildList(dinners, lunch, breakfast, snacks, pantryItems) {
  const all = new Set();
  Object.values(dinners).forEach(m => m?.ingredients?.forEach(i => all.add(i)));
  lunch?.ingredients?.forEach(i => all.add(i));
  breakfast.forEach(i => all.add(i));
  snacks.forEach(i => all.add(i));
  const result = {};
  [...all].forEach(ing => {
    const inPantry = pantryItems.some(p => ing.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(ing.toLowerCase().split(" ")[0]));
    if (inPantry) return;
    const cat = categorize(ing);
    if (!result[cat]) result[cat] = [];
    if (!result[cat].find(x => x.toLowerCase() === ing.toLowerCase())) result[cat].push(ing);
  });
  return result;
}

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_FULL = { Mon:"Monday", Tue:"Tuesday", Wed:"Wednesday", Thu:"Thursday", Fri:"Friday", Sat:"Saturday", Sun:"Sunday" };

// ─── DEFAULT STATE ────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  dinners: {},
  lunch: null,
  breakfast: ["Bananas","Greek Yogurt","Granola","Blueberries"],
  snacks: ["Rice cakes","Mixed nuts","Dark chocolate"],
  pantry_staples: ["olive oil","tamari","garlic","cumin","smoked paprika","garlic powder","red pepper flakes"],
  never_list: ["Eggplant","Mushrooms","Broccoli"],
  checked_items: {},
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Sheet({ open, onClose, title, subtitle, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(28,25,22,0.55)",zIndex:300,display:"flex",alignItems:"flex-end",backdropFilter:"blur(2px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:T.bg,borderRadius:"20px 20px 0 0",padding:"0 0 48px",width:"100%",maxWidth:430,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -12px 48px rgba(0,0,0,0.18)" }}>
        <div style={{ padding:"20px 24px 0" }}>
          <div style={{ width:36,height:3,background:T.borderMid,borderRadius:2,margin:"0 auto 22px" }}/>
          {title && <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:T.text,marginBottom:subtitle?4:20 }}>{title}</div>}
          {subtitle && <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:T.textLight,marginBottom:20 }}>{subtitle}</div>}
        </div>
        <div style={{ padding:"0 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, style={} }) {
  return (
    <button onClick={disabled?undefined:onClick} style={{ width:"100%",background:disabled?T.border:T.text,color:disabled?T.textLight:T.bg,border:"none",borderRadius:T.radiusMd,padding:"14px 20px",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,cursor:disabled?"not-allowed":"pointer",letterSpacing:"0.01em",...style }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style={} }) {
  return (
    <button onClick={onClick} style={{ width:"100%",background:"transparent",color:T.text,border:`1.5px solid ${T.border}`,borderRadius:T.radiusMd,padding:"13px 20px",fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:15,cursor:"pointer",...style }}>
      {children}
    </button>
  );
}

function Chip({ label, active, onClick, warn }) {
  return (
    <div onClick={onClick} style={{ display:"inline-flex",alignItems:"center",padding:"5px 12px",borderRadius:T.radius,border:`1px solid ${active?(warn?T.warn:T.accent):T.border}`,background:active?(warn?T.warnBg:T.accentBg):T.surface,color:active?(warn?T.warn:T.accent):T.textMid,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:active?600:400,cursor:"pointer",userSelect:"none" }}>
      {label}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:T.textLight,marginBottom:10,marginTop:28 }}>{children}</div>;
}

function LastMade({ mealId, history }) {
  const entries = history.filter(h=>h.meal_id===mealId).sort((a,b)=>new Date(b.cooked_at)-new Date(a.cooked_at));
  if (!entries.length) return <span style={{ fontSize:11,color:T.textLight,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic" }}>Never made</span>;
  const days = Math.floor((Date.now()-new Date(entries[0].cooked_at))/86400000);
  const label = days===0?"This week":days<7?`${days}d ago`:days<14?"Last week":`${Math.floor(days/7)}w ago`;
  const color = days<7?T.warn:days<21?T.textMid:T.accent;
  return <span style={{ fontSize:11,color,fontFamily:"'DM Sans',sans-serif",fontWeight:500 }}>{label}</span>;
}

function SyncDot({ syncing, error }) {
  const color = error ? T.warn : syncing ? T.gold : T.accent;
  const label = error ? "Sync error" : syncing ? "Saving..." : "Synced";
  return (
    <div style={{ display:"flex",alignItems:"center",gap:5 }}>
      <div style={{ width:6,height:6,borderRadius:"50%",background:color,transition:"background 0.3s" }}/>
      <span style={{ fontSize:10,fontFamily:"'DM Sans',sans-serif",color:T.textLight,letterSpacing:"0.04em" }}>{label}</span>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]             = useState("plan");
  const [appState, setAppState]   = useState(DEFAULT_STATE);
  const [mealHistory, setMealHistory] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [syncing, setSyncing]     = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [genMode, setGenMode]     = useState("smart");
  const [showGen, setShowGen]     = useState(false);
  const [pickDay, setPickDay]     = useState(null);
  const [showLunch, setShowLunch] = useState(false);
  const [showBfast, setShowBfast] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAI, setShowAI]       = useState(false);
  const [newSnack, setNewSnack]   = useState("");
  const [newPantry, setNewPantry] = useState("");
  const [newBfast, setNewBfast]   = useState("");
  const [newNever, setNewNever]   = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText]       = useState(null);
  const [aiError, setAiError]     = useState(null);
  const saveTimer = useRef(null);

  // ── Load from Supabase on mount ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: stateData }, { data: historyData }] = await Promise.all([
        supabase.from("pantry_state").select("*").eq("id","shared").single(),
        supabase.from("pantry_meal_history").select("*").order("cooked_at", { ascending: false }),
      ]);
      if (stateData) {
        setAppState({
          dinners:        stateData.dinners        || {},
          lunch:          stateData.lunch          || null,
          breakfast:      stateData.breakfast      || DEFAULT_STATE.breakfast,
          snacks:         stateData.snacks         || DEFAULT_STATE.snacks,
          pantry_staples: stateData.pantry_staples || DEFAULT_STATE.pantry_staples,
          never_list:     stateData.never_list     || DEFAULT_STATE.never_list,
          checked_items:  stateData.checked_items  || {},
        });
      }
      if (historyData) setMealHistory(historyData);
      setLoading(false);
    };
    load();

    // Real-time subscription — updates when the other person makes changes
    const channel = supabase.channel("pantry-sync")
      .on("postgres_changes", { event:"UPDATE", schema:"public", table:"pantry_state" }, (payload) => {
        const d = payload.new;
        setAppState({
          dinners:        d.dinners        || {},
          lunch:          d.lunch          || null,
          breakfast:      d.breakfast      || DEFAULT_STATE.breakfast,
          snacks:         d.snacks         || DEFAULT_STATE.snacks,
          pantry_staples: d.pantry_staples || DEFAULT_STATE.pantry_staples,
          never_list:     d.never_list     || DEFAULT_STATE.never_list,
          checked_items:  d.checked_items  || {},
        });
      })
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"pantry_meal_history" }, (payload) => {
        setMealHistory(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ── Debounced save to Supabase ──
  const saveState = useCallback((newState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSyncing(true);
    setSyncError(false);
    saveTimer.current = setTimeout(async () => {
      const { error } = await supabase.from("pantry_state").update({
        dinners:        newState.dinners,
        lunch:          newState.lunch,
        breakfast:      newState.breakfast,
        snacks:         newState.snacks,
        pantry_staples: newState.pantry_staples,
        never_list:     newState.never_list,
        checked_items:  newState.checked_items,
        updated_at:     new Date().toISOString(),
      }).eq("id","shared");
      setSyncing(false);
      if (error) setSyncError(true);
    }, 600);
  }, []);

  const update = useCallback((partial) => {
    setAppState(prev => {
      const next = { ...prev, ...partial };
      saveState(next);
      return next;
    });
  }, [saveState]);

  // ── Meal generation ──
  const smartGenerate = () => {
    const recentIds = new Set(mealHistory.filter(h => Date.now()-new Date(h.cooked_at)<14*86400000).map(h=>h.meal_id));
    let pool = DINNER_MEALS.filter(m => !recentIds.has(m.id));
    if (pool.length < 7) {
      pool = [...DINNER_MEALS].sort((a,b) => {
        const aLast = Math.max(0,...mealHistory.filter(h=>h.meal_id===a.id).map(h=>new Date(h.cooked_at)));
        const bLast = Math.max(0,...mealHistory.filter(h=>h.meal_id===b.id).map(h=>new Date(h.cooked_at)));
        return aLast - bLast;
      });
    }
    pool.sort(()=>Math.random()-0.5);
    const result = {};
    DAYS.forEach((day,i) => { result[day] = pool[i % pool.length]; });
    return result;
  };

  const generateWeek = async () => {
    let newDinners = {};
    if (genMode==="smart"||genMode==="mixed") {
      newDinners = smartGenerate();
    } else if (genMode==="faves") {
      const faves = DINNER_MEALS.filter(m=>m.tags.includes("Fave")).sort(()=>Math.random()-0.5);
      DAYS.forEach((day,i)=>{ newDinners[day]=faves[i%faves.length]; });
    } else if (genMode==="overdue") {
      const sorted = [...DINNER_MEALS].sort((a,b)=>{
        const aLast = Math.max(0,...mealHistory.filter(h=>h.meal_id===a.id).map(h=>new Date(h.cooked_at)));
        const bLast = Math.max(0,...mealHistory.filter(h=>h.meal_id===b.id).map(h=>new Date(h.cooked_at)));
        return aLast - bLast;
      });
      DAYS.forEach((day,i)=>{ newDinners[day]=sorted[i%sorted.length]; });
    }
    // Record history
    const historyEntries = Object.values(newDinners).filter(Boolean).map(m => ({ meal_id:m.id, meal_name:m.name }));
    await supabase.from("pantry_meal_history").insert(historyEntries);
    const { data: newHistory } = await supabase.from("pantry_meal_history").select("*").order("cooked_at",{ascending:false});
    if (newHistory) setMealHistory(newHistory);

    update({ dinners:newDinners, lunch: appState.lunch || INSTANT_POT_MEALS[0], checked_items:{} });
    setShowGen(false);
  };

  // ── AI ──
  const getAISuggestion = async () => {
    setAiLoading(true); setAiError(null); setAiText(null); setShowAI(true);
    const recentNames = [...new Set(mealHistory.slice(0,14).map(h=>h.meal_name))];
    const thisWeek = Object.values(appState.dinners).filter(Boolean).map(m=>m.name);
    const allMeals = DINNER_MEALS.map(m=>`${m.name}: ${m.desc}`).join("\n");
    const prompt = `You are a thoughtful meal planning advisor for a couple. Here is their full context:

THEIR DINNER ROTATION:
${allMeals}

RECENTLY EATEN (last 2 weeks): ${recentNames.length?recentNames.join(", "):"Nothing recorded yet"}
THIS WEEK'S PLAN: ${thisWeek.length?thisWeek.join(", "):"Not set yet"}

ABOUT THEM:
- Mostly plant-based, protein-focused every meal
- Primary grocery store is Trader Joe's
- Love: tempeh, tofu, lentils, chickpeas, halloumi, feta cheese
- Never cook with: ${appState.never_list.join(", ")}
- Enjoy: cozy one-pot meals, fresh salads, Asian-inspired, Mediterranean
- Sunday Instant Pot prep for weekday lunches

Please give them:

## This Week's Top Picks
Recommend 3 specific meals from their list they should make this week. For each, give the name and one short sentence explaining why now is the right time.

## Something New to Try
Suggest one brand-new meal not on their list that fits their taste profile. Must be: plant-based, Trader Joe's friendly, protein-rich, no mushrooms/eggplant/broccoli. Give: meal name, one-sentence description, and a short ingredient list.

## Quick Tip
One practical sentence to make their week smoother.

Keep the tone warm and direct. No filler.`;
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json","x-api-key":process.env.REACT_APP_ANTHROPIC_KEY,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:900, messages:[{role:"user",content:prompt}] }),
      });
      const data = await res.json();
      setAiText(data.content?.[0]?.text||"No response.");
    } catch { setAiError("Could not reach the AI. Check your connection and try again."); }
    setAiLoading(false);
  };

  const groceryList  = buildList(appState.dinners, appState.lunch, appState.breakfast, appState.snacks, appState.pantry_staples);
  const totalItems   = Object.values(groceryList).flat().length;
  const checkedCount = Object.values(appState.checked_items).filter(Boolean).length;
  const dinnerCount  = Object.values(appState.dinners).filter(Boolean).length;
  const progress     = totalItems>0?(checkedCount/totalItems)*100:0;

  const historyByWeek = mealHistory.reduce((acc,entry)=>{
    const d=new Date(entry.cooked_at); const ws=new Date(d); ws.setDate(d.getDate()-d.getDay());
    const key=ws.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
    if(!acc[key])acc[key]=[];
    if(!acc[key].find(e=>e.meal_id===entry.meal_id))acc[key].push(entry);
    return acc;
  },{});

  const renderAI = (text) => text.split("\n").map((line,i)=>{
    if(line.startsWith("## ")) return <div key={i} style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:T.text,marginTop:22,marginBottom:8 }}>{line.replace("## ","")}</div>;
    if(line.startsWith("**")&&line.endsWith("**")) return <div key={i} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:T.text,marginTop:10 }}>{line.replace(/\*\*/g,"")}</div>;
    if(line.startsWith("- ")) return <div key={i} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:T.textMid,paddingLeft:14,marginTop:4,lineHeight:1.6,borderLeft:`2px solid ${T.border}`,marginLeft:2 }}>{line.slice(2)}</div>;
    if(!line.trim()) return <div key={i} style={{ height:6 }}/>;
    return <div key={i} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:14,color:T.textMid,lineHeight:1.65,marginTop:4 }}>{line}</div>;
  });

  if (loading) return (
    <div style={{ background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16 }}>
      <div style={{ width:32,height:32,border:`2px solid ${T.border}`,borderTop:`2px solid ${T.accent}`,borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:14,color:T.textLight }}>Loading your pantry...</div>
    </div>
  );

  return (
    <div style={{ background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" }}>

      {/* HEADER */}
      <div style={{ background:T.surface,borderBottom:`1px solid ${T.border}`,ppadding:"18px 24px 14px",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:T.text,lineHeight:1,letterSpacing:"-0.02em" }}>Pantry</div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginTop:4 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:T.textLight,letterSpacing:"0.04em" }}>
                {dinnerCount===7?"Week complete":`${dinnerCount} of 7 dinners planned`}
              </div>
              <SyncDot syncing={syncing} error={syncError}/>
            </div>
          </div>
          <div style={{ display:"flex",gap:8,paddingTop:2 }}>
            <button onClick={()=>setShowHistory(true)} style={{ background:"transparent",border:`1px solid ${T.border}`,borderRadius:T.radiusMd,padding:"7px 11px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:T.textMid,fontWeight:500 }}>History</button>
            <button onClick={getAISuggestion} style={{ background:T.text,border:"none",borderRadius:T.radiusMd,padding:"7px 13px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:T.bg,fontWeight:600 }}>
              {aiLoading?"...":"AI Suggest"}
            </button>
          </div>
        </div>
        <div style={{ display:"flex",gap:4,marginTop:14 }}>
          {DAYS.map(day=>(
            <div key={day} style={{ flex:1,textAlign:"center" }}>
              <div style={{ fontSize:9,fontWeight:600,letterSpacing:"0.08em",color:appState.dinners[day]?T.accent:T.textLight,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",marginBottom:4 }}>{day}</div>
              <div style={{ height:3,borderRadius:2,background:appState.dinners[day]?T.accent:T.border,transition:"background 0.2s" }}/>
            </div>
          ))}
        </div>
      </div>

      <div style={{ paddingBottom:80 }}>

        {/* ══ PLAN */}
        {tab==="plan" && (
          <div style={{ padding:"20px 20px" }}>
            <div style={{ background:T.text,borderRadius:T.radiusLg,padding:"22px",marginBottom:8 }}>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:600,color:T.bg,marginBottom:4 }}>
                {dinnerCount===7?"Week is planned.":"Plan this week."}
              </div>
              <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(247,245,241,0.5)",marginBottom:18 }}>
                {mealHistory.length>0?`${[...new Set(mealHistory.map(h=>h.meal_id))].length} meals tracked across ${Object.keys(historyByWeek).length} weeks`:"Start tracking and the AI gets smarter each week."}
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>setShowGen(true)} style={{ flex:1,background:T.bg,color:T.text,border:"none",borderRadius:T.radiusMd,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,cursor:"pointer" }}>Generate Week</button>
                <button onClick={getAISuggestion} style={{ flex:1,background:"rgba(247,245,241,0.1)",color:T.bg,border:`1px solid rgba(247,245,241,0.2)`,borderRadius:T.radiusMd,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:14,cursor:"pointer" }}>
                  {aiLoading?"...":"Ask AI"}
                </button>
              </div>
            </div>

            <SectionLabel>Breakfast — weekly staples</SectionLabel>
            <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,padding:"14px 16px" }}>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:appState.breakfast.length?12:0 }}>
                {appState.breakfast.map(item=>(
                  <Chip key={item} label={item} active onClick={()=>update({breakfast:appState.breakfast.filter(i=>i!==item)})}/>
                ))}
              </div>
              {appState.breakfast.length===0&&<div style={{ fontSize:13,color:T.textLight,fontStyle:"italic",marginBottom:10 }}>No items selected</div>}
              <button onClick={()=>setShowBfast(true)} style={{ background:"transparent",border:`1px dashed ${T.borderMid}`,borderRadius:T.radius,padding:"7px 14px",color:T.textMid,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,marginTop:4 }}>Edit breakfast list</button>
            </div>

            <SectionLabel>Sunday Instant Pot — lunch prep</SectionLabel>
            {appState.lunch ? (
              <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:600,fontSize:15,color:T.text }}>{appState.lunch.name}</div>
                  <div style={{ fontSize:12,color:T.textLight,marginTop:2 }}>{appState.lunch.desc}</div>
                </div>
                <button onClick={()=>setShowLunch(true)} style={{ background:"transparent",border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"5px 10px",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:T.textMid,flexShrink:0,marginLeft:12 }}>Change</button>
              </div>
            ) : (
              <div onClick={()=>setShowLunch(true)} style={{ background:T.surface,border:`1px dashed ${T.borderMid}`,borderRadius:T.radiusMd,padding:"14px 16px",cursor:"pointer",textAlign:"center",color:T.textMid,fontSize:14 }}>Select this week's Instant Pot meal</div>
            )}

            <SectionLabel>Dinners — 7 nights</SectionLabel>
            {DAYS.map(day=>{
              const meal = appState.dinners[day];
              return (
                <div key={day} onClick={()=>setPickDay(day)} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,padding:"13px 16px",marginBottom:5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                    <div style={{ width:3,height:36,borderRadius:2,background:meal?T.accent:T.border,flexShrink:0 }}/>
                    <div>
                      <div style={{ fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:T.textLight,marginBottom:2 }}>{DAY_FULL[day]}</div>
                      <div style={{ fontWeight:meal?500:400,fontSize:14,color:meal?T.text:T.textLight,fontStyle:meal?"normal":"italic" }}>{meal?.name||"Not planned"}</div>
                    </div>
                  </div>
                  <LastMade mealId={meal?.id} history={mealHistory}/>
                </div>
              );
            })}

            <SectionLabel>Snacks</SectionLabel>
            <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,padding:"14px 16px" }}>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:appState.snacks.length?12:0 }}>
                {appState.snacks.map(item=>(
                  <Chip key={item} label={item} active warn onClick={()=>update({snacks:appState.snacks.filter(i=>i!==item)})}/>
                ))}
              </div>
              <div style={{ display:"flex",gap:8,marginTop:4 }}>
                <input value={newSnack} onChange={e=>setNewSnack(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newSnack.trim()){update({snacks:[...appState.snacks,newSnack.trim()]});setNewSnack("");}}} placeholder="Add a snack..." style={{ flex:1,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"8px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",background:T.bg,outline:"none",color:T.text }}/>
                <button onClick={()=>{if(newSnack.trim()){update({snacks:[...appState.snacks,newSnack.trim()]});setNewSnack("");}}} style={{ background:T.text,color:T.bg,border:"none",borderRadius:T.radius,padding:"8px 14px",cursor:"pointer",fontSize:17 }}>+</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ SHOP */}
        {tab==="shop" && (
          <div style={{ padding:"20px 20px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:6 }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:600,color:T.text }}>Grocery List</div>
                <div style={{ fontSize:12,color:T.textLight,marginTop:2 }}>Trader Joe's · {checkedCount} of {totalItems} checked</div>
              </div>
              {checkedCount>0&&<button onClick={()=>update({checked_items:{}})} style={{ background:"transparent",border:"none",fontSize:12,color:T.textLight,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textDecoration:"underline" }}>Clear checks</button>}
            </div>
            <div style={{ background:T.border,borderRadius:2,height:2,marginBottom:24 }}>
              <div style={{ background:T.accent,height:2,width:`${progress}%`,borderRadius:2,transition:"width 0.4s ease" }}/>
            </div>
            {totalItems===0?(
              <div style={{ textAlign:"center",padding:"60px 20px" }}>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:T.textLight,marginBottom:8 }}>Your list is empty.</div>
                <div style={{ fontSize:13,color:T.textLight,marginBottom:24 }}>Generate a meal plan to get started.</div>
                <GhostBtn onClick={()=>setTab("plan")} style={{ width:"auto",padding:"10px 28px" }}>Go to Plan</GhostBtn>
              </div>
            ):(
              Object.entries(groceryList).sort(([a],[b])=>a.localeCompare(b)).map(([section,items])=>
                items.length>0&&(
                  <div key={section} style={{ marginBottom:28 }}>
                    <div style={{ fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:T.textLight,marginBottom:10 }}>{section}</div>
                    {items.map(item=>{
                      const isChecked = appState.checked_items[item];
                      return (
                        <div key={item} onClick={()=>update({checked_items:{...appState.checked_items,[item]:!isChecked}})} style={{ display:"flex",alignItems:"center",gap:13,background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radiusMd,padding:"12px 14px",marginBottom:5,cursor:"pointer",opacity:isChecked?0.35:1,transition:"opacity 0.2s" }}>
                          <div style={{ width:18,height:18,borderRadius:"50%",border:`1.5px solid ${isChecked?T.accent:T.borderMid}`,background:isChecked?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s" }}>
                            {isChecked&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <span style={{ fontSize:14,textDecoration:isChecked?"line-through":"none",color:isChecked?T.textLight:T.text }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )
              )
            )}
          </div>
        )}

        {/* ══ PANTRY */}
        {tab==="pantry" && (
          <div style={{ padding:"20px 20px" }}>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:600,color:T.text,marginBottom:4 }}>Pantry Staples</div>
            <div style={{ fontSize:13,color:T.textLight,marginBottom:20 }}>These items are excluded from your grocery list.</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginBottom:14 }}>
              {appState.pantry_staples.map(item=>(
                <div key={item} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"6px 12px",fontSize:13,display:"flex",alignItems:"center",gap:7,color:T.textMid }}>
                  {item}<span onClick={()=>update({pantry_staples:appState.pantry_staples.filter(i=>i!==item)})} style={{ color:T.textLight,cursor:"pointer",fontSize:16,lineHeight:1 }}>×</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:8,marginBottom:32 }}>
              <input value={newPantry} onChange={e=>setNewPantry(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newPantry.trim()){update({pantry_staples:[...appState.pantry_staples,newPantry.trim()]});setNewPantry("");}}} placeholder="Add a staple..." style={{ flex:1,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"9px 12px",fontSize:13,background:T.surface,outline:"none",color:T.text,fontFamily:"'DM Sans',sans-serif" }}/>
              <button onClick={()=>{if(newPantry.trim()){update({pantry_staples:[...appState.pantry_staples,newPantry.trim()]});setNewPantry("");}}} style={{ background:T.text,color:T.bg,border:"none",borderRadius:T.radius,padding:"9px 15px",cursor:"pointer",fontSize:17 }}>+</button>
            </div>

            <div style={{ height:1,background:T.border,marginBottom:24 }}/>

            <div style={{ fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:T.textLight,marginBottom:4 }}>Never in your meals</div>
            <div style={{ fontSize:12,color:T.textLight,marginBottom:12 }}>These ingredients will never appear in meal suggestions.</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginBottom:12 }}>
              {appState.never_list.map(item=>(
                <div key={item} style={{ background:T.warnBg,border:`1px solid ${T.warn}`,borderRadius:T.radius,padding:"6px 12px",fontSize:13,display:"flex",alignItems:"center",gap:7,color:T.warn }}>
                  {item}<span onClick={()=>update({never_list:appState.never_list.filter(i=>i!==item)})} style={{ cursor:"pointer",fontSize:16,lineHeight:1,opacity:0.6 }}>×</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <input value={newNever} onChange={e=>setNewNever(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newNever.trim()){update({never_list:[...appState.never_list,newNever.trim()]});setNewNever("");}}} placeholder="Add an ingredient to avoid..." style={{ flex:1,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"9px 12px",fontSize:13,background:T.surface,outline:"none",color:T.text,fontFamily:"'DM Sans',sans-serif" }}/>
              <button onClick={()=>{if(newNever.trim()){update({never_list:[...appState.never_list,newNever.trim()]});setNewNever("");}}} style={{ background:T.text,color:T.bg,border:"none",borderRadius:T.radius,padding:"9px 15px",cursor:"pointer",fontSize:17 }}>+</button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",padding:"12px 0 28px",zIndex:100,boxShadow:"0 -4px 20px rgba(0,0,0,0.06)" }}>
        {[["plan","Plan"],["shop","Shop"],["pantry","Pantry"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5 }}>
            <div style={{ width:24,height:2,borderRadius:1,background:tab===id?T.text:"transparent",transition:"background 0.2s" }}/>
            <div style={{ fontSize:12,fontWeight:tab===id?600:400,color:tab===id?T.text:T.textLight,letterSpacing:"0.03em" }}>{label}</div>
          </button>
        ))}
      </div>

      {/* ══ MODALS */}

      <Sheet open={showGen} onClose={()=>setShowGen(false)} title="How should we plan dinners?" subtitle="Choose a generation strategy for this week.">
        {[
          {id:"smart",  label:"Smart Rotation", desc:"Avoids recent meals, surfaces what is overdue"},
          {id:"faves",  label:"Favorites Only",  desc:"Only draws from your starred meals"},
          {id:"overdue",label:"Least Recent",    desc:"Strictly prioritizes meals not made in longest"},
          {id:"mixed",  label:"Random Mix",      desc:"Light rotation awareness with more variety"},
          {id:"manual", label:"Choose Manually", desc:"You pick each dinner yourself"},
        ].map(m=>(
          <div key={m.id} onClick={()=>setGenMode(m.id)} style={{ background:genMode===m.id?T.accentBg:T.surface,border:`1px solid ${genMode===m.id?T.accent:T.border}`,borderRadius:T.radiusMd,padding:"13px 15px",marginBottom:8,cursor:"pointer" }}>
            <div style={{ fontWeight:600,fontSize:14,color:genMode===m.id?T.accent:T.text }}>{m.label}</div>
            <div style={{ fontSize:12,color:T.textLight,marginTop:2 }}>{m.desc}</div>
          </div>
        ))}
        <div style={{ marginTop:14 }}><PrimaryBtn onClick={generateWeek}>{genMode==="manual"?"Go to meal plan":"Generate this week"}</PrimaryBtn></div>
      </Sheet>

      <Sheet open={!!pickDay} onClose={()=>setPickDay(null)} title={pickDay?DAY_FULL[pickDay]:""} subtitle="Select a dinner for this evening.">
        {DINNER_MEALS.map(meal=>{
          const active = appState.dinners[pickDay]?.id===meal.id;
          return (
            <div key={meal.id} onClick={async()=>{ update({dinners:{...appState.dinners,[pickDay]:meal},checked_items:{}}); await supabase.from("pantry_meal_history").insert([{meal_id:meal.id,meal_name:meal.name}]); const {data:h}=await supabase.from("pantry_meal_history").select("*").order("cooked_at",{ascending:false}); if(h)setMealHistory(h); setPickDay(null); }} style={{ background:active?T.accentBg:T.surface,border:`1px solid ${active?T.accent:T.border}`,borderRadius:T.radiusMd,padding:"12px 14px",marginBottom:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontWeight:500,fontSize:14,color:T.text }}>{meal.name}</div>
                <div style={{ fontSize:12,color:T.textLight,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{meal.desc}</div>
              </div>
              <LastMade mealId={meal.id} history={mealHistory}/>
            </div>
          );
        })}
      </Sheet>

      <Sheet open={showLunch} onClose={()=>setShowLunch(false)} title="Instant Pot Prep" subtitle="One batch meal for the full week of lunches.">
        {INSTANT_POT_MEALS.map(meal=>{
          const active = appState.lunch?.id===meal.id;
          return (
            <div key={meal.id} onClick={()=>{update({lunch:meal});setShowLunch(false);}} style={{ background:active?T.accentBg:T.surface,border:`1px solid ${active?T.accent:T.border}`,borderRadius:T.radiusMd,padding:"14px 16px",marginBottom:8,cursor:"pointer" }}>
              <div style={{ fontWeight:600,fontSize:15,color:active?T.accent:T.text }}>{meal.name}</div>
              <div style={{ fontSize:12,color:T.textLight,marginTop:3 }}>{meal.desc}</div>
            </div>
          );
        })}
      </Sheet>

      <Sheet open={showBfast} onClose={()=>setShowBfast(false)} title="Breakfast Ingredients" subtitle="Select from the list or add your own.">
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:20 }}>
          {[...new Set([...BREAKFAST_OPTIONS,...appState.breakfast.filter(b=>!BREAKFAST_OPTIONS.includes(b))])].map(item=>{
            const sel = appState.breakfast.includes(item);
            return <Chip key={item} label={item} active={sel} onClick={()=>update({breakfast:sel?appState.breakfast.filter(i=>i!==item):[...appState.breakfast,item]})}/>;
          })}
        </div>
        <div style={{ height:1,background:T.border,marginBottom:16 }}/>
        <div style={{ fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:T.textLight,marginBottom:10 }}>Add a custom item</div>
        <div style={{ display:"flex",gap:8,marginBottom:20 }}>
          <input value={newBfast} onChange={e=>setNewBfast(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newBfast.trim()){const v=newBfast.trim();if(!appState.breakfast.includes(v))update({breakfast:[...appState.breakfast,v]});setNewBfast("");}}} placeholder="e.g. Protein powder, Açaí..." style={{ flex:1,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"9px 12px",fontSize:13,background:T.bg,outline:"none",color:T.text,fontFamily:"'DM Sans',sans-serif" }}/>
          <button onClick={()=>{const v=newBfast.trim();if(v&&!appState.breakfast.includes(v))update({breakfast:[...appState.breakfast,v]});setNewBfast("");}} style={{ background:T.text,color:T.bg,border:"none",borderRadius:T.radius,padding:"9px 15px",cursor:"pointer",fontSize:17 }}>+</button>
        </div>
        <PrimaryBtn onClick={()=>{setShowBfast(false);setNewBfast("");}}>Done</PrimaryBtn>
      </Sheet>

      <Sheet open={showHistory} onClose={()=>setShowHistory(false)} title="Meal History" subtitle="What you have cooked, week by week.">
        {Object.keys(historyByWeek).length===0?(
          <div style={{ textAlign:"center",padding:"30px 0" }}>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,color:T.textLight }}>No history yet.</div>
            <div style={{ fontSize:13,color:T.textLight,marginTop:6 }}>Generate your first week to start tracking.</div>
          </div>
        ):(
          Object.entries(historyByWeek).reverse().map(([weekLabel,entries])=>(
            <div key={weekLabel} style={{ marginBottom:22 }}>
              <div style={{ fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:T.textLight,marginBottom:9 }}>Week of {weekLabel}</div>
              {entries.map(e=>(
                <div key={e.id} style={{ fontSize:14,color:T.textMid,padding:"7px 0",borderBottom:`1px solid ${T.border}` }}>{e.meal_name}</div>
              ))}
            </div>
          ))
        )}
        {mealHistory.length>0&&(
          <div style={{ marginTop:20 }}>
            <GhostBtn onClick={async()=>{ if(window.confirm("Clear all meal history?")){ await supabase.from("pantry_meal_history").delete().neq("id","00000000-0000-0000-0000-000000000000"); setMealHistory([]); setShowHistory(false); }}}>Clear all history</GhostBtn>
          </div>
        )}
      </Sheet>

      <Sheet open={showAI} onClose={()=>setShowAI(false)} title="AI Meal Advisor" subtitle="Personalized suggestions based on your history and preferences.">
        {aiLoading&&(
          <div style={{ textAlign:"center",padding:"40px 0" }}>
            <div style={{ width:28,height:28,border:`2px solid ${T.border}`,borderTop:`2px solid ${T.accent}`,borderRadius:"50%",margin:"0 auto 16px",animation:"spin 0.8s linear infinite" }}/>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            <div style={{ fontSize:13,color:T.textLight }}>Reviewing your history and preferences...</div>
          </div>
        )}
        {aiError&&(
          <div style={{ background:T.warnBg,border:`1px solid ${T.warn}`,borderRadius:T.radiusMd,padding:"14px 16px",color:T.warn,fontSize:13,marginBottom:16 }}>
            {aiError}
            <div style={{ marginTop:12 }}><PrimaryBtn onClick={getAISuggestion}>Try again</PrimaryBtn></div>
          </div>
        )}
        {aiText&&!aiLoading&&(
          <div>
            <div style={{ borderLeft:`3px solid ${T.accent}`,paddingLeft:16,marginBottom:20 }}>{renderAI(aiText)}</div>
            <GhostBtn onClick={getAISuggestion}>Ask again</GhostBtn>
          </div>
        )}
      </Sheet>
    </div>
  );
}
