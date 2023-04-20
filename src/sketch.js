let capture
let detector


let sopra_dx
let sopra_sx
let sotto_dx
let sotto_sx
let frames = 60

let eyes = []




function preload() {
//   occhio1 = loadImage("occhio_1.png")
//   occhio2 = loadImage("occhio_2.png")

for (let i = 0; i<2; i++) {
	eyes[i] = loadImage('./occhio_' + i + '.png')
}
  sopra_dx = loadImage ("sopra_dx.png")
  sopra_sx = loadImage ("sopra_sx.png")
  sotto_dx = loadImage ("sotto_dx.png")
  sotto_sx = loadImage ("sotto_sx.png")
  corpo_dx = loadImage ("corpo_dx.png")
  corpo_sx = loadImage ("corpo_sx.png")	

}



async function setup() {


// occhio_2 = loadImage  ('3_landmarks_p5/occhio_2.png')
// occhi o_1 = loadImage  ('3_landmarks_p5/occhio_1.png')



	createCanvas(640, 480)

	capture = createCapture(VIDEO)
	capture.size(640, 480)
	capture.hide()
	
	console.log("Carico modello...")
	detector = await createDetector()
	console.log("Modello caricato.")


}
		
	function keypressed ( ) {
		if (key=="f") {
			const option = {
				units: "frames",
				delay:0
			}
			saveGif (prova.gif, frames)
		}
	}	

async function draw() {
	
	background(255)
	
	//Disegna la webcam sullo stage, a specchio
	push()
	scale(-1, 1)
	image(capture, -640, 0)
	pop()

		
	// for (let i=0; i<10; i++) {
	// 	const o = (floor(frameCount/3) + i) % eyes.length
	// 	image(eyes[o],100, 75, 100, 75)
	// }
	

	if (detector && capture.loadedmetadata) {
		const hands = await detector.estimateHands(capture.elt, { flipHorizontal: true })

		if (hands.length == 1) {
			const hand = hands[0]
			const mancino = hand.handedness == "Left" 
			
			const mignolo = hand.keypoints[15]
			const indice = hand.keypoints[18] 
			const pollice = hand.keypoints[3]
			const polso = hand.keypoints[0]
			// noStroke()
			// fill(0,0,0) 			
			// ellipse(mignolo.x, mignolo.y, 20, 20)

			let sopra_scala = 0.6
			let sotto_scala = 0.6
			let corpo_scala = 0.6
			if (mancino) {
				let sopra_x = -100 * sopra_scala
				let sopra_y = -100 * sopra_scala	
				let sotto_x = -200 * sopra_scala
				let sotto_y = -100 * sopra_scala	
				let corpo_x = -120 * sopra_scala	
				let corpo_y = -120 * sopra_scala
				
				image(corpo_sx, polso.x +corpo_x, polso.y +corpo_y,corpo_sx.width *corpo_scala,corpo_sx.height *sopra_scala );
				image(sotto_sx, pollice.x + sotto_x, pollice.y + sotto_y, sotto_sx.width * sotto_scala,sotto_sx.height * sotto_scala );
				image(sopra_sx, indice.x + sopra_x, indice.y + sopra_y, sopra_sx.width * sopra_scala,sopra_sx.height * sopra_scala );
			} else {
				let sopra_x = -200 * sopra_scala
				let sopra_y = -100 * sopra_scala
				let sotto_x = -100 * sopra_scala
				let sotto_y = -100 * sopra_scala
				let corpo_x = -100 * sopra_scala	
				let corpo_y = -100 * sopra_scala
					
				image(corpo_dx, polso.x + corpo_x, polso.y + corpo_y, corpo_dx.width * corpo_scala,corpo_dx.height * corpo_scala );
				image(sotto_dx, pollice.x + sotto_x, pollice.y + sotto_y, sotto_dx.width * sotto_scala,sotto_dx.height * sotto_scala );
				image(sopra_dx, indice.x + sopra_x, indice.y + sopra_y, sopra_dx.width * sopra_scala,sopra_dx.height * sopra_scala );
			}
			

			let occhio_scala = 0.20
			let occhio_x = -200 * occhio_scala
			let occhio_y = -500 * occhio_scala
			let occhio_size = 400
			

			if (frameCount % 100) {
				img = eyes[0]

			}
			else  {
				img = eyes[1]
			}

			image( img, indice.x + occhio_x, indice.y + occhio_y, occhio_size * occhio_scala, occhio_size * occhio_scala );
		
		
		
			// image(occhio, mignolo.x -130, mignolo.y -160);
			// const pollice = hand.keypoints[4]
			

			// stroke(255,0,0)
			// strokeWeight(5)
			// line (pollice.x, pollice.y, indice.x, indice.y)
		}		
	}
}

async function createDetector() {
	// Configurazione Media Pipe
	// https://google.github.io/mediapipe/solutions/hands
	const mediaPipeConfig = {
		runtime: "mediapipe",
		modelType: "full",
		maxHands: 2,
		solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands`,
	}
	
	return window.handPoseDetection.createDetector( window.handPoseDetection.SupportedModels.MediaPipeHands, mediaPipeConfig )
}