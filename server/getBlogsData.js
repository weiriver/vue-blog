const fs = require('fs')
const path = require('path')
let blogsPath = path.resolve(__dirname, '../blogs')
const PDFParser = require('pdf2json')

let pdfParser = new PDFParser(this, 1)

function analysisDirectory(targetPath) {
  // return new Promise((resolve, reject) => {
  // })
  let arr = fs.readdirSync(targetPath)
  arr.forEach(v => {
    let target = path.resolve(targetPath, v)
    var stat = fs.lstatSync(target)
    var is_direc = stat.isDirectory() // true || false 判断是不是文件夹
    if (!is_direc) { // 是文件
      if (/\.pdf$/.test(v)) {
        decodePdf(target)
      } else if (/\.md$/.test(v)) {
        decodeMd(target, v, target)
      }
    } else { // 文件夹
      analysisDirectory(target)
    }
  })
}

analysisDirectory(blogsPath)


function decodePdf(target) {
  // pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError))
  // pdfParser.on('pdfParser_dataReady', pdfData => {
  //   // fs.writeFile('./pdf2json/test/F1040EZ.json', JSON.stringify(pdfData))
  //   // console.log(pdfData.formImage.Pages[0].Texts)
  //   // console.log(JSON.stringify(Object.keys(pdfParser)))
  //   // fs.writeFileSync('./pdf.txt', pdfParser.getRawTextContent())
  // })
  //
  // pdfParser.loadPDF(target)
}

function decodeMd(target, name, fullPath) {
  let path = fullPath.replace('D:\\delete\\vue-blog\\blogs\\', '')
  let arr = path.split('\\')
  let newArr = arr.splice(0, arr.length - 1)
  let fileName = name
  newArr = newArr.map(v => {
    if (/^(\d{1,2}\.)/g.test(v)) {
      v = v.substr(3, v.length - 3)
      return v
    }
    return v
  })
  if (/^(\d{1,2}\.)/g.test(fileName)) {
    fileName = fileName.substr(3, fileName.length - 3).trim()
  }
  console.log('文件名是-', fileName, '标签是-', newArr)


  // console.log(fs.readFileSync(target, 'utf-8'))
}
