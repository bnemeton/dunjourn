class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<nav class="navbar"> 
            <a href="/">home</a>
            /
                        <a href="/about.html">about</a>
                    
                    
                  /
                        
                    
                        <a href="/outline.html">outline</a>
                    
                    
                    /
                    
                    
                        <a href="https://bnemeton.neocities.org">neocities</a>
    </nav>`;
}

}

customElements.define('nav-bar', NavBar);