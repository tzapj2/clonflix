// api a tvmaze
const API="https://api.tvmaze.com";

//elementos del DOM
const rowscontainer=document.getElementById("rowscontainer");
const hero = document.getElementById("hero");
const heroTitle=document.getElementById("heroTitle");
const heroDesc=document.getElementById("heroDesc");
const heroplay=document.getElementById("heroplay");

const init =async () => {
const trending=await fetchJSON(`${API}/shows?page=1`)
console("@@@trending =>", trending);
}


const renderRow = (title, shows) => {
    const section=document.createElement("section")
    section.classList = "mb-3"
    section.innerHTML=`
    <h3 class="rowTitle"> $(title)</h3>
    <div class="rail" data-rail></div>
    `
    
}
const fetchJSON= async (url) => {
    const response=await fetch(url);
    if (response.ok){
        throw new Error("Error en la llamada a la API", url);
    }
    return await response.json();
}

init()