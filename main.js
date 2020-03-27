const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const retry = require('@beyonk/promise-retry');
const source = require("./source.json")

main(source[process.argv[2]]);

// https://futurestud.io/tutorials/download-files-images-with-axios-in-node-js
async function downloadImage(url, path) {
   const writer = fs.createWriteStream(path);
   const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
   });
   response.data.pipe(writer)
   return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
   });
}

async function main({ url, rootDirPath, chapterZeroTitle }) {
   rootDirPath = path.join("output", rootDirPath);
   let response = await axios.get(url);
   let $ = cheerio.load(response.data);
   let scriptStr = $('body > script')[0].children[0].data;
   let window = {};
   eval(scriptStr);
   var chapters = window.__NUXT__.data[0].chapters;
   fs.ensureDirSync(rootDirPath);
   fs.writeFileSync(path.join(rootDirPath, 'metadata.json'), JSON.stringify(chapters, null, 2));

   for (let i = 0; i < chapters.length; i++) {
      console.log(`\n=======\nChương ${i}:`);
      let chapter = chapters[i];
      if (i == 0) {
         var title = chapterZeroTitle
      }
      else title = chapter.title;
      if (title == null)
         continue;
      title = title.replace(/:/g, '∶').trim();
      let metadata = {
         title: title,
         author: (chapter.author || '').trim(),
         intro: (chapter.intro || '').trim(),
         start_time: (chapter.start_time || '').trim(),
      };
      let pages = chapter.ext[0].value.map(page => ({
         url: page.url,
         name: page.name,
      }));
      let chapterDirPath = path.join(rootDirPath, title);
      fs.ensureDirSync(chapterDirPath);
      fs.writeFileSync(path.join(chapterDirPath, 'metadata.json'), JSON.stringify(metadata, null, 2));
      for (let a = 0; a < pages.length; a++) {
         let page = pages[a];
         let outputName = `${a}_${page.name}`
         console.log(page.url + " => " + outputName);
         await retry(
            downloadImage.bind(undefined, page.url, path.join(chapterDirPath, outputName)),
            2, 1000
         );
      }
   }
}