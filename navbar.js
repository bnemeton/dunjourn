class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<nav class="navbar"> 
            <a href="/">home</a>
            /
                        <a href="/dunjourn/about.html">about</a>
                    
                    
                  /
                        
                    
                        <a href="/dunjourn/outline.html">outline</a>
                    
                    
                    /
                    
                    
                        <a href="https://bnemeton.neocities.org">neocities</a>
    </nav>`;
}

}

customElements.define('nav-bar', NavBar);