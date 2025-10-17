- # HTML
## Hubo correciones de los elementos que fallaban y no se veian en el modal de detalles de la pelicula.
```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>beauty by evelyn</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="./css/app.css">
  </head>
  <body>
    <nav class="navbar navbar-expand-lg border-bottom bg-black">
        <div class="container">
            <a href="#" class="navbar-brand">
                <b>Films "La marmota Hernandez"</b>
            </a>
            <form id="searchForm" class="d-flex ms-auto">
                <input id="searchInput" type="text" class="form-control me-2" placeholder="Buscar Un Titulo">
                <button type="submit" class="btn btn-info">Buscar</button>
            </form>
        </div>
    </nav>
    <header id="hero" class="hero bg-black">
        <div class="container">
            <h1 id="heroTitle" class="display-5 fw-bold"></h1>
            <p id="heroDesc" class="lead col-lg-6"></p>
            <button id="heroPlay" class="btn btn-info btn-lg">Ver ahora</button>
        </div>
    </header>
    <main id="rowsContainer" class="container my-4">
        
    </main>
    <footer class="footer-py-4 mt-5">
        <div class="container small">Hecho con asifor 🥑👄🥑</div>
    </footer>

    <!--Modal para el detalle de la pelicula-->
    <div id="detailModal" class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content bg-black text-light">
                <div class="modal-header border-secondary">
                    <h5 id="detailTitle"class="modal-title">Detalles</h5>
                    <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                    <div id="detailBody" class="modal-body">
                        Cargando...
                    </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="./js/app.js"></script>
    
  </body>
</html>
```

- # CSS
## SIN CAMBIOS

- # JS
```
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
```
- ⬅️[Version1](version1.md)
- 🏠[Principal](README.md)

version2.md