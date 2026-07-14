const Tesseract = require("tesseract.js");
const { PDFParse } = require("pdf-parse");
const pdf = require("pdf-poppler");
const mammoth = require("mammoth");

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");


// Main function

const extractText = async(filePath)=>{


    const extension =
    path.extname(filePath)
    .toLowerCase();



    console.log(
        "Extracting:",
        extension
    );



    // IMAGE FILES
    if(
        extension === ".png" ||
        extension === ".jpg" ||
        extension === ".jpeg"
    ){

        return await extractImage(filePath);

    }



    // PDF FILES

    if(extension === ".pdf"){

        return await extractPDF(filePath);

    }



    // DOCX FILES

    if(extension === ".docx"){

        return await extractDOCX(filePath);

    }



    // DOC FILES

    if(extension === ".doc"){

        const docxPath =
        await convertDOCtoDOCX(filePath);


        return await extractDOCX(docxPath);

    }



    return "Unsupported file type";

};




// IMAGE OCR

async function extractImage(filePath){


    const result =
    await Tesseract.recognize(
        filePath,
        "eng"
    );


    return result.data.text;

}



// PDF extraction

async function extractPDF(filePath){

    const buffer = fs.readFileSync(filePath);


    const parser = new PDFParse({
        data: buffer
    });


    const data = await parser.getText();


    await parser.destroy();



    if(data.text && data.text.trim().length > 20){

        return data.text;

    }


    console.log("Scanned PDF detected");


    return await extractScannedPDF(filePath);

}



// Scanned PDF OCR

async function extractScannedPDF(filePath){


    const outputFolder =
    path.join(
        "uploads",
        "pdfimages"
    );



    if(!fs.existsSync(outputFolder)){

        fs.mkdirSync(
            outputFolder,
            {
                recursive:true
            }
        );

    }



    await pdf.convert(

        filePath,

        {
            format:"png",
            out_dir:outputFolder,
            out_prefix:"page",
            scale:3000
        }

    );



    const images =
    fs.readdirSync(outputFolder);



    let text="";



    for(let image of images){


        const result =
        await Tesseract.recognize(

            path.join(
                outputFolder,
                image
            ),

            "eng"

        );


        text +=
        result.data.text + "\n";


    }


    return text;

}




// DOCX extraction

async function extractDOCX(filePath){


    const result =
    await mammoth.extractRawText(
        {
            path:filePath
        }
    );


    return result.value;

}





// DOC -> DOCX

function convertDOCtoDOCX(filePath){


return new Promise(
(resolve,reject)=>{


const command =
`libreoffice --headless --convert-to docx --outdir uploads "${filePath}"`;



exec(
command,
(error)=>{


if(error){

reject(error);

return;

}



const docxFile =
path.join(

"uploads",

path.basename(filePath)
.replace(
".doc",
".docx"
)

);



resolve(docxFile);



});


});


}




module.exports = extractText;