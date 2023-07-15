const { Toolkit } = require('actions-toolkit');
const jsonc = require('jsonc');
const fs = require('fs');

const appRoot = `${process.env.GITHUB_WORKSPACE}`;
const targetDir = process.env.INPUT_TARGET_DIRECTORY;
const workingDir = `${appRoot}/${targetDir}`;
const genres = ["Manga", "Novel", "Illust", "CD", "Goods", "PhotoAlbum","Anthology", "Contribution", "Consideration"];

Toolkit.run(async tools => {
  try {
    const works = fs.readdirSync(workingDir);
    let hasUnknownGenre = 0;
    for(const work of works){
      // detail.jsoncの読み込み
      const readTargetDir = `${workingDir}/${work}`; 
      const detailPath = `${readTargetDir}/${process.env.INPUT_TARGET_JSONC}`;
      const detail = jsonc.parse(fs.readFileSync(detailPath, "utf-8"));
      // genreが存在していなければエラーを吐く
      if(genres.find(genre => genre === detail.genre) === undefined){
        hasUnknownGenre = 1;
        console.error(`不明なジャンル ${detail.genre} があります。コピー&ペーストで記入し直してみてください`);
      }
    }
    if(hasUnknownGenre){
      tools.exit.failure("has unknown genre");
    }
  } catch (e) {
    tools.log.fatal(e);
    tools.exit.failure('Failed');
  }
})
