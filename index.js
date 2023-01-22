import cheerio from 'cheerio'
import puppeteer from 'puppeteer'

async function start() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
          '--disable-gpu',
          '--no-sandbox'
        ]
    });
    try {
    const page = await browser.newPage()
    await page.goto('https://snapinsta.app/id/instagram-story-viewer')
    await page.type('input[name=userinsta]', 'yusril.id_', {delay: 20})
    const form = await page.$('#button-submit');
	await form.evaluate( form => form.click());
    await page.waitForTimeout(2000)
    const status = await page.$('#form-alert');
    await page.waitForTimeout(2000)
    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    let $ = cheerio.load(html), obj = {}
    obj.avatar = $('body > main > div.profile > div > div > div > div.profile-info > img').attr('src')
    // obj.username = $('div.username > h2').text()
    obj.fullname = $('#username').text()
    obj.description = $('#user-bio').text().trim()
    obj.followers = $('#follower_count').text()
    obj.following = $('#following_count').text()
    obj.totalpost = $('#post_count').text()
    obj.status = $('#form-alert').text() || 200
    if (obj.status === "The username you just entered is incorrect or this user has been deleted") {
        console.log("ada error")
        await browser.close()
    } else {
    console.log(obj)
    await browser.close()
    }
} catch (err) {
    console.log(err)
    await browser.close()
}
}
start()
