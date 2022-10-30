import { NextApiRequest, NextApiResponse } from "next";
import { Canvas, loadImage, loadFont, Image } from "canvas-constructor/cairo";

function toBuffer(ab: ArrayBuffer) {
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}
export async function getBuffer(url: string) {
    const response = await fetch(url, {
        headers: {
            "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "range": "bytes=0-",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "video",
            "Referer": url,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
    });
    let buffer = await response.arrayBuffer();
    return {
        buffer: toBuffer(buffer),
        mimetype: response.headers.get('content-type'),
        fileName: response.headers.get('content-disposition')
    }
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    loadFont('./assets/fonts/edosz.ttf', { family: "Edo SZ" })
    loadFont("./assets/fonts/BebasNeue-Regular.ttf", { family: "BebasNeue" })
    let candidato = req.query.type as string
    let text = req.query.text as string

    let { buffer } = await getBuffer(req.query.image as string)
    let img: Image = await loadImage(buffer);

    let canvas = new Canvas(1080, 1080)
    canvas.printImage(img, 0, 0, 1080, 1080)

    console.log(candidato)
    if (candidato == 'bolsonaro') {
        canvas.setTextFont('130px Edo SZ')
        canvas.setColor('rgb(2,102,30)')
        canvas.printText(text, Number(req.query.x), Number(req.query.y))
    } else if (candidato == 'bolsonaro 2') {
        let values = {
            x: 150,
            letter: 160
        }
        if(text.length > 6){
            values.x = values.x - text.length * 10 // mudar a posição do nome
        } 
        if(text.length > 8) {
            values.letter = values.letter - text.length - 30 // mudar a posição do nome
        }
        canvas.rotate(-10 * Math.PI / 180);
        canvas.setTextFont(`${values.letter}px Edo SZ`);
        canvas.setColor("rgb(253,213,3)")
        canvas.printText(text, values.x, 480)
    } else if (candidato == 'lula') {
        let values = {
            name_x: 460,
            back_x: 336,
            back_w: 380
        }
    
        if (text.length > 5) {
            values.back_w = values.back_w + (text.length - 5) * 70 // mudar o tamanho do fundo do nome
            values.back_x = values.back_x - (text.length - 5) * 30 // mudar a posição do fundo do nome
        }
    
        canvas.setColor("rgb(30,189,78)")
        canvas.rotate(-2 * Math.PI / 180);
        canvas.createRoundedClip(values.back_x, 261, values.back_w, 207, 10)
        canvas.setTransform(1, 0, 0, 1, 0, 0);
        canvas.fill()

    
        canvas.rotate(-2 * Math.PI / 180);
        canvas.setTextFont('190px BebasNeue');
        canvas.setColor("white")
    
        values.name_x = values.name_x - text.length * 25 // mudar a posição do nome
        canvas.printText(text, values.name_x, 430)
    } else if (candidato == 'lula 2') {
        let values = {
            x: 330,
            letter: 170
        }
        if(text.length > 6){
            values.x = values.x - text.length * 25 // mudar a posição do nome
        } 
        if(text.length > 8) {
            values.letter = values.letter - text.length - 30 // mudar tamanho da letra
        }
        canvas.rotate(-8 * Math.PI / 180);
        canvas.setTextFont(`${values.letter}px Edo SZ`)
        canvas.setColor("rgb(253,213,3)")
        canvas.printText(text, values.x, 480)
    }
    res.status(200).json({
        data: 'data:image/png;base64,' + (await canvas.toBufferAsync()).toString('base64')
    })
}
