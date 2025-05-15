const load = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("../models");
}

const detect = async () => {
    await load();

    //Detecção dos rostos usando o método da face api
    const inputImage = document.getElementById("inputImage");
    const detections = await faceapi.detectAllFaces(inputImage);
    console.log(`Rostos detectados: ${detections.length}`);
    console.log(detections);
    
    //Configuração do canvas para que ele esteja sobreposto à imagem
    const canvas = document.getElementById("imageOverlay");
    canvas.style.position = "absolute";
    canvas.style.left = inputImage.offsetLeft;
    canvas.style.top = inputImage.offsetTop;
    canvas.style.width = inputImage.width;
    canvas.style.height = inputImage.height;

    //Exibindo as caixas de detecção dos rostos
    const displaySize = {width: inputImage.width, height: inputImage.height};
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.matchDimensions(canvas, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);

    /*
    Explicação da solução do desafio:
    Utilizando os vetores canônicos do R3, podemos descrever qualquer ponto do espaço
    como ai + bj + ck, em que a, b e c são números reais e i, j e k são os vetores
    unitários que apontam no sentido de crescimento dos eixos x, y e z, respectivamente.
    Como o método de detecção retorna as coordenadas x e y de um ponto de cada caixa, nós
    já temos os valores a e b. Assim, podemos usar o produto vetorial ai x bj para descobrir
    o vetor ck, conseguindo assim uma estimativa da distância até a câmera
    */
}

detect();