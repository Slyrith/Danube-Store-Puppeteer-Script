const puppeteer  = require('puppeteer');

async function main() {
    const start = Date.now();

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage();
    await page.goto('https://danube-webshop.herokuapp.com/', { waitUntil: 'networkidle2' })

    await page.waitForSelector('ul.sidebar-list');

    await Promise.all([
        page.waitForNavigation(), 
        page.click("ul[class='sidebar-list'] > li > a"), 
]);

    await page.waitForSelector("li[class='preview']");
    const books = await page.evaluateHandle(
        () => [...document.querySelectorAll("li[class='preview']")]
    )

    const processed_data = await page.evaluate(elements => {
        let data = []
        elements.forEach( element =>
            {
                let title = element.querySelector("div.preview-title").innerHTML;
                let author = element.querySelector("div.preview-author").innerHTML;
                let rating = element.querySelector("div.preview-details > p.preview-rating").innerHTML;
                let price = element.querySelector("div.preview-details > p.preview-price").innerHTML;
                
                let result = {title: title, author: author, rating: rating, price: price}
                data.push(result);
            })
        return data
    }, books)
    
    console.log(processed_data)
    await page.close();
    await browser.close();

    const end = Date.now();
    console.log(`Execution time: ${(end - start) / 1000} s`);
}

main();
