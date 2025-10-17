//API a TVMaze
const API="https://api.tvmaze.com"

//Elementos del DOM
const rowsContainer=document.getElementById("rowsContainer")
const hero=document.getElementById("hero")
const heroTitle=document.getElementById("heroTitle")
const heroDesc=document.getElementById("heroDesc")
const heroPlay=document.getElementById("heroPlay")


const init=async()=>{
    const trending=await fetchJSON(`${API}/shows?page=1`)
    renderHero(trending[Math.floor(Math.random()*trending.length)])
    renderRow("Tendencias", trending.slice(0,20))
    wireSearch()
    console.log("@@@ trending=>",trending)
}
const wireSearch=()=>{
    const form=document.getElementById("searchForm")
    const input=document.getElementById("searchInput")
    form.addEventListener("submit",async(e)=>{
        e.preventDefault()
        const movie=input.value.trim()
        if(!movie){
            return
        }
        const results=await fetchJSON(`${API}/search/shows?q=${encodeURIComponent(movie)}`)
        const shows=results.map(r=>r.show)
        rowsContainer.innerHTML=""
        renderRow(`Resultados para ${movie}`, shows)
    })
}
const renderRow=(title,shows)=>{
    const section=document.createElement("section")
    section.classList="mb-3"
    section.innerHTML=
    `
    <h3 class="rowTitle">${title}</h3>
    <div class="rail" data-rail></div>
    `
    const rail=section.querySelector("[data-rail")
    shows.forEach((show)=>{
        rail.appendChild(posterCard(show))
    })

    rowsContainer.appendChild(section)
}

const posterCard=show=>{
     const card=document.createElement("div")
     card.className="card card-poster"
     const img=show?.image?.medium||"https://placehold.co/600x400?text=Sin+Imagen"

     card.innerHTML=
     `
        <img class="card-img-top" src="${img}">
        <div class="card-body p-2">
            <div class="small text-secondary">
                ${(show.genres||[]).slice(0,2).join(" | ")}
            </div>
            <div class="fw-semibold>
                ${escapeHTML(show.name)}
            </div>
        </div>
     `
     card.addEventListener("click",()=>openDetail(show.id))
     return card
}
const escapeHTML=s=>{
    return (s||"").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

const fetchJSON=async(url)=>{
    const res=await fetch(url)
    if(!res.ok){
        throw new Error("Error al cargar datos: ", url)
    }
    return await res.json()
}

const renderHero=show=>{
    if(!show){
        return
    }
    const bg=show?.image?.original|| show?.image?.medium||"https://placehold.co/600x400?text=Sin+Imagen"

    hero.style.backgroundImage=bg?`url(${bg})`:"none"
    heroTitle.textContent=show.name||""
    heroDesc.innerHTML=stripHTML(show?.summary||"").slice(0,200)+"..."
    heroPlay.onclick=()=>openDetail(show.id)
}
const stripHTML=html=>
    { 
        return (html||"").replace(/<[^>]*>/g,""); 
    }

const openDetail=async(id)=>{
    const modalEl=document.getElementById("detailModal")
    const modalBody=document.getElementById("detailBody")
    const modalTitle=document.getElementById("detailTitle")
    modalTitle.textContent="Cargando..."
    modalBody.textContent="Cargando"
    const modal= bootstrap.Modal.getOrCreateInstance(modalEl)
    const show=await fetchJSON(`${API}/shows/${id}`)
    modalTitle.textContent=show.name
    modalBody.innerHTML=
    `
        <div class="row g-4">
            <div class="col-md-4">
                <img class="img-fluid rounded" src="${show?.image?.original|| show?.image?.medium||"https://placehold.co/600x400?text=Sin+Imagen"}" />
            </div>
            <div class="col-md-8">
                <div class="mb-2">
                    ${show.genres.map(g=>`<span class="badge badge-genre me-1">${g}</span>`).join("")}
                </div>
                <p class="text-secondary small">
                  ${show.summary||"Sin Sinopsis"}
                </p>
                <p class="text-secondary small">
                    ⭐ ${show?.rating?.average??"N/A"} ° Lenguaje: ${show?.language??"N/A"} ° Status: ${show?.status??"N/A"}
                </p>
                <a class="btn btn-outline-light me-2" href="${show?.officialSite||show?.url}}" target="_blank" rel="noopener>
                    Web Site
                </a>
            </div>
        </div>
    `
    modal.show()
}

init()