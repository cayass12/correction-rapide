let mode="naturel";
const text=document.getElementById("text"), answer=document.getElementById("answer"), result=document.getElementById("result");
document.querySelectorAll(".modeBtn").forEach(b=>b.onclick=()=>{document.querySelectorAll(".modeBtn").forEach(x=>x.classList.remove("active"));b.classList.add("active");mode=b.dataset.mode});
function localCorrect(s){
  s=s.trim(); if(!s)return "";
  let t=s;
  const rules=[
    [/^je connais pas\b/i,"Je ne connais pas"],
    [/^j connais pas\b/i,"Je ne connais pas"],
    [/^je sais pas\b/i,"Je ne sais pas"],
    [/^j sais pas\b/i,"Je ne sais pas"],
    [/^je suis réveillé\b/i,"Je suis réveillé"],
    [/^j'ai dormi tard\b/i,"Je me suis endormi tard"],
    [/^j me suis endormi\b/i,"Je me suis endormi"],
    [/essaie de rendormir/gi,"essaie de me rendormir"],
    [/cette heure ci/gi,"cette heure-ci"],
    [/à cette heure ci/gi,"à cette heure-ci"],
    [/^tu te bronze\b/i,"Tu te bronzes"],
    [/^tes commencé\b/i,"T’as commencé"],
    [/^tes enfants ils\b/i,"Tes enfants"],
    [/^ca\b/gi,"Ça"]
  ];
  for(const [a,b] of rules)t=t.replace(a,b);
  if(mode==="correct"){
    t=t.replace(/\bpk\b/gi,"pourquoi").replace(/\bj\b/gi,"je");
    if(!/^je ne connais pas/i.test(t)) t=t.replace(/\bpas\b/gi,"pas");
  }
  t=t.charAt(0).toUpperCase()+t.slice(1);
  if(!/[.!?]$/.test(t)) t+=".";
  return t;
}
document.getElementById("correct").onclick=()=>{
  const v=text.value.trim(); if(!v)return;
  answer.textContent=localCorrect(v); result.classList.remove("hidden");
};
document.getElementById("copy").onclick=async()=>{
  await navigator.clipboard.writeText(answer.textContent);
  document.getElementById("copy").textContent="✓ Copié";
  setTimeout(()=>document.getElementById("copy").textContent="📋 Copier",1200);
};
const mic=document.getElementById("mic");
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){
  const rec=new SR(); rec.lang="fr-FR"; rec.interimResults=false;
  rec.onstart=()=>mic.textContent="⏺️ Écoute…";
  rec.onend=()=>mic.textContent="🎤 Parler";
  rec.onerror=()=>mic.textContent="🎤 Parler";
  rec.onresult=e=>{text.value+=(text.value?" ":"")+e.results[0][0].transcript};
  mic.onclick=()=>rec.start();
}else{mic.disabled=true;mic.textContent="🎤 Micro non disponible";}
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
