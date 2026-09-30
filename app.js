const products=[["Essential Tee","T-Shirt","Clean everyday canvas for custom printing."],["Heavyweight Oversized","T-Shirt","Premium streetwear silhouette."],["Signature Hoodie","Hoodie","Substantial layer for event crews."],["Structured Cap","Cap","Classic headwear for logos and teams."],["Premium Sweatshirt","Sweater","Heavyweight option for cooler events."],["Performance Tee","T-Shirt","Lightweight option for active events."],["Event Polo","Polo","Polished option for corporate teams."],["Canvas Tote","Accessories","Branded conference merchandise."]];
const grid=document.getElementById("products");
grid.innerHTML=products.map(p=>'<article class="product"><div class="product-image"><div class="product-shape"></div></div><div class="product-info"><h3>'+p[0]+'</h3><p>'+p[1]+' · '+p[2]+'</p><a href="#bulk">Customize product →</a></div></article>').join("");
function search(q){q=q.toLowerCase().trim();const r=document.getElementById("results");if(!q){r.innerHTML="";return}const m=products.filter(p=>p.join(" ").toLowerCase().includes(q));r.innerHTML=(m.length?m:products.slice(0,4)).map(p=>'<div class="result"><b>'+p[0]+'</b><br><small>'+p[1]+' · '+p[2]+'</small><br><a href="#bulk">Customize →</a></div>').join("")}
document.getElementById("search").onclick=()=>search(document.getElementById("q").value);
document.getElementById("q").onkeydown=e=>{if(e.key==="Enter")search(e.target.value)};
document.querySelectorAll("[data-modal]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.modal).classList.add("open"));
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>b.closest(".modal").classList.remove("open"));

const promptEl=document.getElementById("prompt"),styleEl=document.getElementById("style"),garmentEl=document.getElementById("garment"),colorEl=document.getElementById("garmentColor"),placementEl=document.getElementById("placement"),mock=document.getElementById("mockupGarment"),print=document.getElementById("mockupPrint"),status=document.getElementById("designStatus"),result=document.getElementById("aiResult"),label=document.getElementById("mockupLabel"),imageEl=document.getElementById("generatedImage"),approveEl=document.getElementById("approveDesign"),orderEl=document.getElementById("orderPanel");
let currentView="front",generatedImage="";
function updateMock(view=currentView){currentView=view;const p=promptEl.value.trim(),style=styleEl.value,color=colorEl.value,placement=placementEl.value;mock.style.backgroundColor=color;print.innerHTML=p?(p.split(" ").slice(0,5).join(" ").toUpperCase()+'<small>'+style.toUpperCase()+'</small>'):"TOJO<small>YOUR VISION</small>";label.textContent="AI PREVIEW / "+view.toUpperCase();if(view==="back")print.innerHTML=p?"EVENT / BACK<small>"+style.toUpperCase()+"</small>":"TOJO<small>BACK DESIGN</small>";if(view==="flat")mock.style.transform="scale(.86)";else mock.style.transform="scale(1)";if(placement==="Small chest")print.style.transform="translate(-35px,-35px) scale(.55)";else print.style.transform="none"}
updateMock();

async function generateRealDesign(){
 const p=promptEl.value.trim();
 if(!p){status.textContent="NEEDS A BRIEF";result.innerHTML="<p>Please describe your idea first.</p>";return}
 const button=document.getElementById("generate");button.disabled=true;button.textContent="Generating…";status.textContent="CREATING MOCKUP";result.innerHTML="<p>TOJO AI is turning your description into a realistic apparel concept. This can take a little while.</p>";imageEl.classList.remove("visible");approveEl.disabled=true;
 try{
  const response=await fetch("/api/generate-design",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:p,style:styleEl.value,garment:garmentEl.value,color:colorEl.options[colorEl.selectedIndex].text,placement:placementEl.value})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"Generation failed");
  generatedImage="data:image/png;base64,"+data.image;imageEl.src=generatedImage;imageEl.classList.add("visible");mock.style.display="none";status.textContent="MOCKUP READY";result.innerHTML="<p><strong>AI mockup ready.</strong><br>Review the generated garment below. If you want changes, edit your brief and generate again.</p>";approveEl.disabled=false;
 }catch(error){status.textContent="GENERATION ERROR";result.innerHTML="<p><strong>We couldn't generate the mockup.</strong><br>"+error.message+"</p>"
 }finally{button.disabled=false;button.textContent="Generate AI mockup"}
}
document.getElementById("generate").onclick=generateRealDesign;
[promptEl,styleEl,garmentEl,colorEl,placementEl].forEach(el=>el.addEventListener("input",()=>{if(!generatedImage)updateMock()}));
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-view]").forEach(x=>x.classList.remove("active"));b.classList.add("active");updateMock(b.dataset.view)});
approveEl.onclick=()=>{if(!generatedImage)return;orderEl.classList.add("ready");orderEl.scrollIntoView({behavior:"smooth",block:"center"})};
document.getElementById("resetDesign").onclick=()=>{promptEl.value="";styleEl.selectedIndex=0;garmentEl.selectedIndex=0;colorEl.selectedIndex=0;placementEl.selectedIndex=0;result.innerHTML="";status.textContent="READY";generatedImage="";imageEl.src="";imageEl.classList.remove("visible");mock.style.display="grid";approveEl.disabled=true;orderEl.classList.remove("ready");updateMock()};
document.getElementById("quantity").oninput=e=>{const q=Math.max(1,Number(e.target.value)||1);document.getElementById("quantityValue").textContent=q.toLocaleString()};
document.getElementById("proceedOrder").onclick=()=>{if(!generatedImage){alert("Generate and approve a design first.");return}alert("Your approved TOJO design is ready for the next step. Quantity, payment and delivery checkout will be connected next.")};
document.getElementById("form").onsubmit=e=>{e.preventDefault();alert("Your TOJO project brief has been captured in this prototype.");document.getElementById("quoteModal").classList.remove("open")};
document.querySelectorAll(".events button").forEach(b=>b.onclick=()=>{document.getElementById("q").value=b.textContent+" merchandise";search(b.textContent);document.querySelector(".search").scrollIntoView({behavior:"smooth"})});