const load = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("../models");
}

const calculate_distance = (resizedDetections) => {
    /*
    Explicação da solução do desafio:
    Como é possível criar uma escala numérica relativa, definirei que a distância
    da câmera atéo rosto do homem na esquerda da imagem como 1. A partir disso, pode-se
    descobrir as distâncias até as outras pessoas por meio de uma relação inversamente
    proporcional entre a área do rosto da pessoa e a distância em que ela está. Assim,
    essa distância, que chamarei de d, é dada por d = A / A', em que A é a área do rosto
    do homem à esquerda da imagem e A' é a área do rosto de alguma das pessoas da foto.
    */

    //Obtém as áreas dos rostos e as pontuações.
    const faceAreas = [], faceScores = [];
    resizedDetections.forEach(element => {
        faceAreas.push(element._box.area);
        faceScores.push(element._score);
    });

    //As áreas e as pontuações podem ser ordenadas separadamente,
    //pois a pontuação é diretamente proporcional ao tamanho do rosto.
    faceAreas.sort();
    faceScores.sort();
    
    //Realiza o cálculo da distância relativa e usa a pontuação
    //para identificar o rosto.
    const referenceArea = faceAreas[faceAreas.length - 1];
    let distanceToCamera;
    for(let i = faceAreas.length - 1; i > -1; i--){
        distanceToCamera = referenceArea / faceAreas[i];
        console.log(`Pontuação: ${faceScores[i]} - Distancia até a câmera: ${distanceToCamera}`);
    }
}

const detect = async () => {
    await load();

    //Detecção dos rostos usando o método da face api.
    const inputImage = document.getElementById("inputImage");
    const detections = await faceapi.detectAllFaces(inputImage);
    console.log(`Rostos detectados: ${detections.length}`);
    
    //Configuração do canvas para que ele esteja sobreposto à imagem.
    const canvas = document.getElementById("imageOverlay");
    canvas.style.position = "absolute";
    canvas.style.left = inputImage.offsetLeft;
    canvas.style.top = inputImage.offsetTop;
    canvas.style.width = inputImage.width;
    canvas.style.height = inputImage.height;

    //Exibindo as caixas de detecção dos rostos.
    const displaySize = {width: inputImage.width, height: inputImage.height};
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.matchDimensions(canvas, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);

    calculate_distance(resizedDetections);
}

detect();