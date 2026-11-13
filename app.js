const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const KEY = "forgotten-world-studio-v01";
let state = {projectName:"THE FORGOTTEN WORLD",projectSubtitle:"PART 1 — THE CALL OF THE UNKNOWN",projectFormat:"16:9 Cinematic",scenes:[],characters:[],selectedScene:null};
let pendingImage = null;
function uid(){return Math.random().toString(36).slice(2,10)}
function save(){state.projectName=$("#projectName").value;state.projectSubtitle=$("#projectSubtitle").value;state.projectFormat=$("#projectFormat").value;try{localStorage.setItem(KEY,JSON.stringify(state));$("#saveStatus").textContent="Saved in this browser"}catch(e){$("#saveStatus").textContent="Storage full — export a backup"}}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s)state={...state,...s}}catch(e){}}
function renderScenes(){
 $("#sceneCount").textContent=state.scenes.length;
 $("#sceneList").innerHTML=state.scenes.length?state.scenes.map(s=>`<div class="scene-item ${s.id===state.selectedScene?'active':''}" data-id="${s.id}"><strong>${esc(s.title)}</strong><small>${esc(s.duration||"10 seconds")}</small></div>`).join(""):'<div class="empty">No scenes yet. Add your first scene.</div>';
 $$("#sceneList [data-id]").forEach(el=>el.onclick=()=>{state.selectedScene=el.dataset.id;renderScenes();save()});
 const s=state.scenes.find(x=>x.id===state.selectedScene);
 if(!s){$("#sceneEditor").innerHTML='<div class="empty">Select a scene or add a new one to begin.</div>';return}
 $("#sceneEditor").innerHTML=`<div class="eyebrow">SCENE DETAILS</div><h3>${esc(s.title)}</h3><label>SCENE TITLE</label><input id="editTitle" value="${attr(s.title)}"><div class="form-grid"><div><label>DURATION</label><select id="editDuration">${["5 seconds","10 seconds","15 seconds","30 seconds","60 seconds"].map(x=>`<option ${s.duration===x?'selected':''}>${x}</option>`).join("")}</select></div><div><label>STATUS</label><select id="editStatus">${["Planning","Prompt ready","Generated","Edited","Approved"].map(x=>`<option ${s.status===x?'selected':''}>${x}</option>`).join("")}</select></div></div><label>SCENE DESCRIPTION</label><textarea id="editDescription" rows="5" placeholder="What happens in this scene?">${esc(s.description||"")}</textarea><label>SHOT / CAMERA NOTES</label><textarea id="editShots" rows="4" placeholder="Camera angle, movement, lighting, colour and sound...">${esc(s.shots||"")}</textarea><div class="editor-actions"><button class="btn primary" id="saveScene">Save scene</button><button class="btn ghost" id="makeScenePrompt">Open in Prompt Studio</button><button class="btn ghost" id="deleteScene">Delete scene</button></div>`;
 $("#saveScene").onclick=()=>{s.title=$("#editTitle").value.trim()||"Untitled scene";s.duration=$("#editDuration").value;s.status=$("#editStatus").value;s.description=$("#editDescription").value;s.shots=$("#editShots").value;renderScenes();save()};
 $("#makeScenePrompt").onclick=()=>{$("#promptScene").value=[s.title,s.description,s.shots].filter(Boolean).join("\\n");showTab("prompts")};
 $("#deleteScene").onclick=()=>{if(confirm("Delete this scene?")){state.scenes=state.scenes.filter(x=>x.id!==s.id);state.selectedScene=state.scenes[0]?.id||null;renderScenes();save()}};
}
function renderCharacters(){
 $("#characterGrid").innerHTML=state.characters.length?state.characters.map(c=>`<article class="panel character-card">${c.image?`<img src="${c.image}" alt="${attr(c.name)} reference">`:'<div class="empty">No reference image</div>'}<div class="card-body"><h3>${esc(c.name)}</h3><small>${esc(c.type)}</small><p>${esc(c.description||"No design notes yet.")}</p></div><button class="btn ghost" data-delete-char="${c.id}">Remove character</button></article>`).join(""):'<div class="empty">Your character vault is empty. Add AADI, TARA and your other approved designs.</div>';
 $$("[data-delete-char]").forEach(b=>b.onclick=()=>{state.characters=state.characters.filter(c=>c.id!==b.dataset.deleteChar);renderCharacters();save()});
}
function showTab(name){$$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));$$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function attr(v=""){return esc(v).replace(/`/g,"&#96;")}
function buildPrompt(){
 const brief=$("#promptScene").value.trim();if(!brief){alert("Add a scene description first.");return}
 const duration=$("#promptDuration").value,camera=$("#promptCamera").value;
 $("#promptOutput").value=`Create a ${duration} cinematic shot for ${$("#projectName").value || "the film"}.

SCENE:
${brief}

CAMERA:
${camera}. Use smooth, physically plausible camera movement. Keep the main subject clearly visible and in focus.

VISUAL DIRECTION:
High-detail cinematic 3D CGI, realistic materials and anatomy, detailed environmental textures, natural motion, believable scale and professional film composition.

LIGHTING & COLOUR:
Consistent motivated lighting, natural shadows, controlled highlights and a coherent colour grade that matches adjacent shots.

CONTINUITY:
Preserve the exact approved character designs, markings, proportions, environment geography, time of day and direction of light from the reference images and neighbouring shots. Avoid redesigning characters.

QUALITY:
Prioritise sharp subject detail, stable anatomy, coherent motion and clean frames. Avoid blur, flicker, distorted limbs, changing markings, random objects, text, logos and watermarks.

AUDIO NOTES:
Add narration, music and sound effects separately during editing unless the video model explicitly supports reliable audio generation.`;
}
function exportJSON(){save();const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});download(blob,"forgotten-world-project.json")}
function download(blob,name){const a=document.createElement("a");const url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$$(".tab").forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
$("#addScene").onclick=()=>{const n=state.scenes.length+1;const s={id:uid(),title:`Scene ${String(n).padStart(2,"0")} — New Scene`,duration:"10 seconds",status:"Planning",description:"",shots:""};state.scenes.push(s);state.selectedScene=s.id;renderScenes();save()};
["projectName","projectSubtitle","projectFormat"].forEach(id=>$("#"+id).addEventListener("change",save));
$("#characterImage").onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>5*1024*1024){alert("Please use an image under 5 MB for this starter.");e.target.value="";return}const r=new FileReader();r.onload=()=>pendingImage=r.result;r.readAsDataURL(f)};
$("#characterForm").onsubmit=e=>{e.preventDefault();const name=$("#characterName").value.trim();if(!name)return;state.characters.push({id:uid(),name,type:$("#characterType").value,description:$("#characterDescription").value,image:pendingImage});e.target.reset();pendingImage=null;renderCharacters();save()};
$("#buildPrompt").onclick=buildPrompt;
$("#copyPrompt").onclick=async()=>{if(!$("#promptOutput").value)return;try{await navigator.clipboard.writeText($("#promptOutput").value);$("#copyPrompt").textContent="Copied!"}catch(e){$("#promptOutput").select();document.execCommand("copy");$("#copyPrompt").textContent="Copied!"}setTimeout(()=>$("#copyPrompt").textContent="Copy prompt",1600)};
$("#exportProject").onclick=exportJSON;
$("#importProject").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const imported=JSON.parse(r.result);if(!Array.isArray(imported.scenes)||!Array.isArray(imported.characters))throw Error();state={...state,...imported};hydrate();alert("Project imported.")}catch(err){alert("This file is not a valid Forgotten World Studio project.")}};r.readAsText(f);e.target.value=""};
function hydrate(){$("#projectName").value=state.projectName;$("#projectSubtitle").value=state.projectSubtitle;$("#projectFormat").value=state.projectFormat;renderScenes();renderCharacters();save()}
load();hydrate();
