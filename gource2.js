const fs = require('fs')
const {exec, execSync} = require('child_process')


// to do: create a csv file with the list of repos we want to gourcify
// use this csv list to replace the 'cwd' in the exec at line 28...
fs.unlinkSync('./append.txt')
var stream = fs.createWriteStream("./append.txt", {flags:'a'});


fs.unlinkSync('./captionFile.txt')
var captionFile = fs.createWriteStream("./captionFile.txt", {flags:'a'});

counter = 1
let commit;
let repoNumber = 0
function getLog(){

  if (repoNumber > 5) {
    exec('cat append.txt | sort -n > combined.txt')

    runGource()
    return
  }
  else {
    repoNumber++

    exec('git log --after="2019-10-24 12:00:00" --reverse --pretty=format:"%at|%an|%s" --name-status', {cwd: '../gitshow' + repoNumber}, (stdout,stderr,err) =>{
      // console.log(stdout, stderr[0], err)

      let log = stderr.split('\n\n')

      // console.log(log[0])
      let msg;
      let utc;
      let name;
      let uniqueCaption;
      for (i = 0; i<log.length; i++){
        let container = log[i].split('\n')
        for (k = 0; k<container.length; k++){
          if (k === 0){
            msg = container[0].split("|")[2]
            utc = container[0].split('|')[0]
            name = container[0].split('|')[1]
            // console.log(container[0])
          } else {
            // console.log()
            if (container[k].split('\t')[0]){
              let file = container[k].slice(1).trimLeft()

              let subDir = file.split('/')[0]

              if(subDir === 'docsa' || subDir === "admina"){
                // do nothing
              } else {
                writeThis = utc + '|' + name + '|' + container[k].split('\t')[0] + '|' + '/gitshow' + repoNumber + '/' + file
                stream.write(writeThis + "\n");
                if(uniqueCaption !== utc+msg){
                  captionFile.write(utc + '|' + msg + "\n");
                }
                uniqueCaption = utc+msg
                  // console.log()
              }
              

            }
          }
        }
        
        
      }

      getLog()
    })
  }
}

getLog(repoNumber)


function runGource(){
  exec('gource combined.txt --title "traces of ideation in gitshow repositories" --seconds-per-day 5 --auto-skip-seconds 0.1 -i 0 --key --max-files 0 --hide-root --caption-file captionFile.txt -1280x720 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4')
}
// str.substr(0,str.indexOf(' ')); // "72"
// str.substr(str.indexOf(' ')+1); // "tocirah sneab"


// let repos = []
// function getLog(repoNum){
//   if(counter > 5){
//     exec('cat log1.txt log2.txt log3.txt log4.txt log5.txt | sort -n > combined.txt')
//     let log = fs.readFileSync('./combined.txt', 'utf-8').split('\n')
//     // fs.writeFileSync('./thinned.txt', '', 'utf-8')
//     for (i = 0; i<log.length; i++){
//       if(log[i].includes('/docs/')){
        
//       } else if(log[i].includes('/admin/')){

//       } else {
//         console.log(log[i])
//         stream.write(log[i] + "\n");
//       }
//     }
//     return
//   } else {
//     exec('gource --start-date "2019-10-24 13:00:00" --output-custom-log log' + repoNum + '.txt ../gitshow' + repoNum, (stdout, stderr, err)=>{
//       counter++
//       // console.log(stdout,stderr,err)
//       exec('sed -i -r "s#(.+)\|#\1|\.\.\/gitshow' + repoNum + '#" log' + repoNum + '.txt', (stdout, stderr, err) =>{

        
//       })
      
//       getLog(counter)
//     })    
//   }

// }

// getLog(counter)

// gource append.txt --title "traces of ideation in gitshow repositories" --auto-skip-seconds 2 -i 0 -e 0.5 --key --max-files 0


// console.log(new Date().toISOString());
// [...Array(10000)].forEach( function (item,index) {
//     stream.write(index + "\n");
// });
// console.log(new Date().toISOString());

