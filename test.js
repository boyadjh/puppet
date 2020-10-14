const puppeteer = require("puppeteer");

const MATH = 0;
const SOFT = 1;

class Clocker {
    constructor(){
    }
    async run() {
        this.cycle();
        
    }

    async cycle(){
        const b = await this.getBrowser();
        const p = await this.getPage(b);
        await p.goto('https://bplogix.otech.edu/form.aspx?pid=19acaaba-4750-43c5-b564-c488aeb093a0&formid=6a8eddcf-949c-4539-b0d6-2d4301c02945&nohome=0&completepageprompt=0&completepage=https%3A%2F%2Fbplogix.otech.edu%2Fform.aspx%3Fpid%3D19acaaba-4750-43c5-b564-c488aeb093a0%26formid%3D1828e333-8234-4052-8ff3-17931935025a&completetext=');
        await this.clockin(p, MATH);
        //wait
        await p.waitForSelector("#ctl01_ctl13");
        await this.clockout(p);
        setTimeout(async() => {this.close(b)}, 10000);
    }

    async clockout(p){
        let input = await p.$('#ctl01_ctl13');
        await (await input.$x(".."))[0].click();
        await p.waitForSelector("#ctl01_ButtonAreaClockIn");
        await this.submitatt(p);
    }

    async submitatt(p){
        //await p.click("#ctl01_ButtonAreaClockIn");
        console.log("SUBMIT");
    }

    async clockin(p,clss) {
        await this.typeId(p);
        await p.waitForSelector("#ctl01_Dropdown_EnrollIn_Dropdown_EnrollIn");
        await this.selectClass(p,clss);
        await p.waitForSelector("#ctl01_IsThisYouRadio_0");
        await this.thatsMe(p);
    }

    async selectClass(p,clss){
        //let dropdown = p.$("#ctl01_Dropdown_EnrollIn_Dropdown_EnrollIn");
        if(clss==MATH) {
            await p.select("#ctl01_Dropdown_EnrollIn_Dropdown_EnrollIn", "Math for Software Technology");
        } else {

        }
    }

    async thatsMe(p){
        await p.click('#ctl01_IsThisYouRadio span');
    }

    async typeId(p){
        await p.type("#ctl01_StudentID_StudentID", "4400108319");
        await p.click("#ctl01_ButtonGetStudentInfo_ButtonGetStudentInfo_ButtonGetStudentInfo");
    }

    async close(b) {
        await b.close();
    }
    async getPage(b){
        let pages = await b.pages();
        return pages[0];
    }
    async getBrowser(){
        return await puppeteer.launch({headless: false});
    }
}



(async() => {
    console.log("making clocker");
    let c = new Clocker();
    c.run();
})();
//go to page
//every 24 hours:
//      type number
//      select class
//      clock in
//      wait roughly 3 hours
//      clock out