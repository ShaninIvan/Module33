function createPortfolio(){
    $.getJSON('js/portfolio.json', function(data) { 
        $.each(data, function(key){
            const work = (data[key]);
            
            const name = work.name;
            const link = work.link;
            const tags = work.tags;
    
            let element = `<div class="portfolio__item">
                                <div class="portfolio__item-name">${name}</div>
                                <div><a href=${link}>Репозиторий на Github</a></div>
                                <div class="portfolio__item-tags">Теги: ${tags}</div>
                            </div>`;
            document.querySelector('.about__portfolio').innerHTML += element;
            
        })
    }); 
}

$(document).ready(createPortfolio);



