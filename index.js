const axios = require('axios').default;
const xml2js = require('xml2js');
const fs = require('fs/promises');
let coordenadas = [];

const convert = async () => {
    try {

        const fileName = 'piura';

        const data = await fs.readFile('./'+fileName+'.kml', { encoding: 'utf8' });

        xml2js.parseString(data, (err, result) => {
            if (err) {
                throw err;
            }
            const json = JSON.stringify(result, null, 4);

            result.kml.Document.map(x => {
                const placeMark = x.Placemark;
                placeMark.map((x, i) => {
                    //console.log(i)
                    const Polygon = x.Polygon || null;

                    const area = []

                    if (Polygon != null) {
                        //console.log("=============Polygon===========",i)
                        let coordinates = Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates;
                        coordinates = coordinates.toString();
                        //coordinates = coordinates.replace("              ","");

                        const coords = [];
                        coordinates = coordinates.split(",0");

                        for (let i = 0; i < coordinates.length - 1; i++) {
                            //x = coordinates[i].replace("               ","");

                            x = coordinates[i].trim()



                            let lng = Number(x.split(",")[0])
                            let lat = Number(x.split(",")[1])

                            let geo = {
                                lat,
                                lng

                            }

                            coords.push(geo)

                        }

                        coordenadas.push(coords)




                    }



                })

                console.log(coordenadas)

                fs.writeFile("./output/"+fileName+".json", JSON.stringify(coordenadas), 'utf8', function (err) {
                    if (err) {                       
                        return console.log(err);
                    }

                    console.log("JSON generado.");
                });


            });



        })

    } catch (err) {
        console.log(err);
    }
}

convert();





